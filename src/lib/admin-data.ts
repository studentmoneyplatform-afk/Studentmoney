import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Reads for the admin console.
 *
 * These run under the signed-in staff member's session, so the admin-only
 * policies decide what comes back. Nothing here elevates privileges: a
 * non-admin calling these simply gets empty results, and the layout has
 * already turned them away.
 */

export type QueueRow = {
  id: string;
  label: string;
  email: string | null;
  phone: string | null;
  stage: string;
  createdAt: string;
  opportunityName: string;
  studentName: string;
};

export type ParticipationRow = {
  id: string;
  studentName: string;
  opportunityName: string;
  approvedCount: number;
  earnedUsd: number;
  paidUsd: number;
};

export type StudentRow = {
  id: string;
  fullName: string;
  phone: string;
  university: string | null;
  verifiedAt: string | null;
  isAdmin: boolean;
};

export type AuditRow = {
  id: string;
  action: string;
  entity: string;
  createdAt: string;
  detail: Record<string, unknown> | null;
};

export async function isAdmin(): Promise<boolean> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return false;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  return Boolean(data?.is_admin);
}

export async function getReviewQueue(): Promise<QueueRow[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("referral_events")
    .select(
      "id, referred_label, referred_email, referred_phone, stage, created_at, opportunities ( name ), profiles!referral_events_student_id_fkey ( full_name )",
    )
    .in("stage", ["registered", "pending_verification"])
    .order("created_at", { ascending: true })
    .limit(100);

  return (data ?? []).map((r) => ({
    id: r.id,
    label: r.referred_label,
    email: r.referred_email,
    phone: r.referred_phone,
    stage: r.stage,
    createdAt: r.created_at,
    opportunityName: one(r.opportunities)?.name ?? "Opportunity",
    studentName: one(r.profiles)?.full_name ?? "Student",
  }));
}

export async function getParticipations(): Promise<ParticipationRow[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("opportunity_rewards")
    .select(
      "participation_id, approved_count, earned_usd, paid_usd, opportunities ( name ), profiles ( full_name )",
    )
    .order("earned_usd", { ascending: false })
    .limit(200);

  return (data ?? []).map((r) => ({
    id: r.participation_id,
    studentName: one(r.profiles)?.full_name ?? "Student",
    opportunityName: one(r.opportunities)?.name ?? "Opportunity",
    approvedCount: Number(r.approved_count ?? 0),
    earnedUsd: Number(r.earned_usd ?? 0),
    paidUsd: Number(r.paid_usd ?? 0),
  }));
}

export async function getStudents(): Promise<StudentRow[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, phone, university, verified_at, is_admin")
    .order("created_at", { ascending: false })
    .limit(200);

  return (data ?? []).map((p) => ({
    id: p.id,
    fullName: p.full_name,
    phone: p.phone,
    university: p.university,
    verifiedAt: p.verified_at,
    isAdmin: Boolean(p.is_admin),
  }));
}

export async function getAuditTrail(): Promise<AuditRow[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("audit_log")
    .select("id, action, entity, created_at, detail")
    .order("created_at", { ascending: false })
    .limit(100);

  return (data ?? []).map((a) => ({
    id: a.id,
    action: a.action,
    entity: a.entity,
    createdAt: a.created_at,
    detail: a.detail as Record<string, unknown> | null,
  }));
}

function one<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}
