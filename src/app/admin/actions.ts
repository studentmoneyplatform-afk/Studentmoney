"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AdminState = { status: "idle" | "ok" | "error"; message: string };

/**
 * Every action calls a database function that re-checks the caller is staff.
 * The guard is never the hidden button: a non-admin who reaches these gets
 * 42501 from Postgres.
 */

async function client() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("not configured");
  return supabase;
}

export async function reviewReferral(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();

  if (decision === "rejected" && reason.length < 3) {
    return {
      status: "error",
      message: "A rejection needs a reason the student can read.",
    };
  }

  try {
    const supabase = await client();
    const { error } = await supabase.rpc("review_referral", {
      p_referral_id: id,
      p_decision: decision,
      p_reason: reason || null,
    });
    if (error) return { status: "error", message: humanise(error.message) };
  } catch {
    return { status: "error", message: "Not connected. Nothing was changed." };
  }

  revalidatePath("/admin/referrals");
  revalidatePath("/admin");
  return {
    status: "ok",
    message: decision === "approved" ? "Approved." : "Rejected, and the student was told.",
  };
}

export async function recordPayment(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const participationId = String(formData.get("participation_id") ?? "");
  const amount = Number(formData.get("amount") ?? 0);
  const reference = String(formData.get("reference") ?? "").trim();
  const rate = Number(formData.get("rate") ?? 0);

  if (!(amount > 0)) {
    return { status: "error", message: "Enter an amount above zero." };
  }

  try {
    const supabase = await client();
    const { error } = await supabase.rpc("record_payment", {
      p_participation_id: participationId,
      p_amount_usd: amount,
      p_rate_ngn_per_usd: rate > 0 ? rate : null,
      p_reference: reference || null,
    });
    if (error) return { status: "error", message: humanise(error.message) };
  } catch {
    return { status: "error", message: "Not connected. Nothing was changed." };
  }

  revalidatePath("/admin/payments");
  return { status: "ok", message: "Payment recorded and the student notified." };
}

export async function setVerified(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const studentId = String(formData.get("student_id") ?? "");
  const verified = formData.get("verified") === "true";

  try {
    const supabase = await client();
    const { error } = await supabase.rpc("set_student_verified", {
      p_student_id: studentId,
      p_verified: verified,
    });
    if (error) return { status: "error", message: humanise(error.message) };
  } catch {
    return { status: "error", message: "Not connected. Nothing was changed." };
  }

  revalidatePath("/admin/students");
  return { status: "ok", message: verified ? "Verified." : "Verification removed." };
}

export async function saveOpportunity(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const slug = String(formData.get("slug") ?? "");
  const patch = {
    name: String(formData.get("name") ?? "").trim(),
    partner: String(formData.get("partner") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    what_you_do: String(formData.get("what_you_do") ?? "").trim(),
    status: String(formData.get("status") ?? "live"),
  };

  if (!patch.name || !patch.summary) {
    return { status: "error", message: "Name and summary cannot be empty." };
  }

  try {
    const supabase = await client();
    const { error } = await supabase.from("opportunities").update(patch).eq("slug", slug);
    if (error) return { status: "error", message: humanise(error.message) };
  } catch {
    return { status: "error", message: "Not connected. Nothing was changed." };
  }

  revalidatePath("/admin/opportunities");
  revalidatePath("/opportunities");
  revalidatePath(`/opportunities/${slug}`);
  return { status: "ok", message: "Saved. The public page is updated." };
}

/** Postgres raises these deliberately; show them rather than a generic error. */
function humanise(message: string): string {
  if (message.includes("Only staff")) return "That action is staff only.";
  if (message.includes("must carry a reason")) {
    return "A rejection must carry a reason the student can read.";
  }
  if (message.includes("has been earned")) {
    return "That would pay more than this student has earned.";
  }
  return message;
}
