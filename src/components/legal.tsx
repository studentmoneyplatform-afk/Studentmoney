import type { ReactNode } from "react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Counter, ReadingProgress, SectionIndex } from "@/components/motion";
import { Card, Eyebrow, FinePrint, Section } from "@/components/ui";
import { CtaBand } from "@/components/sections";

export type LegalSection = { heading: string; body: ReactNode };

/** A stable anchor for a clause, derived from its heading. */
function anchor(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * The shared shell for Terms and Privacy.
 *
 * A legal page is read differently from a marketing page: people arrive
 * looking for one clause, not for the whole document. So the motion here is
 * navigational rather than decorative — an index that tracks where you are,
 * a progress bar that says how much is left, and a rule that draws itself
 * above each clause as you reach it. Every one of them degrades to plain,
 * fully readable text without JavaScript or with motion reduced.
 */
export function LegalPage({
  eyebrow,
  lines,
  intro,
  sections,
  reviewNote,
  updated,
}: {
  eyebrow: string;
  lines: ReactNode[];
  intro: string;
  sections: LegalSection[];
  reviewNote: string;
  updated: string;
}) {
  const items = sections.map((section) => ({
    id: anchor(section.heading),
    label: section.heading,
  }));

  return (
    <div data-page="legal">
      <PageHero
        eyebrow={eyebrow}
        lines={lines}
        lede={intro}
        aside={
          <Card tone="forest" className="border border-[color:var(--hair-reversed)]">
            <Eyebrow tone="reversed">At a glance</Eyebrow>

            <p className="font-display mt-5 text-[3.25rem] leading-none">
              <Counter to={sections.length} />
            </p>
            <p className="mt-2 text-[color:var(--on-dark-2)]">
              numbered clauses. Each one links directly, so you can send someone
              the exact rule rather than the whole page.
            </p>

            <div className="mt-6 border-t border-[color:var(--hair-reversed)] pt-5">
              <FinePrint tone="reversed">Last updated {updated}</FinePrint>
            </div>
          </Card>
        }
      />

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[17rem_1fr] lg:gap-16">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <SectionIndex items={items} />
              {/* The bar lives beside the index on desktop, where it stays
                  in view for the whole document. */}
              <div className="mt-7 pl-5">
                <ReadingProgress targetId="legal-article" />
              </div>
            </div>
          </aside>

          <div>
            {/* On narrow screens there is no index, so the bar parks under
                the header as the only reading cue. */}
            <div className="sticky top-16 z-40 -mx-5 bg-paper/90 px-5 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:hidden">
              <ReadingProgress targetId="legal-article" />
            </div>

            <article id="legal-article" className="mt-4 lg:mt-8">
              {sections.map((section, index) => (
                <section
                  key={section.heading}
                  id={anchor(section.heading)}
                  className="scroll-mt-28"
                >
                  <Reveal from="rise">
                    <span
                      aria-hidden="true"
                      className="rule-draw block h-px w-full bg-[color:var(--hair)]"
                    />
                    <div className="grid gap-x-6 gap-y-4 pb-11 pt-8 sm:grid-cols-[3.5rem_1fr]">
                      <span className="money text-[1.5rem] leading-none tabular-nums text-green">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h2 className="font-display text-h3">{section.heading}</h2>
                        <div className="mt-4 space-y-3.5 text-[color:var(--ink-2)]">
                          {section.body}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </section>
              ))}

              <Reveal from="scale">
                <Card tone="cream" className="mt-4 border-2 border-warning/40">
                  <Eyebrow>Before launch</Eyebrow>
                  <div className="mt-3">
                    <FinePrint>{reviewNote}</FinePrint>
                  </div>
                </Card>
              </Reveal>
            </article>
          </div>
        </div>
      </Section>

      <Section tone="paper-2">
        <CtaBand
          eyebrow="Still unsure?"
          title="Ask before you start, not after."
          body="The FAQs answer the awkward ones in the same plain words as this page: what counts as a successful referral, why one might be rejected, and what happens if a payment is reversed."
          primary={{ href: "/faqs", label: "Read the FAQs" }}
          secondary={{ href: "/how-it-works", label: "See how it works" }}
        />
      </Section>
    </div>
  );
}
