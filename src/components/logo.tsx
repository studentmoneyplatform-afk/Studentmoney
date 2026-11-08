import Link from "next/link";

type Tone = "primary" | "reversed" | "ink";

/**
 * The lockup.
 *
 * If a logo file has been saved into /public/brand it is used. Until then
 * the typographic wordmark stands in, so the site is never broken while the
 * final artwork is being exported. Drop in:
 *   /public/brand/logo.png           for light grounds
 *   /public/brand/logo-reversed.png  for the deep green sections (optional)
 */
export function Logo({
  tone = "primary",
  href = "/",
  size = 30,
  src,
  reversedSrc,
}: {
  tone?: Tone;
  href?: string | null;
  size?: number;
  /** Resolved by the layout from /public/brand. Absent until artwork exists. */
  src?: string;
  reversedSrc?: string;
}) {
  const srcToUse = tone === "reversed" ? (reversedSrc ?? src) : src;

  const lockup = srcToUse ? (
    // The artwork carries its own colour, so no tint is applied over it.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={srcToUse}
      alt="StudentMoney"
      height={size}
      style={{ height: size, width: "auto" }}
      className="block w-auto"
    />
  ) : (
    <Wordmark tone={tone} size={size} />
  );

  if (!href) return lockup;
  return (
    <Link href={href} className="inline-flex items-center" aria-label="StudentMoney home">
      {lockup}
    </Link>
  );
}

/** Typographic stand-in: "Student" solid, "Money" in the money green. */
function Wordmark({ tone, size }: { tone: Tone; size: number }) {
  const base =
    tone === "reversed" ? "text-[color:var(--on-dark-1)]" : tone === "ink" ? "text-ink" : "text-forest";
  const accent = tone === "reversed" ? "text-money-soft" : "text-money";

  return (
    <span className="inline-flex items-center gap-2.5">
      <Mark size={size} tone={tone} />
      <span
        className={`font-display leading-none ${base}`}
        style={{ fontSize: size * 0.72 }}
      >
        Student<span className={accent}>Money</span>
      </span>
    </span>
  );
}

/**
 * The mark: a rounded square split 80 / 20 — the share a student can
 * withdraw beside the share that grows.
 */
export function Mark({ size = 30, tone = "primary" }: { size?: number; tone?: Tone }) {
  const [body, split] =
    tone === "reversed"
      ? ["var(--color-cream)", "var(--color-money-soft)"]
      : tone === "ink"
        ? ["var(--color-ink)", "var(--color-ink)"]
        : ["var(--color-forest)", "var(--color-money)"];

  const id = `sm-mark-${tone}`;

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="StudentMoney">
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width="40" height="40" rx="12" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x="0" y="0" width="32" height="40" fill={body} />
        <rect x="32" y="0" width="8" height="40" fill={split} />
        {tone === "ink" && (
          <rect x="30.5" y="0" width="1.5" height="40" fill="var(--color-paper)" />
        )}
      </g>
    </svg>
  );
}
