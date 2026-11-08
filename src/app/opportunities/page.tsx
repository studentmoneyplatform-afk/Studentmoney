import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { Button, Card, Chip, Eyebrow, FinePrint, H2, Lede, Section } from "@/components/ui";
import { TRACKS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Ways to earn",
  description:
    "Nine ways Nigerian students earn on StudentMoney — referrals, content, freelance gigs, tutoring, campus work, micro-tasks, skills, challenges and placements.",
};

export default function OpportunitiesPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-32 h-96 bg-[radial-gradient(50%_60%_at_50%_40%,var(--color-cream),transparent_70%)]"
        />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
          <Reveal>
            <Eyebrow>Ways to earn</Eyebrow>
            <h1 className="font-display mt-5 max-w-4xl text-h1">
              Nine ways to make money{" "}
              <span className="italic text-forest">before you graduate.</span>
            </h1>
            <Lede className="mt-6">
              Some need a network. Some need a skill. Some only need the hour between
              lectures. Every one of them tells you how the money arrives before you
              start — that is the part most platforms leave out.
            </Lede>
          </Reveal>

          <Reveal delay={120}>
            <nav aria-label="Jump to a track" className="mt-10 flex flex-wrap gap-2">
              {TRACKS.map((t) => (
                <a
                  key={t.slug}
                  href={`#${t.slug}`}
                  className="rounded-full border border-[color:var(--hair-strong)] px-3.5 py-1.5 text-caption font-bold text-[color:var(--ink-2)] transition-colors hover:border-[color:var(--ink-1)] hover:text-ink"
                >
                  {t.title}
                </a>
              ))}
            </nav>
          </Reveal>
        </div>
      </section>

      <Section tone="paper-2">
        <div className="space-y-5">
          {TRACKS.map((track, i) => (
            <Reveal key={track.slug} delay={(i % 3) * 50}>
              <Card id={track.slug} className="scroll-mt-24">
                <div className="grid gap-7 lg:grid-cols-[0.85fr_1.15fr]">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="money text-[1.5rem] text-[color:var(--ink-4)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {track.status === "soon" && <Chip>Coming next</Chip>}
                    </div>
                    <h2 className="font-display mt-2 text-h2">{track.title}</h2>
                  </div>

                  <div>
                    <p className="text-lead leading-relaxed text-[color:var(--ink-2)]">
                      {track.blurb}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {track.examples.map((e) => (
                        <Chip key={e}>{e}</Chip>
                      ))}
                    </div>

                    <div className="mt-6 rounded-[var(--radius-lg)] bg-cream px-5 py-4">
                      <Eyebrow>How you get paid</Eyebrow>
                      <p className="mt-1.5 font-bold">{track.paid}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="forest">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <H2>What we will never do.</H2>
              <Lede tone="reversed" className="mt-5">
                These are not aspirations. They are the rules we hold ourselves to, and
                you can hold us to them too.
              </Lede>
            </div>
            <ul className="space-y-3.5">
              {[
                "Promise guaranteed income, or call any of this passive.",
                "Pay you for recruiting other students and nothing else.",
                "Publish a fake testimonial or a doctored earnings screenshot.",
                "Quote an earning target without the rules that apply to it.",
                "Pay a reward on a payment that has not cleared.",
                "Ask you to collect money from a client on our behalf.",
              ].map((line) => (
                <li
                  key={line}
                  className="flex gap-3 border-b border-[color:var(--hair-reversed)] pb-3.5 text-[color:var(--on-dark-2)] last:border-0"
                >
                  <span aria-hidden="true" className="font-bold text-hibiscus-light">
                    —
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Section>

      <Section width="narrow" className="text-center">
        <Reveal>
          <H2>Pick one and start this week.</H2>
          <div className="mt-8 flex justify-center">
            <Button href="/join" size="lg">
              Join StudentMoney free
            </Button>
          </div>
          <div className="mx-auto mt-6 max-w-lg">
            <FinePrint>
              Earning targets are goals, not guarantees. Each campaign publishes what
              qualifies, who funds the reward and when it is paid.
            </FinePrint>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
