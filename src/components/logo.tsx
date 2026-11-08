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

/** A graduation cap over a rising bar chart — learn, earn, thrive. */
export function Mark({ size = 30, tone = "primary" }: { size?: number; tone?: Tone }) {
  const deep = tone === "reversed" ? "var(--on-dark-1)" : "var(--color-forest)";
  const bright = tone === "ink" ? "var(--color-ink)" : "var(--color-money)";

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="StudentMoney" fill="none">
      <path d="M16 4.2 29 10l-13 5.8L3 10l13-5.8Z" fill={deep} />
      <path d="M8.4 14.2v5.3c0 2.6 3.4 4.3 7.6 4.3s7.6-1.7 7.6-4.3v-5.3" stroke={deep} strokeWidth="2.1" strokeLinecap="round" />
      <rect x="11.4" y="22.4" width="2.7" height="5.4" rx="1" fill={bright} />
      <rect x="15.6" y="19.6" width="2.7" height="8.2" rx="1" fill={bright} />
      <rect x="19.8" y="16.6" width="2.7" height="11.2" rx="1" fill={bright} />
    </svg>
  );
}
