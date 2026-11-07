"use client";

import { useState } from "react";
import { Money } from "@/components/money";
import { RewardBar } from "@/components/reward-bar";
import { FinePrint } from "@/components/ui";
import { PROJECT_REWARD_USD, rewardFor } from "@/lib/rewards";
import { formatUsd } from "@/lib/money";

/**
 * Lets a student see the reward move before they commit to anything. The
 * figures come from the same rewardFor() the ledger uses, so this can never
 * quote a number the platform would not pay.
 */
export function RewardCalculator({ projectPrice = 1200 }: { projectPrice?: number }) {
  const [percent, setPercent] = useState(40);
  const cleared = (percent / 100) * projectPrice;
  const split = rewardFor(cleared, projectPrice);

  return (
    <div className="rounded-[var(--radius-card)] bg-forest p-6 text-cream sm:p-8">
      <label htmlFor="paid" className="eyebrow block text-hibiscus-light">
        Client has paid {percent}% of {formatUsd(projectPrice)}
      </label>

      <input
        id="paid"
        type="range"
        min={0}
        max={100}
        step={5}
        value={percent}
        onChange={(event) => setPercent(Number(event.target.value))}
        className="mt-5 w-full accent-[color:var(--color-hibiscus-light)]"
        aria-describedby="paid-help"
      />

      <div className="mt-7">
        <p className="text-cream/75">You have earned</p>
        <div className="mt-2">
          <Money usd={split.earned} size="lg" tone="earned-reversed" />
        </div>
      </div>

      <RewardBar
        cash={split.cash}
        grow={split.grow}
        total={PROJECT_REWARD_USD}
        className="mt-7"
      />

      <div className="mt-5" id="paid-help">
        <FinePrint tone="reversed">
          An illustration on a project priced at {formatUsd(projectPrice)}. The reward
          is the same {formatUsd(PROJECT_REWARD_USD)} whatever the project price, and
          it moves only on payments that have cleared.
        </FinePrint>
      </div>
    </div>
  );
}
