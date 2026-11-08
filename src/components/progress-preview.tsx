"use client";

import { useState } from "react";
import { Money } from "@/components/money";
import { Eyebrow, FinePrint } from "@/components/ui";
import { earnedSoFar, rewardCeiling, type RewardModel } from "@/lib/opportunities";
import { formatUsd } from "@/lib/money";

/**
 * Lets someone move a slider and watch what the reward would actually do.
 *
 * It reads the same earnedSoFar() the ledger uses, so it can never show a
 * figure the platform would not pay — including the threshold model, where
 * dragging most of the way still pays nothing.
 */
export function ProgressPreview({ reward }: { reward: RewardModel }) {
  const target = reward.kind === "per_referral" ? 10 : reward.target;
  const unit = reward.kind === "per_referral" ? "referrals" : reward.unit;
  const [count, setCount] = useState(
    reward.kind === "proportional"
      ? Math.round(target * 0.3)
      : Math.max(1, Math.floor(target / 2)),
  );

  const earned = earnedSoFar(reward, count);
  const ceiling = rewardCeiling(reward);
  const pct = Math.min((count / target) * 100, 100);
  const reached = reward.kind !== "threshold" || count >= target;

  return (
    <div className="rounded-[var(--radius-xl)] bg-forest p-6 text-[color:var(--on-dark-1)] sm:p-8">
      <Eyebrow tone="reversed">See how it builds</Eyebrow>

      <label htmlFor="count" className="mt-5 block font-bold">
        {count} approved {unit}
      </label>

      <input
        id="count"
        type="range"
        min={0}
        max={target}
        step={1}
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        className="mt-4 w-full accent-[color:var(--color-money-soft)]"
        aria-describedby="count-help"
      />

      <div className="mt-7">
        <p className="text-[color:var(--on-dark-3)]">
          {reached ? "You have earned" : "Earned so far"}
        </p>
        <div className="mt-2">
          <Money usd={earned} size="lg" tone="earned-reversed" />
        </div>
      </div>

      <div className="mt-6">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[color:var(--hair-reversed)]">
          <div
            className="h-full rounded-full bg-money-soft transition-[width] duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2.5 text-caption text-[color:var(--on-dark-3)]">
          {count} of {target} {unit}
          {reward.kind !== "per_referral" && ` · ${formatUsd(ceiling)} at the target`}
        </p>
      </div>

      <div className="mt-6" id="count-help">
        <FinePrint tone="reversed">
          {reward.kind === "threshold"
            ? `Nothing is released before ${target} ${unit}. Drag it and you will see that: the figure stays at zero until the target is met.`
            : reward.kind === "proportional"
              ? "Only approved referrals count. A click or a sign-up that fails verification does not move this."
              : "Only approved referrals count. A click that never becomes a purchase does not move this."}
        </FinePrint>
      </div>
    </div>
  );
}
