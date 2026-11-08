import { GROW_USD, PROJECT_REWARD_USD, WITHDRAWABLE_USD } from "@/lib/rewards";
import { formatUsd } from "@/lib/money";

/**
 * The signature device: every reward shows its split before a student shares
 * anything, and the pink segment always means growth.
 *
 * Two grounds, because this sits on white cards and on the forest section,
 * and a cream-on-white bar is invisible. Two states, because a partial
 * reward needs a "still to come" lane and labels that cannot collide.
 */
export function RewardBar({
  cash = WITHDRAWABLE_USD,
  grow = GROW_USD,
  total = PROJECT_REWARD_USD,
  surface = "dark",
  className = "",
}: {
  cash?: number;
  grow?: number;
  total?: number;
  surface?: "dark" | "light";
  className?: string;
}) {
  const safeTotal = total > 0 ? total : PROJECT_REWARD_USD;
  const earned = cash + grow;
  const remaining = Math.max(safeTotal - earned, 0);
  const isFull = remaining < 0.005;
  const pct = (v: number) => `${(v / safeTotal) * 100}%`;

  const label = `${formatUsd(cash)} cash to withdraw, ${formatUsd(grow)} held as your Grow share${
    isFull ? "" : `, ${formatUsd(remaining)} still to come`
  }`;

  const onDark = surface === "dark";
  const cashFill = onDark ? "bg-cream" : "bg-forest";
  const cashText = onDark ? "text-forest" : "text-[color:var(--on-dark-1)]";
  const track = onDark ? "bg-[color:var(--hair-reversed)]" : "bg-[color:var(--hair)]";
  const legendTerm = onDark ? "text-[color:var(--on-dark-3)]" : "text-[color:var(--ink-3)]";
  const legendValue = onDark ? "text-[color:var(--on-dark-1)]" : "text-ink";

  if (isFull) {
    return (
      <div
        className={`flex w-full overflow-hidden rounded-full ${className}`}
        role="img"
        aria-label={label}
      >
        <div
          className={`flex items-center px-5 py-3 sm:px-6 sm:py-3.5 ${cashFill}`}
          style={{ width: pct(cash) }}
        >
          <span className={`whitespace-nowrap text-caption font-extrabold sm:text-body ${cashText}`}>
            {formatUsd(cash)} Cash
          </span>
        </div>
        <div
          className="flex items-center justify-end bg-hibiscus-light px-4 py-3 sm:px-6 sm:py-3.5"
          style={{ width: pct(grow) }}
        >
          <span className="whitespace-nowrap text-caption font-extrabold text-forest sm:text-body">
            {formatUsd(grow)} Grow
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={`flex h-9 w-full overflow-hidden rounded-full ${track}`} role="img" aria-label={label}>
        <div className={cashFill} style={{ width: pct(cash) }} />
        <div className="bg-hibiscus-light" style={{ width: pct(grow) }} />
      </div>

      <dl className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2">
        <Legend swatch={cashFill} term="Cash" value={formatUsd(cash)} termCls={legendTerm} valueCls={legendValue} />
        <Legend swatch="bg-hibiscus-light" term="Grow" value={formatUsd(grow)} termCls={legendTerm} valueCls={legendValue} />
        <Legend swatch={track} term="Still to come" value={formatUsd(remaining)} termCls={legendTerm} valueCls={legendValue} />
      </dl>
    </div>
  );
}

function Legend({
  swatch,
  term,
  value,
  termCls,
  valueCls,
}: {
  swatch: string;
  term: string;
  value: string;
  termCls: string;
  valueCls: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${swatch}`} />
      <dt className={`text-caption ${termCls}`}>{term}</dt>
      <dd className={`text-caption font-extrabold ${valueCls}`}>{value}</dd>
    </div>
  );
}
