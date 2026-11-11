import Link from "next/link";

type Tone = "primary" | "reversed";

/**
 * The Stormm lockup: a rounded square carrying a bolt-cut S, then the
 * wordmark. Drawn rather than placed so it stays crisp at any size and
 * recolours for the dark hero card without a second file.
 *
 * A real artwork file at /brand/logo.png takes over when `src` is passed
 * down from the layout.
 */
export function Logo({
  tone = "primary",
  href = "/",
  size = 34,
  src,
  reversedSrc,
}: {
  tone?: Tone;
  href?: string | null;
  size?: number;
  src?: string;
  reversedSrc?: string;
}) {
  const srcToUse = tone === "reversed" ? (reversedSrc ?? src) : src;

  const lockup = srcToUse ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={srcToUse} alt="Stormm" style={{ height: size, width: "auto" }} className="block" />
  ) : (
    <span className="inline-flex items-center gap-2.5">
      <Mark size={size} tone={tone} />
      <span
        className={`font-display leading-none ${
          tone === "reversed" ? "text-paper" : "text-forest"
        }`}
        style={{ fontSize: size * 0.72 }}
      >
        Stormm
      </span>
    </span>
  );

  if (!href) return lockup;
  return (
    <Link href={href} className="inline-flex items-center" aria-label="Stormm home">
      {lockup}
    </Link>
  );
}

export function Mark({ size = 34, tone = "primary" }: { size?: number; tone?: Tone }) {
  const bg = tone === "reversed" ? "var(--color-paper)" : "var(--color-forest)";
  const fg = tone === "reversed" ? "var(--color-forest)" : "var(--color-paper)";

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="Stormm" fill="none">
      <rect width="40" height="40" rx="11" fill={bg} />
      {/* A bolt sliced through an S: the two strokes read as both. */}
      <path
        d="M25.5 9.5 14.8 20.2h5.1L14.5 30.5l10.9-11h-5.2l5.3-10Z"
        fill={fg}
      />
    </svg>
  );
}
