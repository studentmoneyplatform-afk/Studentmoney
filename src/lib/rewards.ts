/**
 * The reward economics, in one place.
 *
 * A student earns PROJECT_REWARD_USD for one qualifying project, released in
 * proportion to the client payments that have actually cleared. Of each
 * reward, WITHDRAWABLE_SHARE is cash the student can take out and the
 * remainder is held as the Grow share.
 *
 * Every figure the site quotes comes from here, so the marketing pages and
 * the ledger can never disagree.
 */

export const PROJECT_REWARD_USD = 25;
export const WITHDRAWABLE_USD = 20;
export const GROW_USD = PROJECT_REWARD_USD - WITHDRAWABLE_USD;
export const WITHDRAWABLE_SHARE = WITHDRAWABLE_USD / PROJECT_REWARD_USD;

export type RewardSplit = {
  /** Total earned so far across cleared client payments. */
  earned: number;
  /** The part of `earned` a student can withdraw. */
  cash: number;
  /** The part of `earned` held as the Grow share. */
  grow: number;
  /** Still unearned on this project. */
  remaining: number;
};

/**
 * Cumulative reward for a project.
 *
 * earned = reward x (cleared client payments / qualifying project price)
 *
 * Clamped to [0, reward] so an overpayment or a bad price can never mint
 * more than the campaign funds.
 */
export function rewardFor(
  clearedPayments: number,
  projectPrice: number,
  reward: number = PROJECT_REWARD_USD,
): RewardSplit {
  const progress =
    projectPrice > 0 ? Math.min(Math.max(clearedPayments / projectPrice, 0), 1) : 0;
  const earned = round2(reward * progress);
  return {
    earned,
    cash: round2(earned * WITHDRAWABLE_SHARE),
    grow: round2(earned * (1 - WITHDRAWABLE_SHARE)),
    remaining: round2(reward - earned),
  };
}

/** Reward at a given payment percentage, for illustration on the site. */
export function rewardAtProgress(
  progress: number,
  reward: number = PROJECT_REWARD_USD,
): RewardSplit {
  return rewardFor(progress, 1, reward);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
