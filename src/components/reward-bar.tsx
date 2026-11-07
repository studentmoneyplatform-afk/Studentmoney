import { GROW_USD, PROJECT_REWARD_USD, WITHDRAWABLE_USD } from "@/lib/rewards";
import { formatUsd } from "@/lib/money";

/**
 * The signature device. Every reward shows the split before a student shares
 * anything, and the pink segment always means growth.
 *
 * Two states:
 *  - Full reward (cash + grow fill the track): labels sit inside the bar,
 *    as the brand board draws it.
 *  - Partial reward: the earned part fills its share of the track, the rest
 *    is an empty lane meaning "still to come", and the labels move to a
 *    legend underneath so they cannot collide in a narrow segment.
 */
export function RewardBar({
  cash = WITHDRAWABLE_USD,
  grow = GROW_USD,
  total = PROJECT_REWARD_USD,
  className = "",
}: {
  cash?: number;
  grow?: number;
  total?: number;
  className?: string;
}) {
  const safeTotal = total > 0 ? total : PROJECT_REWARD_USD;
  const earned = cash + grow;
  const remaining = Math.max(safeTotal - earned, 0);
  const isFull = remaining < 0.005;

  const pct = (value: number) => `${(value / safeTotal) * 100}%`;
  const label = `${formatUsd(cash)} cash to withdraw, ${formatUsd(
    grow,
  )} held as your Grow share${
    isFull ? "" : `, ${formatUsd(remaining)} still to come`
  }`;

  if (isFull) {
    return (
      <div
        className={`flex w-full overflow-hidden rounded-[var(--radius-pill)] ${className}`}
        role="img"
        aria-label={label}
      >
        <div
          className="flex items-center bg-cream px-5 py-3 sm:px-6 sm:py-4"
          style={{ width: pct(cash) }}
        >
          <span className="whitespace-nowrap text-[0.9375rem] font-extrabold text-forest sm:text-[1.0625rem]">
            {formatUsd(cash)} Cash
          </span>
        </div>
        <div
          className="flex items-center justify-end bg-hibiscus-light px-4 py-3 sm:px-6 sm:py-4"
          style={{ width: pct(grow) }}
        >
          <span className="whitespace-nowrap text-[0.9375rem] font-extrabold text-forest sm:text-[1.0625rem]">
            {formatUsd(grow)} Grow
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className="flex h-11 w-full overflow-hidden rounded-[var(--radius-pill)] bg-cream/15"
        role="img"
        aria-label={label}
      >
        <div className="bg-cream" style={{ width: pct(cash) }} />
        <div className="bg-hibiscus-light" style={{ width: pct(grow) }} />
      </div>

      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        <Legend swatch="bg-cream" term="Cash" value={formatUsd(cash)} />
        <Legend swatch="bg-hibiscus-light" term="Grow" value={formatUsd(grow)} />
        <Legend
          swatch="bg-cream/25"
          term="Still to come"
          value={formatUsd(remaining)}
        />
      </dl>
    </div>
  );
}

function Legend({
  swatch,
  term,
  value,
}: {
  swatch: string;
  term: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className={`h-3 w-3 shrink-0 rounded-full ${swatch}`} />
      <dt className="text-[0.9375rem] text-cream/75">{term}</dt>
      <dd className="text-[0.9375rem] font-extrabold text-cream">{value}</dd>
    </div>
  );
}
