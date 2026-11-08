import { formatNgn, formatUsd } from "@/lib/money";

/**
 * A money figure. Fraunces 700 for the dollar amount, the naira equivalent
 * beside it in italic — the brand rule, enforced by making it one component.
 */
export function Money({
  usd,
  size = "md",
  tone = "default",
  showNgn = true,
}: {
  usd: number;
  size?: "sm" | "md" | "lg" | "xl";
  /** "earned" paints the figure hibiscus — only ever for money earned. */
  tone?: "default" | "earned" | "reversed" | "earned-reversed";
  showNgn?: boolean;
}) {
  const figure = {
    sm: "text-[1.25rem]",
    md: "text-[1.875rem]",
    lg: "text-[2.75rem]",
    xl: "text-[3.8125rem]",
  }[size];

  const colour = {
    default: "text-ink",
    earned: "text-hibiscus",
    reversed: "text-[color:var(--on-dark-1)]",
    "earned-reversed": "text-hibiscus-light",
  }[tone];

  const ngnColour =
    tone === "reversed" || tone === "earned-reversed" ? "text-[color:var(--on-dark-1)]/75" : "text-moss";

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2.5">
      <span className={`money ${figure} ${colour}`}>{formatUsd(usd)}</span>
      {showNgn && (
        <span className={`money-ngn text-[0.95em] ${ngnColour}`}>
          <span aria-hidden="true">≈ </span>
          <span className="sr-only">approximately </span>
          {formatNgn(usd)}
        </span>
      )}
    </span>
  );
}
