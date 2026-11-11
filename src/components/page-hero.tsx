import type { ReactNode } from "react";
import { Figure } from "@/components/figure";
import { LineReveal } from "@/components/motion";
import { Reveal } from "@/components/reveal";
import { Eyebrow, Lede } from "@/components/ui";

/**
 * The inner-page header: the same green card as the homepage hero, so a
 * visitor clicking through from it does not land somewhere that feels like
 * a different product.
 *
 * `variant` keeps the old call sites working — "centred" and "stacked" now
 * differ only in how the card is filled, since every page shares the card.
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
  lines: ReactNode[];
  lede: string;
  actions?: ReactNode;
  photo?: { src: string; alt: string; brief: string; ratio?: "4/5" | "3/2" | "1/1" };
  aside?: ReactNode;
  variant?: "split" | "centred" | "stacked";
}) {
  const centred = variant === "centred";

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-[82rem] px-5 pt-4 sm:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-forest text-paper">
          {/* A soft green form, echoing the homepage */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-[28rem] w-[28rem] rounded-[46%_54%_42%_58%] bg-green/20"
          />

          <div
            className={`relative grid gap-10 px-7 py-12 sm:px-12 sm:py-16 ${
              photo && !centred ? "lg:grid-cols-[1.05fr_0.95fr] lg:items-center" : ""
            }`}
          >
            <div className={centred ? "mx-auto max-w-2xl text-center" : ""}>
              <Reveal>
                <Eyebrow tone="reversed">{eyebrow}</Eyebrow>
              </Reveal>

              <h1 className="font-display mt-5 text-[clamp(2.1rem,3.9vw,3.25rem)] leading-[1.1]">
                <LineReveal lines={lines} />
              </h1>

              <Reveal delay={320}>
                <Lede tone="reversed" className={`mt-6 ${centred ? "mx-auto" : ""}`}>
                  {lede}
                </Lede>
              </Reveal>

              {actions && (
                <Reveal delay={380}>
                  <div
                    className={`mt-9 flex flex-wrap gap-3 ${centred ? "justify-center" : ""}`}
                  >
                    {actions}
                  </div>
                </Reveal>
              )}
            </div>

            {photo && !centred && (
              <Reveal delay={420}>
                <Figure {...photo} ratio={photo.ratio ?? "4/5"} priority />
              </Reveal>
            )}

            {!photo && aside && !centred && <Reveal delay={420}>{aside}</Reveal>}
          </div>
        </div>
      </div>
    </section>
  );
}
