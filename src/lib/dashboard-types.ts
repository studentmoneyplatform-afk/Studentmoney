/**
 * Types and labels shared by the dashboard's server and client components.
 *
 * Deliberately free of imports: dashboard-data.ts reaches for next/headers
 * through the Supabase server client, and a client component that imported
 * these from there would drag that into the browser bundle and break the
 * build.
 */

export type ReferralStage =
  | "clicked"
  | "registered"
  | "pending_verification"
  | "approved"
  | "rejected"
  | "paid";

export const STAGE_LABEL: Record<ReferralStage, string> = {
  clicked: "Clicked",
  registered: "Registered",
  pending_verification: "Pending verification",
  approved: "Approved",
  rejected: "Rejected",
  paid: "Reward paid",
};

/** Only these count toward a reward. Everything else is still in flight. */
export const COUNTING_STAGES: ReferralStage[] = ["approved", "paid"];

export type ReferralRow = {
  id: string;
  label: string;
  opportunityName: string;
  opportunitySlug: string;
  stage: ReferralStage;
  rejectedReason: string | null;
  createdAt: string;
};

export type EarningRow = {
  id: string;
  opportunityName: string;
  amountUsd: number;
  status: string;
  reference: string | null;
  createdAt: string;
  paidAt: string | null;
};
