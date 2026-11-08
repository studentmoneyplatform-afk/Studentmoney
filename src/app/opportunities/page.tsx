import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
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
    <div data-page="earn">
      <PageHero
        eyebrow="Ways to earn"
        lines={[
          "Nine ways to make",
          "money before you",
          <span key="l3" className="italic accent-text">graduate.</span>,
        ]}
        lede="Some need a network. Some need a skill. Some only need the hour between lectures. Every one of them tells you how the money arrives before you start — the part most platforms leave out."
        photo={{
          src: "/photos/track-content.jpg",
          alt: "A student filming a short product video",
          brief: "Phone on a gimbal, filming a product",
          ratio: "4/5",
        }}
      />

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
                  <span aria-hidden="true" className="font-bold text-money-soft">
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
    </div>
  );
}
