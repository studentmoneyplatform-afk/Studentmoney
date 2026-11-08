import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { Button, Card, Chip, Eyebrow, FinePrint, H2, Lede, Section } from "@/components/ui";
import { CATEGORIES } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Hire a verified Nigerian student for design, video, writing, tutoring, tech help and more. Or list the skill you already have.",
};

const BUYER_STEPS = [
  ["Post what you need", "A sentence is enough. Budget, deadline, and whether it is one-off or ongoing."],
  ["Students apply", "You see their profile, their past work on the platform, and what they charge."],
  ["Agree and pay", "Price is agreed before work starts. The brief is the contract."],
  ["Rate the work", "Your rating becomes part of a record that follows that student."],
];

const STUDENT_STEPS = [
  ["List one skill", "Start with the thing you are already good at. You can add more later."],
  ["Set your own price", "You decide what your work is worth. We publish the platform fee before you list."],
  ["Deliver and get rated", "Every completed job builds a track record you can point at."],
  ["Withdraw", "To a Nigerian bank account in your own name."],
];

export default function MarketplacePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-32 h-96 bg-[radial-gradient(50%_60%_at_50%_40%,var(--color-cream),transparent_70%)]"
        />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
          <Reveal>
            <Eyebrow>Marketplace</Eyebrow>
            <h1 className="font-display mt-5 max-w-4xl text-h1">
              Hire a student who has something{" "}
              <span className="italic text-forest">to prove.</span>
            </h1>
            <Lede className="mt-6">
              Design, video, writing, tutoring, translation, tech help — done by
              Nigerian university students who are building a record, not just taking a
              job. Cheaper than an agency, and the money reaches someone who needs it.
            </Lede>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/for-businesses" size="lg">
                Post a gig
              </Button>
              <Button href="/join" variant="ghost" size="lg">
                List your skill
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Categories */}
      <Section tone="paper-2">
        <Reveal>
          <H2 className="max-w-2xl">Twelve categories, and counting.</H2>
          <Lede className="mt-5">
            If students can do it well and a business will pay for it, it belongs here.
            Tell us what is missing and we will open it.
          </Lede>
        </Reveal>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 30}>
              <Card interactive className="h-full">
                <h3 className="font-display text-h3">{c.name}</h3>
                <p className="mt-2 text-[color:var(--ink-2)]">{c.blurb}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Two sides */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-2">
          <Reveal>
            <div>
              <Chip tone="forest">If you are hiring</Chip>
              <H2 className="mt-5 text-h3 sm:text-h2">How hiring works.</H2>
              <ol className="mt-8 space-y-6">
                {BUYER_STEPS.map(([t, b], i) => (
                  <li key={t} className="border-t border-[color:var(--hair)] pt-4">
                    <span className="money text-[1.25rem] text-[color:var(--ink-4)]">
                      0{i + 1}
                    </span>
                    <p className="mt-1 font-bold">{t}</p>
                    <p className="mt-1 text-[color:var(--ink-2)]">{b}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div>
              <Chip>If you are a student</Chip>
              <H2 className="mt-5 text-h3 sm:text-h2">How earning works.</H2>
              <ol className="mt-8 space-y-6">
                {STUDENT_STEPS.map(([t, b], i) => (
                  <li key={t} className="border-t border-[color:var(--hair)] pt-4">
                    <span className="money text-[1.25rem] text-[color:var(--ink-4)]">
                      0{i + 1}
                    </span>
                    <p className="mt-1 font-bold">{t}</p>
                    <p className="mt-1 text-[color:var(--ink-2)]">{b}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* What a listing looks like */}
      <Section tone="forest">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal>
            <div>
              <Eyebrow tone="reversed">Anatomy of a listing</Eyebrow>
              <H2 className="mt-4">Everything a buyer needs, nothing they don&apos;t.</H2>
              <Lede tone="reversed" className="mt-5">
                No listing goes live without a price, a turnaround and the university
                the student actually attends. A buyer should never have to ask the
                basics in a chat.
              </Lede>
              <div className="mt-8">
                <Button href="/join" variant="light">
                  List your skill
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-[var(--radius-xl)] bg-paper p-6 text-ink sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-h3">Logo and brand kit</p>
                  <p className="mt-1 text-caption text-[color:var(--ink-3)]">
                    Design · 3-day turnaround
                  </p>
                </div>
                <span className="money text-[1.5rem] text-hibiscus">$35</span>
              </div>

              <p className="mt-5 text-[color:var(--ink-2)]">
                Logo, colour palette, two font pairings and files ready for print and
                social. Two rounds of revisions included.
              </p>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {["Figma", "Print-ready", "Social kit"].map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-[color:var(--hair)] pt-5">
                <span
                  aria-hidden="true"
                  className="grid h-11 w-11 place-items-center rounded-full bg-forest font-display text-[color:var(--on-dark-1)]"
                >
                  A
                </span>
                <div>
                  <p className="font-bold">Verified student</p>
                  <p className="text-caption text-[color:var(--ink-3)]">
                    University confirmed · ratings from completed jobs only
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <FinePrint>
                  An example of the format, not a live listing. Real listings open as
                  students are verified.
                </FinePrint>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Honest state */}
      <Section width="narrow" className="text-center">
        <Reveal>
          <H2>The marketplace opens with its first verified students.</H2>
          <p className="mx-auto mt-6 max-w-xl text-lead text-[color:var(--ink-2)]">
            We would rather launch with twenty students who deliver than two thousand
            empty profiles. Join now and your listing is live on day one.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/join" size="lg">
              Get on the list
            </Button>
            <Button href="/students" variant="ghost" size="lg">
              See how profiles work
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
