import type { ReactNode } from "react";
import { Figure } from "@/components/figure";
import { LineReveal } from "@/components/motion";
import { Reveal } from "@/components/reveal";
import { Eyebrow, Lede } from "@/components/ui";

/**
 * Each page gets its own hero shape and accent, so the site does not read as
 * one template repeated six times. The accent comes from the data-page
 * attribute on the page wrapper, never from a hardcoded colour here.
 */
export function PageHero({
  eyebrow,
  lines,
  lede,
  actions,
  photo,
  aside,
  variant = "split",
}: {
  eyebrow: string;
  /** Headline, one entry per line, so it can reveal line by line. */
  lines: ReactNode[];
  lede: string;
  actions?: ReactNode;
  photo?: { src: string; alt: string; brief: string; ratio?: "4/5" | "3/2" | "1/1" };
  aside?: ReactNode;
  variant?: "split" | "centred" | "stacked";
}) {
  const header = (
    <>
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <h1 className="font-display mt-5 text-h1">
        <LineReveal lines={lines} />
      </h1>
      <Reveal delay={320}>
        <Lede className={`mt-6 ${variant === "centred" ? "mx-auto" : ""}`}>{lede}</Lede>
      </Reveal>
      {actions && (
        <Reveal delay={380}>
          <div
            className={`mt-9 flex flex-wrap gap-3 ${
              variant === "centred" ? "justify-center" : ""
            }`}
          >
            {actions}
          </div>
        </Reveal>
      )}
    </>
  );

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 left-1/2 h-[34rem] w-[64rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--accent-wash),transparent)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
        {variant === "centred" ? (
          <div className="mx-auto max-w-3xl text-center">{header}</div>
        ) : variant === "stacked" ? (
          <>
            <div className="max-w-3xl">{header}</div>
            {photo && (
              <Reveal delay={420}>
                <div className="mt-14">
                  <Figure {...photo} ratio={photo.ratio ?? "3/2"} priority />
                </div>
              </Reveal>
            )}
            {aside && <div className="mt-14">{aside}</div>}
          </>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>{header}</div>
            <Reveal delay={420}>
              <div>
                {photo ? <Figure {...photo} ratio={photo.ratio ?? "4/5"} priority /> : aside}
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
