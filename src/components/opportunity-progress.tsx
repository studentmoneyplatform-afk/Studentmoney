import { Money } from "@/components/money";
import { FinePrint } from "@/components/ui";
import { formatUsd } from "@/lib/money";
import type { RewardModel } from "@/lib/opportunities";

/**
 * Progress on a joined opportunity, drawn the way that opportunity actually
 * pays. A proportional pot gets a filling bar; a threshold gets counted pips,
 * because "2 of 5" is the question a student is asking, not a percentage.
 */
export function OpportunityProgress({
  reward,
  approved,
  pending,
  earned,
}: {
  reward: RewardModel;
  approved: number;
  pending: number;
  earned: number;
}) {
  if (reward.kind === "per_referral") {
    return (
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-bold">
            {approved} approved {approved === 1 ? "referral" : "referrals"}
          </p>
          <Money usd={earned} size="sm" tone="earned" showNgn={false} />
        </div>
        <div className="mt-2">
          <FinePrint>
            {formatUsd(reward.rewardUsd)} each.{" "}
            {pending > 0
              ? `${pending} more being verified — not counted yet.`
              : "Nothing is counted until it is approved."}
          </FinePrint>
        </div>
      </div>
    );
  }

  if (reward.kind === "proportional") {
    const pct = Math.min((approved / reward.target) * 100, 100);
    return (
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-bold">
            {approved} of {reward.target} {reward.unit}
          </p>
          <Money usd={earned} size="sm" tone="earned" showNgn={false} />
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[color:var(--hair)]">
          <div
            className="h-full rounded-full bg-money transition-[width] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2">
          <FinePrint>
            {formatUsd(reward.potUsd)} at {reward.target}, released as you go.{" "}
            {pending > 0 ? `${pending} being verified.` : ""}
          </FinePrint>
        </div>
      </div>
    );
  }

  // Threshold: pips, because the question is "how many more?"
  const pips = Array.from({ length: reward.target }, (_, i) => i < approved);
  const remaining = Math.max(reward.target - approved, 0);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-bold">
          {approved} of {reward.target} {reward.unit}
        </p>
        <Money usd={earned} size="sm" tone="earned" showNgn={false} />
      </div>
      <ul className="mt-3 flex gap-1.5" aria-label={`${approved} of ${reward.target} confirmed`}>
        {pips.map((filled, i) => (
          <li
            key={i}
            className={`h-2.5 flex-1 rounded-full ${filled ? "bg-money" : "bg-[color:var(--hair)]"}`}
          />
        ))}
      </ul>
      <div className="mt-2">
        <FinePrint>
          {remaining === 0
            ? `All ${reward.target} confirmed — the full ${formatUsd(reward.rewardUsd)} is yours.`
            : `${remaining} more and ${formatUsd(reward.rewardUsd)} is released. Nothing is paid before then.`}
        </FinePrint>
      </div>
    </div>
  );
}
