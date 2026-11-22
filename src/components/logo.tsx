import Link from "next/link";

type Tone = "primary" | "reversed";

/**
 * The MirusEarn lockup: the rounded-square mark carrying the rising chevron
 * and arrow, then the wordmark.
 *
 * The artwork at /brand/logo.png (and logo-reversed.png for the deep green
 * sections) is resolved by the layout and passed down as `src`. The inline
 * fallback below only shows if those files go missing.
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
    <img src={srcToUse} alt="MirusEarn" style={{ height: size, width: "auto" }} className="block" />
  ) : (
    <span className="inline-flex items-center gap-2.5">
      <Mark size={size} tone={tone} />
      <span
        className={`font-display leading-none ${
          tone === "reversed" ? "text-paper" : "text-forest"
        }`}
        style={{ fontSize: size * 0.72 }}
      >
        MirusEarn
      </span>
    </span>
  );

  if (!href) return lockup;
  return (
    <Link href={href} className="inline-flex items-center" aria-label="MirusEarn home">
      {lockup}
    </Link>
  );
}

/**
 * The mark on its own, for the dashboard rail and anywhere the wordmark would
 * not fit. The tile carries its own forest gradient, which separates it from
 * both the cream and the deep green grounds, so it does not need a reversed
 * variant — `tone` is kept so existing callers do not have to change.
 */
export function Mark({ size = 34, tone }: { size?: number; tone?: Tone }) {
  void tone;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/mark.png"
      alt="MirusEarn"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="block shrink-0"
    />
  );
}
