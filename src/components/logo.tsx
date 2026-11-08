import Link from "next/link";

type Tone = "primary" | "reversed" | "ink";

/**
 * The mark: a rounded square split 80 / 20 — the share a student can withdraw
 * beside the share that grows. Drawn as SVG so it stays crisp at 16px.
 */
export function Mark({
  size = 32,
  tone = "primary",
  className,
}: {
  size?: number;
  tone?: Tone;
  className?: string;
}) {
  const [body, split] =
    tone === "reversed"
      ? ["var(--color-cream)", "var(--color-hibiscus-light)"]
      : tone === "ink"
        ? ["var(--color-ink)", "var(--color-ink)"]
        : ["var(--color-forest)", "var(--color-hibiscus)"];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      role="img"
      aria-label="StudentMoney"
      className={className}
    >
      <defs>
        <clipPath id={`sm-mark-${tone}`}>
          <rect x="0" y="0" width="40" height="40" rx="12" />
        </clipPath>
      </defs>
      <g clipPath={`url(#sm-mark-${tone})`}>
        <rect x="0" y="0" width="32" height="40" fill={body} />
        <rect x="32" y="0" width="8" height="40" fill={split} />
        {tone === "ink" && (
          <rect x="30.5" y="0" width="1.5" height="40" fill="var(--color-cream)" />
        )}
      </g>
    </svg>
  );
}

/**
 * The wordmark. "Student" roman, "Money" italic — never restyled, stretched
 * or recoloured outside the three approved tones.
 */
export function Wordmark({
  tone = "primary",
  className = "",
}: {
  tone?: Tone;
  className?: string;
}) {
  const base =
    tone === "reversed"
      ? "text-[color:var(--on-dark-1)]"
      : tone === "ink"
        ? "text-ink"
        : "text-forest";
  const accent =
    tone === "reversed"
      ? "text-hibiscus-light"
      : tone === "ink"
        ? "text-ink"
        : "text-hibiscus";

  return (
    <span className={`font-display ${base} ${className}`}>
      Student<em className={accent}>Money</em>
    </span>
  );
}

/** Mark plus wordmark, with the clear space the brand pack requires. */
export function Logo({
  tone = "primary",
  href = "/",
  size = 32,
}: {
  tone?: Tone;
  href?: string | null;
  size?: number;
}) {
  const lockup = (
    <span className="inline-flex items-center gap-2.5">
      <Mark size={size} tone={tone} />
      <Wordmark tone={tone} className="text-[1.375rem] leading-none" />
    </span>
  );

  if (!href) return lockup;
  return (
    <Link href={href} className="inline-flex items-center" aria-label="StudentMoney home">
      {lockup}
    </Link>
  );
}
