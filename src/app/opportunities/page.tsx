import type { Metadata } from "next";
import { OpportunityCard } from "@/components/opportunity-card";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Button, Card, Eyebrow, FinePrint, H2, Lede, Section } from "@/components/ui";
import { getLiveOpportunities } from "@/lib/opportunities-data";
import { SectionHead, StatBand } from "@/components/sections";

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
          <span key="l2" className="italic text-green-bright">One Stormm.</span>,
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

      <Section tone="paper">
        <SectionHead
          script="At a glance"
          eyebrow="Compare them"
          title="Three rewards, three different shapes."
          lede="They do not pay the same way, and the difference matters. One pays per referral, one releases a pot as you progress, one waits for a target and then pays it all at once."
        />

        <div className="mt-12">
          <StatBand
            items={[
              { value: "$25", label: "per approved referral on Software Service Referrals" },
              { value: "$50", label: "across 100 referrals on DARE, released as you progress" },
              { value: "$35", label: "once 5 students enrol at Tobi Music Academy" },
              { value: "3", label: "opportunities you can run at the same time" },
            ]}
          />
        </div>

        <Reveal>
          <div className="mt-12 overflow-hidden rounded-[1.75rem] ring-1 ring-ink/10">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">How each opportunity pays</caption>
              <thead>
                <tr className="bg-forest text-paper">
                  <th
                    scope="col"
                    className="px-5 py-4 text-[0.75rem] font-extrabold uppercase tracking-wider"
                  >
                    Opportunity
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-4 text-[0.75rem] font-extrabold uppercase tracking-wider"
                  >
                    Reward shape
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-4 text-[0.75rem] font-extrabold uppercase tracking-wider"
                  >
                    When it is released
                  </th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((o) => (
                  <tr key={o.slug} className="border-t border-ink/10 bg-paper">
                    <th scope="row" className="px-5 py-5 font-bold">
                      {o.name}
                    </th>
                    <td className="px-5 py-5 text-[0.9375rem] text-ink/75">
                      {o.reward.kind === "per_referral"
                        ? "A flat amount for each approved referral"
                        : o.reward.kind === "proportional"
                          ? `One pot of $${o.reward.potUsd}, shared across ${o.reward.target} ${o.reward.unit}`
                          : `All or nothing at ${o.reward.target} ${o.reward.unit}`}
                    </td>
                    <td className="px-5 py-5 text-[0.9375rem] text-ink/75">
                      {o.reward.kind === "per_referral"
                        ? "As each referral is approved"
                        : o.reward.kind === "proportional"
                          ? "In proportion to your progress"
                          : "In full, once the target is met"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              <Eyebrow>Welcome to a bigger Stormm</Eyebrow>
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
