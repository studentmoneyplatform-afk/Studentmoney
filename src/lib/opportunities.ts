/**
 * The three live opportunities, exactly as the November 2026 student update
 * states them. Nothing here is invented: where the update is silent, the
 * field is marked TO CONFIRM rather than filled with a plausible guess.
 *
 * Reward mechanics differ per opportunity, so each carries its own shape:
 *   per_referral   — a flat reward each time a referral is approved
 *   proportional   — one pot released in proportion to progress toward a target
 *   threshold      — nothing until a target is met, then the full reward
 */

export type RewardModel =
  | { kind: "per_referral"; rewardUsd: number }
  | { kind: "proportional"; potUsd: number; target: number; unit: string }
  | { kind: "threshold"; rewardUsd: number; target: number; unit: string };

export type Opportunity = {
  slug: string;
  index: number;
  name: string;
  partner: string;
  summary: string;
  whatYouDo: string;
  reward: RewardModel;
  /** Displayed headline figure, e.g. "$25". */
  headline: number;
  /** Questions the update does not answer. Shown to admins, never invented. */
  toConfirm: string[];
};

export const OPPORTUNITIES: Opportunity[] = [
  {
    slug: "software-referrals",
    index: 1,
    name: "Software Service Referrals",
    partner: "Stormm approved providers",
    summary:
      "Refer a customer who purchases any of our software services and earn $25 per successful referral.",
    whatYouDo:
      "Introduce a business or individual who needs software built — a website, an app, an automation, an AI tool. When they buy, the referral is yours.",
    reward: { kind: "per_referral", rewardUsd: 25 },
    headline: 25,
    toConfirm: [
      "What counts as a purchase: deposit paid, or project completed?",
      "Is the $25 released proportionally as the client pays, as the original model set out?",
      "Any cap on referrals per student per month?",
    ],
  },
  {
    slug: "dare-company-global",
    index: 2,
    name: "DARE Company Global",
    partner: "DARE Company Global",
    summary:
      "Get 100 successful referrals for DARE Company Global and earn $50, paid in proportion to your progress.",
    whatYouDo:
      "Promote DARE Company Global and bring in referrals. You do not wait until the hundredth to see money: the reward is released as your count climbs.",
    reward: { kind: "proportional", potUsd: 50, target: 100, unit: "referrals" },
    headline: 50,
    toConfirm: [
      "What makes a DARE referral 'successful' — a sign-up, a purchase, or a verified action?",
      "Is progress paid at every milestone, or only at 30%, 70% and 100% as the update illustrates?",
      "Does the count reset each cycle?",
    ],
  },
  {
    slug: "tobi-music-academy",
    index: 3,
    name: "Tobi Music Academy",
    partner: "Tobi Music Academy (TMA)",
    summary: "Refer 5 students who enrol at Tobi Music Academy and earn $35.",
    whatYouDo:
      "Introduce people who want to learn an instrument or produce music. The reward lands once five of them have actually enrolled.",
    reward: { kind: "threshold", rewardUsd: 35, target: 5, unit: "students" },
    headline: 35,
    toConfirm: [
      "Does a student count on enrolment or after first payment?",
      "Is anything paid before the fifth student, or is it all-or-nothing?",
      "How long does a student have to enrol before the referral expires?",
    ],
  },
];

/** Milestones the student update illustrates for the proportional model. */
export const DARE_MILESTONES = [0.3, 0.7, 1] as const;

/** What a student has earned so far on an opportunity, given verified progress. */
export function earnedSoFar(reward: RewardModel, progress: number): number {
  switch (reward.kind) {
    case "per_referral":
      return round2(reward.rewardUsd * Math.max(progress, 0));
    case "proportional": {
      const share = Math.min(Math.max(progress / reward.target, 0), 1);
      return round2(reward.potUsd * share);
    }
    case "threshold":
      return progress >= reward.target ? reward.rewardUsd : 0;
  }
}

export function rewardCeiling(reward: RewardModel): number {
  return reward.kind === "proportional" ? reward.potUsd : reward.rewardUsd;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
