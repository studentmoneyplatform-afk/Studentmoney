import { Hero } from "@/components/hero";
import { OpportunityCard } from "@/components/opportunity-card";
import { Reveal } from "@/components/reveal";
import { Button, Card, Eyebrow, FinePrint, H2, Lede, Section } from "@/components/ui";
import { getLiveOpportunities } from "@/lib/opportunities-data";

/**
 * The homepage carries the three live opportunities and nothing else.
 * Anything that is not one of them is not an offer we are making.
 */

const STEPS = [
  ["Create your account", "Free, and takes a minute."],
  ["Explore the opportunities", "Three of them, each with its own rules."],
  ["Select one, or all three", "They run alongside each other."],
  ["Follow the instructions", "Each opportunity says exactly what counts."],
  ["Share your referral link", "Yours alone, issued when you join."],
  ["Track your progress", "Every referral, at the stage it has reached."],
  ["Receive approved rewards", "Paid once a referral is verified."],
];

const WHY = [
  [
    "Three opportunities in one place",
    "No hunting across sites and group chats for something real.",
  ],
  [
    "Your own referral tracking",
    "A link that belongs to you, and a record of what it brings in.",
  ],
  [
    "Progress you can watch",
    "Clicks, sign-ups, approvals — you see the stage each referral reached.",
  ],
  [
    "One earnings view",
    "What is approved, what is still being checked, what has been paid.",
  ],
  [
    "Requirements stated up front",
    "What qualifies is published before you start, not after.",
  ],
  [
    "First access to what comes next",
    "New opportunities reach the people already here.",
  ],
];

export default async function HomePage() {
  const opportunities = await getLiveOpportunities();

  return (
    <div data-page="home">
      <Hero opportunities={opportunities} />

      {/* ── The three opportunities ────────────────────────── */}
      <Section tone="paper-2">
        <Reveal>
          <Eyebrow>The opportunities</Eyebrow>
          <H2 className="mt-4 max-w-3xl">
            Following our discussions with the team, we are expanding the earning
            opportunities available to our students.
          </H2>
          <Lede className="mt-5">
            Join any one of these, or pursue all three at once. Each has its own target
            and its own reward.
          </Lede>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {opportunities.map((o, i) => (
            <Reveal key={o.slug} delay={i * 70}>
              <OpportunityCard opportunity={o} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10">
            <Button href="/opportunities" variant="ghost">
              See the full rules on each
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* ── The exciting part ──────────────────────────────── */}
      <Section tone="forest">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal>
            <div>
              <Eyebrow tone="reversed">The exciting part</Eyebrow>
              <H2 className="mt-4">Join one, or pursue all three at once.</H2>
              <Lede tone="reversed" className="mt-5">
                Each has its own target and reward. Once you meet the earning
                requirements for an opportunity, the reward is released to you.
                Progress on one never cancels another.
              </Lede>
              <div className="mt-8">
                <Button href="/join" variant="light">
                  Create your account
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Card tone="forest" className="border border-[color:var(--hair-reversed)]">
              <Eyebrow tone="reversed">What we are building</Eyebrow>
              <p className="mt-4 text-lead leading-relaxed">
                We are creating opportunities for young people to earn, build business
                and marketing skills, grow in confidence, and take part in the economy,
                whether they are still studying, newly graduated or working for themselves.
              </p>
              <p className="mt-4 text-[color:var(--on-dark-2)]">
                Nobody should have to wait for a job offer to start creating value,
                earning income and building their future.
              </p>
              <p className="mt-6 font-display text-[1.5rem]">
                Welcome to a bigger Stormm.
              </p>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* ── How it works ───────────────────────────────────── */}
      <Section>
        <Reveal>
          <Eyebrow>How it works</Eyebrow>
          <H2 className="mt-4 max-w-2xl">Seven steps, start to paid.</H2>
        </Reveal>

        <ol className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([title, body], i) => (
            <Reveal key={title} delay={(i % 4) * 60}>
              <li className="border-t-2 border-forest pt-5">
                <span className="money text-[1.5rem] text-[color:var(--ink-4)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-1.5 text-[1.25rem] leading-tight">
                  {title}
                </h3>
                <p className="mt-2 text-[color:var(--ink-2)]">{body}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal>
          <div className="mt-12">
            <Button href="/how-it-works" variant="ghost">
              See each step in detail
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* ── Why join ───────────────────────────────────────── */}
      <Section tone="paper-2">
        <Reveal>
          <Eyebrow>Why join</Eyebrow>
          <H2 className="mt-4 max-w-2xl">What the platform actually gives you.</H2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map(([title, body], i) => (
            <Reveal key={title} delay={(i % 3) * 60}>
              <Card className="h-full">
                <h3 className="font-display text-[1.25rem]">{title}</h3>
                <p className="mt-2.5 text-[color:var(--ink-2)]">{body}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 max-w-3xl">
            <FinePrint>
              Stormm does not guarantee income or employment. Rewards are paid on
              referrals that have been verified and approved, under the rules published
              on each opportunity.
            </FinePrint>
          </div>
        </Reveal>
      </Section>

      {/* ── Close ──────────────────────────────────────────── */}
      <Section width="narrow" className="text-center">
        <Reveal>
          <H2>Your next move starts here.</H2>
          <p className="mx-auto mt-6 max-w-xl text-lead text-[color:var(--ink-2)]">
            Explore the three opportunities, pick the one that fits the people you
            already know, and get your referral link today.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/opportunities" size="lg">
              Explore opportunities
            </Button>
            <Button href="/join" variant="ghost" size="lg">
              Get started
            </Button>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}
