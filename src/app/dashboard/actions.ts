"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type JoinState = { status: "idle" | "ok" | "error"; message: string };

/**
 * Joins an opportunity and issues the student's tracking code.
 *
 * Both inserts run as the student, so RLS decides whether they are allowed:
 * the participation policy requires a verified profile and a live
 * opportunity. Nothing here grants itself permission.
 */
export async function joinOpportunity(
  _prev: JoinState,
  formData: FormData,
): Promise<JoinState> {
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return { status: "error", message: "Which opportunity?" };

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return { status: "error", message: "Not connected yet. Nothing was saved." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Sign in again to continue." };

  const { data: opportunity } = await supabase
    .from("opportunities")
    .select("id, name")
    .eq("slug", slug)
    .eq("status", "live")
    .maybeSingle();

  if (!opportunity) {
    return { status: "error", message: "That opportunity is not open right now." };
  }

  const { data: participation, error: joinError } = await supabase
    .from("participations")
    .insert({ opportunity_id: opportunity.id, student_id: user.id })
    .select("id")
    .single();

  if (joinError) {
    // 23505 is the unique constraint: already joined, which is not a failure.
    if (joinError.code === "23505") {
      return { status: "ok", message: `You are already on ${opportunity.name}.` };
    }
    // 42501 is RLS: the profile is not verified yet.
    if (joinError.code === "42501") {
      return {
        status: "error",
        message:
          "Your account is not verified yet. We verify before a reward can be attributed to you.",
      };
    }
    return { status: "error", message: "We could not join you. Try again shortly." };
  }

  const { error: linkError } = await supabase
    .from("referral_links")
    .insert({ participation_id: participation.id, code: makeCode(slug) });

  if (linkError) {
    return {
      status: "error",
      message: "You joined, but the tracking code failed. Refresh and tell us if it persists.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/opportunities");
  return { status: "ok", message: `You are on ${opportunity.name}. Your link is ready.` };
}

/**
 * A short, unambiguous code. No 0/O or 1/I, because students read these
 * aloud and type them on phones.
 */
function makeCode(slug: string): string {
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let tail = "";
  for (let i = 0; i < 6; i++) {
    tail += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${slug.split("-")[0].toUpperCase().slice(0, 4)}-${tail}`;
}
