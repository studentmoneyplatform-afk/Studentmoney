import { describe, expect, it } from "vitest";
import { earnedSoFar, rewardCeiling, type RewardModel } from "@/lib/opportunities";

/**
 * These two functions decide what a person is owed. Everything else on the
 * site is presentation; this is the money.
 */

const perReferral: RewardModel = { kind: "per_referral", rewardUsd: 25 };
const proportional: RewardModel = { kind: "proportional", potUsd: 50, target: 100, unit: "referrals" };
const threshold: RewardModel = { kind: "threshold", rewardUsd: 35, target: 5, unit: "students" };

describe("earnedSoFar — per referral", () => {
  it("pays nothing for no referrals", () => {
    expect(earnedSoFar(perReferral, 0)).toBe(0);
  });
  it("pays the rate for each one", () => {
    expect(earnedSoFar(perReferral, 3)).toBe(75);
  });
  it("never goes negative, whatever the input", () => {
    expect(earnedSoFar(perReferral, -4)).toBe(0);
  });
  it("has no ceiling — this model is uncapped by design", () => {
    expect(earnedSoFar(perReferral, 1000)).toBe(25000);
  });
});

describe("earnedSoFar — proportional", () => {
  it("pays nothing at zero progress", () => {
    expect(earnedSoFar(proportional, 0)).toBe(0);
  });
  it("pays the matching share of the pot", () => {
    expect(earnedSoFar(proportional, 30)).toBe(15);
    expect(earnedSoFar(proportional, 70)).toBe(35);
  });
  it("pays the whole pot at target", () => {
    expect(earnedSoFar(proportional, 100)).toBe(50);
  });
  it("never pays more than the pot, however far past target", () => {
    expect(earnedSoFar(proportional, 250)).toBe(50);
  });
  it("never goes negative", () => {
    expect(earnedSoFar(proportional, -10)).toBe(0);
  });
  it("rounds to whole cents rather than carrying float noise", () => {
    const odd: RewardModel = { kind: "proportional", potUsd: 100, target: 3, unit: "x" };
    expect(earnedSoFar(odd, 1)).toBe(33.33);
  });
});

describe("earnedSoFar — threshold", () => {
  it("pays nothing below the target, even one short", () => {
    expect(earnedSoFar(threshold, 0)).toBe(0);
    expect(earnedSoFar(threshold, 4)).toBe(0);
  });
  it("pays in full exactly at the target", () => {
    expect(earnedSoFar(threshold, 5)).toBe(35);
  });
  it("pays the same past the target — it does not multiply", () => {
    expect(earnedSoFar(threshold, 50)).toBe(35);
  });
});

describe("rewardCeiling", () => {
  it("is the pot for a proportional reward", () => {
    expect(rewardCeiling(proportional)).toBe(50);
  });
  it("is the per-referral rate", () => {
    expect(rewardCeiling(perReferral)).toBe(25);
  });
  it("is the full reward for a threshold", () => {
    expect(rewardCeiling(threshold)).toBe(35);
  });
});
