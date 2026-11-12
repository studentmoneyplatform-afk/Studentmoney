"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type JoinState = { status: "idle" | "ok" | "error"; message: string };

type JoinResult = {
  status: "ok" | "already" | "not_verified" | "not_open" | "not_signed_in";
  code: string | null;
};

/**
 * Joins an opportunity and issues the student's tracking code.
 *
 * Both halves happen inside join_opportunity, in one statement, because they
 * only make sense together: a participation without a code is a student who
 * has joined something they cannot refer anybody to. That used to be exactly
 * what happened -- referral_links had no insert policy, so the code was
 * always refused while the participation saved.
 *
 * The function also issues a code to a participation that is missing one, so
 * anyone stranded by that bug is repaired by joining again rather than
 * needing their row fixed by hand.
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

  const { data: opportunity } = await supabase
    .from("opportunities")
    .select("name")
    .eq("slug", slug)
    .eq("status", "live")
    .maybeSingle();

  const name = opportunity?.name ?? "that opportunity";

  const { data, error } = await supabase.rpc("join_opportunity", { p_slug: slug });

  if (error) {
    // 42883 is "function does not exist": the migration has not been applied.
    // Worth its own message, because every other failure here is transient
    // and this one will never fix itself by trying again.
    if (error.code === "42883") {
      return {
        status: "error",
        message: "Joining is not available yet. The database is missing a required update.",
      };
    }
    return { status: "error", message: "We could not join you. Try again shortly." };
  }

  const result = (Array.isArray(data) ? data[0] : data) as JoinResult | undefined;
  if (!result) {
    return { status: "error", message: "We could not join you. Try again shortly." };
  }

  switch (result.status) {
    case "not_signed_in":
      return { status: "error", message: "Sign in again to continue." };
    case "not_verified":
      return {
        status: "error",
        message:
          "Your account is not verified yet. We verify before a reward can be attributed to you.",
      };
    case "not_open":
      return { status: "error", message: "That opportunity is not open right now." };
    case "already":
    case "ok": {
      revalidatePath("/dashboard");
      revalidatePath("/dashboard/opportunities");
      const lead = result.status === "already" ? `You are already on ${name}.` : `You are on ${name}.`;
      return {
        status: "ok",
        message: result.code ? `${lead} Your link is ready.` : lead,
      };
    }
    default:
      return { status: "error", message: "We could not join you. Try again shortly." };
  }
}
