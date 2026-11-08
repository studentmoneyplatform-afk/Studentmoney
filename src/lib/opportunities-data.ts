import { getSupabaseServerClient } from "@/lib/supabase/server";
import { OPPORTUNITIES, type Opportunity, type RewardModel } from "@/lib/opportunities";

/**
 * Reads the live opportunities.
 *
 * The database is the source of truth so an administrator can edit them
 * without a deploy. When Supabase is not configured — the static demo build,
 * for instance — the seeded definitions in opportunities.ts stand in, so the
 * marketing pages never render empty.
 */
export async function getLiveOpportunities(): Promise<Opportunity[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return OPPORTUNITIES;

  const { data, error } = await supabase
    .from("opportunities")
    .select(
      "slug, name, partner, summary, what_you_do, reward_kind, reward_usd, pot_usd, target, unit, display_order",
    )
    .eq("status", "live")
    .order("display_order");

  if (error || !data || data.length === 0) return OPPORTUNITIES;

  return data.map((row, i) => {
    const seed = OPPORTUNITIES.find((o) => o.slug === row.slug);
    return {
      slug: row.slug,
      index: row.display_order ?? i + 1,
      name: row.name,
      partner: row.partner,
      summary: row.summary,
      whatYouDo: row.what_you_do,
      reward: toRewardModel(row),
      headline: Number(row.pot_usd ?? row.reward_usd ?? 0),
      // Open questions live in code, not in the public table.
      toConfirm: seed?.toConfirm ?? [],
    };
  });
}

export async function getOpportunity(slug: string): Promise<Opportunity | undefined> {
  const all = await getLiveOpportunities();
  return all.find((o) => o.slug === slug);
}

type Row = {
  reward_kind: string;
  reward_usd: number | string | null;
  pot_usd: number | string | null;
  target: number | null;
  unit: string | null;
};

function toRewardModel(row: Row): RewardModel {
  const num = (v: number | string | null) => Number(v ?? 0);

  switch (row.reward_kind) {
    case "proportional":
      return {
        kind: "proportional",
        potUsd: num(row.pot_usd),
        target: row.target ?? 1,
        unit: row.unit ?? "referrals",
      };
    case "threshold":
      return {
        kind: "threshold",
        rewardUsd: num(row.reward_usd),
        target: row.target ?? 1,
        unit: row.unit ?? "referrals",
      };
    default:
      return { kind: "per_referral", rewardUsd: num(row.reward_usd) };
  }
}

/** One line describing how the reward is earned, for cards and headers. */
export function rewardLine(reward: RewardModel): string {
  switch (reward.kind) {
    case "per_referral":
      return `$${reward.rewardUsd} per successful referral`;
    case "proportional":
      return `$${reward.potUsd} across ${reward.target} ${reward.unit}, paid as you progress`;
    case "threshold":
      return `$${reward.rewardUsd} once ${reward.target} ${reward.unit} are confirmed`;
  }
}
