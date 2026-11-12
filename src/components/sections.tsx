import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { Button, Card, Eyebrow, FinePrint, H2, Lede } from "@/components/ui";

/**
 * Section blocks in the homepage's language, so every page is built from
 * the same parts rather than hand-rolled markup that drifts apart.
 */

/** A band of facts, divided like the hero's trust bar. */
export function StatBand({ items }: { items: { value: string; label: string }[] }) {
  return (
    <Reveal from="scale">
      <ul className="grid gap-px overflow-hidden rounded-[1.75rem] bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.label} className="bg-cream px-6 py-7">
            <p className="font-display text-[2rem] leading-none text-forest">{item.value}</p>
            <p className="mt-2.5 text-[0.875rem] font-bold leading-snug text-ink/70">
              {item.label}
            </p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

/** Tinted icon cards, as on the hero's floating opportunities. */
export function FeatureGrid({
  items,
  columns = 3,
}: {
  items: { title: string; body: string; tint?: string; icon?: ReactNode }[];
  columns?: 2 | 3;
}) {
  return (
    <div
      className={`grid gap-5 ${
        columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {items.map((item, i) => (
        <Reveal key={item.title} from="rise" delay={(i % 3) * 120}>
          <Card className="h-full">
            {item.icon && (
              <span
                className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl ${
                  item.tint ?? "bg-green-wash"
                }`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  {item.icon}
                </svg>
              </span>
            )}
            <h3 className="font-display text-[1.25rem] leading-tight">{item.title}</h3>
            <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink/70">{item.body}</p>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}

/** Numbered steps on a connecting rule. */
export function StepTimeline({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <Reveal key={step.title} from="left" delay={(i % 4) * 130}>
          <li className="border-t-[3px] border-forest pt-5">
            <span className="font-display text-[1.75rem] leading-none text-green">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display mt-2 text-[1.125rem] leading-tight">{step.title}</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink/70">{step.body}</p>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}

/** The green closing card, as on the homepage. */
export function CtaBand({
  eyebrow,
  title,
  body,
  primary,
  secondary,
  note,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  note?: string;
}) {
  return (
    <Reveal from="scale">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-forest px-7 py-14 text-center text-paper sm:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-[24rem] w-[24rem] rounded-[46%_54%_42%_58%] bg-green/20"
        />
        <div className="relative mx-auto max-w-2xl">
          {eyebrow && <Eyebrow tone="reversed">{eyebrow}</Eyebrow>}
          <H2 className="mt-4">{title}</H2>
          <Lede tone="reversed" className="mx-auto mt-5">
            {body}
          </Lede>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href={primary.href} variant="light" size="lg">
              {primary.label}
            </Button>
            {secondary && (
              <Button
                href={secondary.href}
                variant="ghost"
                size="lg"
                className="border-paper/30 text-paper hover:border-paper hover:bg-paper/10"
              >
                {secondary.label}
              </Button>
            )}
          </div>
          {note && (
            <div className="mx-auto mt-7 max-w-lg">
              <FinePrint tone="reversed">{note}</FinePrint>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}

/** A heading block with the handwritten accent above it. */
export function SectionHead({
  script,
  eyebrow,
  title,
  lede,
  align = "left",
}: {
  script?: string;
  eyebrow?: string;
  title: ReactNode;
  lede?: string;
  align?: "left" | "centre";
}) {
  const centred = align === "centre";
  return (
    <Reveal from="rise">
      <div className={centred ? "mx-auto max-w-2xl text-center" : "max-w-3xl"}>
        {script && (
          <p className={`font-script text-[1.75rem] text-green ${centred ? "" : "-rotate-2"}`}>
            {script}
          </p>
        )}
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <H2 className="mt-4">{title}</H2>
        {lede && <Lede className={`mt-5 ${centred ? "mx-auto" : ""}`}>{lede}</Lede>}
      </div>
    </Reveal>
  );
}
