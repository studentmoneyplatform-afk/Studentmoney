import type { ReactNode } from "react";
import { Eyebrow, FinePrint, Section } from "@/components/ui";

export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
  reviewNote,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: { heading: string; body: ReactNode }[];
  reviewNote: string;
}) {
  return (
    <>
      <Section tone="forest">
        <Eyebrow tone="reversed">{eyebrow}</Eyebrow>
        <h1 className="font-display mt-5 max-w-4xl text-[2.5rem] leading-[1.05] sm:text-[3.25rem]">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lead text-[color:var(--on-dark-1)]/90">{intro}</p>
      </Section>

      <Section tone="cream">
        <div className="max-w-3xl">
          {sections.map((section, index) => (
            <section key={section.heading} className="border-b border-ink/10 py-8 first:pt-0">
              <h2 className="font-display text-h3">
                <span className="money mr-3 text-[1.25rem] text-moss">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.heading}
              </h2>
              <div className="mt-4 space-y-3 text-ink/85">{section.body}</div>
            </section>
          ))}

          <div className="mt-8 rounded-[var(--radius-xl)] border-2 border-warning/40 p-6">
            <Eyebrow>Before launch</Eyebrow>
            <div className="mt-3">
              <FinePrint>{reviewNote}</FinePrint>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
