import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { RewardModel } from "@/lib/opportunities";
import type { ReferralRow, EarningRow, ReferralStage } from "@/lib/dashboard-types";

/**
 * Everything the signed-in student's dashboard reads.
 *
 * Every query runs under the student's own session, so row level security is
 * what scopes the results — not a where-clause we could forget. Figures come
 * from opportunity_rewards, which the database recomputes from approved
 * referrals, so the dashboard cannot show a number the ledger would not pay.
 */

export type {
  ReferralStage,
  ReferralRow,
  EarningRow,
} from "@/lib/dashboard-types";
export { STAGE_LABEL, COUNTING_STAGES } from "@/lib/dashboard-types";

export type JoinedOpportunity = {
  participationId: string;
  slug: string;
  name: string;
  partner: string;
  reward: RewardModel;
  referralCode: string | null;
  approvedCount: number;
  pendingCount: number;
  target: number | null;
  earnedUsd: number;
  paidUsd: number;
};



export type DashboardData = {
  joined: JoinedOpportunity[];
  referrals: ReferralRow[];
  earnings: EarningRow[];
  totals: {
    approvedUsd: number;
    paidUsd: number;
    pendingUsd: number;
    approvedReferrals: number;
    pendingReferrals: number;
  };
};

const EMPTY: DashboardData = {
  joined: [],
  referrals: [],
  earnings: [],
  totals: {
    approvedUsd: 0,
    paidUsd: 0,
    pendingUsd: 0,
    approvedReferrals: 0,
    pendingReferrals: 0,
  },
};

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return EMPTY;

  const [participations, referralRows, paymentRows] = await Promise.all([
    supabase
      .from("participations")
      .select(
        `id,
         opportunities ( slug, name, partner, reward_kind, reward_usd, pot_usd, target, unit ),
         referral_links ( code ),
         opportunity_rewards ( approved_count, pending_count, target, earned_usd, paid_usd )`,
      )
      .order("joined_at", { ascending: false }),
    supabase
      .from("referral_events")
      .select(
        "id, referred_label, stage, rejected_reason, created_at, opportunities ( name, slug )",
      )
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("opportunity_payments")
      .select(
        "id, amount_usd, status, reference, created_at, paid_at, participations ( opportunities ( name ) )",
      )
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const joined: JoinedOpportunity[] = (participations.data ?? []).map((p) => {
    const o = one(p.opportunities);
    const link = one(p.referral_links);
    const ledger = one(p.opportunity_rewards);

    return {
      participationId: p.id,
      slug: o?.slug ?? "",
      name: o?.name ?? "Opportunity",
      partner: o?.partner ?? "",
      reward: toReward(o),
      referralCode: link?.code ?? null,
      approvedCount: Number(ledger?.approved_count ?? 0),
      pendingCount: Number(ledger?.pending_count ?? 0),
      target: ledger?.target ?? o?.target ?? null,
      earnedUsd: Number(ledger?.earned_usd ?? 0),
      paidUsd: Number(ledger?.paid_usd ?? 0),
    };
  });

  const referrals: ReferralRow[] = (referralRows.data ?? []).map((r) => {
    const o = one(r.opportunities);
    return {
      id: r.id,
      label: r.referred_label,
      opportunityName: o?.name ?? "Opportunity",
      opportunitySlug: o?.slug ?? "",
      stage: r.stage as ReferralStage,
      rejectedReason: r.rejected_reason,
      createdAt: r.created_at,
    };
  });

  const earnings: EarningRow[] = (paymentRows.data ?? []).map((p) => {
    const participation = one(p.participations);
    const o = participation ? one(participation.opportunities) : null;
    return {
      id: p.id,
      opportunityName: o?.name ?? "Opportunity",
      amountUsd: Number(p.amount_usd ?? 0),
      status: p.status,
      reference: p.reference,
      createdAt: p.created_at,
      paidAt: p.paid_at,
    };
  });

  const approvedUsd = joined.reduce((sum, j) => sum + j.earnedUsd, 0);
  const paidUsd = joined.reduce((sum, j) => sum + j.paidUsd, 0);

  return {
    joined,
    referrals,
    earnings,
    totals: {
      approvedUsd: round2(approvedUsd),
      paidUsd: round2(paidUsd),
      // Earned but not yet paid out.
      pendingUsd: round2(Math.max(approvedUsd - paidUsd, 0)),
      approvedReferrals: joined.reduce((sum, j) => sum + j.approvedCount, 0),
      pendingReferrals: joined.reduce((sum, j) => sum + j.pendingCount, 0),
    },
  };
}

/** PostgREST returns an embedded row as an object or a one-item array. */
function one<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

type OppRow = {
  reward_kind?: string;
  reward_usd?: number | string | null;
  pot_usd?: number | string | null;
  target?: number | null;
  unit?: string | null;
} | null;

function toReward(o: OppRow): RewardModel {
  const num = (v: number | string | null | undefined) => Number(v ?? 0);
  switch (o?.reward_kind) {
    case "proportional":
      return {
        kind: "proportional",
        potUsd: num(o.pot_usd),
        target: o.target ?? 1,
        unit: o.unit ?? "referrals",
      };
    case "threshold":
      return {
        kind: "threshold",
        rewardUsd: num(o.reward_usd),
        target: o.target ?? 1,
        unit: o.unit ?? "referrals",
      };
    default:
      return { kind: "per_referral", rewardUsd: num(o?.reward_usd) };
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
