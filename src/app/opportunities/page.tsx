import type { Metadata } from "next";
import { OpportunityCard } from "@/components/opportunity-card";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Button, Card, Eyebrow, FinePrint, H2, Lede, Section } from "@/components/ui";
import { getLiveOpportunities } from "@/lib/opportunities-data";

export const metadata: Metadata = {
  title: "Explore opportunities",
  description:
    "Three live earning opportunities for Nigerian students: software service referrals, DARE Company Global, and Tobi Music Academy. Each one states who pays, how much and when.",
};

const STAGES = [
  ["Clicked", "Someone opened your link. Nothing is owed yet, and we say so."],
  ["Registered", "They signed up or made contact through you."],
  ["Pending verification", "We are checking the referral is genuine."],
  ["Approved", "It counts. Your progress and your earnings move."],
  ["Paid", "The money has left us and is on its way to your account."],
];

export default async function OpportunitiesPage() {
  const opportunities = await getLiveOpportunities();

  return (
    <div data-page="earn">
      <PageHero
        variant="stacked"
        eyebrow="Explore opportunities"
        lines={[
          "Three ways to earn.",
          <span key="l2" className="italic text-forest">One StudentMoney.</span>,
        ]}
        lede="Join one of them, or run all three at once. Each has its own target and its own reward, and each one tells you exactly what counts before you start."
        actions={
          <>
            <Button href="/join" size="lg">Create your account</Button>
            <Button href="#how-referrals-count" variant="ghost" size="lg">
              How referrals are counted
            </Button>
          </>
        }
        photo={{
          src: "/photos/track-referral.jpg",
          alt: "A student introducing a customer to a service",
          brief: "Student talking to a shop owner",
          ratio: "3/2",
        }}
      />

      <Section tone="paper-2">
        <div className="grid gap-5 lg:grid-cols-3">
          {opportunities.map((o, i) => (
            <Reveal key={o.slug} delay={i * 70}>
              <OpportunityCard opportunity={o} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 max-w-3xl">
            <FinePrint>
              Earning targets are goals, not guarantees. A click is not a referral and a
              referral is not a reward — each one has to be verified and approved first,
              and the stages below are shown to you at every step.
            </FinePrint>
          </div>
        </Reveal>
      </Section>

      <Section id="how-referrals-count" tone="forest">
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <Reveal>
            <div>
              <Eyebrow tone="reversed">How referrals are counted</Eyebrow>
              <H2 className="mt-4">A click is not a referral.</H2>
              <Lede tone="reversed" className="mt-5">
                This is the part most referral schemes keep vague. Every referral you
                make moves through five stages, and you can see which stage each one is
                at from your dashboard.
              </Lede>
              <div className="mt-8">
                <Button href="/how-it-works" variant="light">
                  See the whole process
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <ol className="space-y-px overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--hair-reversed)]">
              {STAGES.map(([stage, meaning], i) => (
                <li key={stage} className="flex gap-5 p-5">
                  <span className="money text-[1.125rem] text-[color:var(--on-dark-3)]">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="font-bold">{stage}</p>
                    <p className="mt-1 text-[color:var(--on-dark-2)]">{meaning}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal>
            <div>
              <Eyebrow>Run all three</Eyebrow>
              <H2 className="mt-4">The exciting part.</H2>
              <Lede className="mt-5">
                Join any one of these opportunities, or pursue all three at once. Each
                has its own target and reward. They do not compete with each other, and
                progress on one never cancels another.
              </Lede>
              <div className="mt-8">
                <Button href="/join" size="lg">Get started</Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <Card tone="cream">
              <Eyebrow>Welcome to a bigger StudentMoney</Eyebrow>
              <p className="mt-4 text-lead leading-relaxed">
                We are creating opportunities for young people to earn, build business
                and marketing skills, grow in confidence, and take part in the economy
                while still in school.
              </p>
              <p className="mt-4 text-[color:var(--ink-2)]">
                Students should not have to wait until graduation to start creating
                value, earning income and building their future.
              </p>
            </Card>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
