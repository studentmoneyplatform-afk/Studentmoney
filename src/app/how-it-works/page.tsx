import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Button, Card, Eyebrow, FinePrint, H2, Lede, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Create an account, pick one of the three opportunities, share your referral link and track every referral through to an approved reward.",
};

const STEPS = [
  [
    "Create your account",
    "Register with your name, a phone number that works on WhatsApp, and your university. We verify who you are before a reward can be attributed to you, because attribution has to belong to a real person.",
  ],
  [
    "Explore the available opportunities",
    "There are three. Each names the organisation involved, what you are expected to do, what counts as a successful referral, and when the reward is released.",
  ],
  [
    "Select an opportunity",
    "Join one, two or all three. They run alongside each other, and progress on one never cancels another.",
  ],
  [
    "Follow the participation instructions",
    "Each opportunity states exactly what qualifies. Read it before you start rather than after, so there are no surprises about what counts.",
  ],
  [
    "Share your referral link",
    "You receive a tracking code that is yours alone for each opportunity. Anyone who arrives through it is attributed to you from that moment.",
  ],
  [
    "Track your progress",
    "Every referral appears on your dashboard at the stage it has reached, and you can see what is still being checked.",
  ],
  [
    "Receive approved rewards",
    "Once a referral is verified and approved, the reward is added to your balance and paid to a Nigerian bank account in your own name.",
  ],
];

const STAGES = [
  ["Clicked", "Someone opened your link. Nothing is owed yet, and we say so."],
  ["Registered", "They signed up or made contact through you."],
  ["Pending verification", "We are checking the referral is genuine."],
  ["Approved", "It counts. Your progress and your earnings move."],
  ["Rejected", "It did not qualify, and the reason is shown on the referral."],
  ["Reward paid", "The money for it has been sent to you."],
];

const NEVER = [
  "Promise guaranteed income or employment.",
  "Pay for recruiting other students and nothing else.",
  "Publish a fabricated testimonial or a doctored earnings screenshot.",
  "Quote an earning target without the rules that apply to it.",
  "Pay a reward on a referral that has not been verified.",
  "Ask you to collect money from a customer on our behalf.",
];

export default function HowItWorksPage() {
  return (
    <div data-page="earn">
      <PageHero
        eyebrow="How it works"
        lines={[
          "Seven steps, and",
          <span key="l2" className="italic text-forest">
            the rule behind each.
          </span>,
        ]}
        lede="From creating an account to money reaching your bank. Every opportunity here says who pays, what qualifies and when — this page explains the process they all share."
        actions={
          <>
            <Button href="/join" size="lg">
              Create your account
            </Button>
            <Button href="/opportunities" variant="ghost" size="lg">
              Explore opportunities
            </Button>
          </>
        }
        photo={{
          src: "/photos/track-gigs.jpg",
          alt: "A student working on a laptop",
          brief: "Hands on a laptop",
          ratio: "4/5",
        }}
      />

      <Section tone="paper-2">
        <ol className="grid gap-px overflow-hidden rounded-[var(--radius-xl)] bg-[color:var(--hair)] sm:grid-cols-2">
          {STEPS.map(([title, body], i) => (
            <Reveal key={title} delay={(i % 2) * 50}>
              <li className="h-full bg-paper p-7">
                <span className="money text-[1.5rem] text-[color:var(--ink-4)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display mt-2 text-h3">{title}</h2>
                <p className="mt-3 text-[color:var(--ink-2)]">{body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section tone="forest">
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <Reveal>
            <div>
              <Eyebrow tone="reversed">How referrals are counted</Eyebrow>
              <H2 className="mt-4">A click is not a reward.</H2>
              <Lede tone="reversed" className="mt-5">
                This is the part most referral schemes keep vague. Every referral moves
                through these stages, and your dashboard shows which one each has
                reached. You are never shown an earning that has not been verified.
              </Lede>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <ol className="space-y-px overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--hair-reversed)]">
              {STAGES.map(([stage, meaning], i) => (
                <li key={stage} className="flex gap-5 p-5">
                  <span className="money text-[1.125rem] text-[color:var(--on-dark-3)]">
                    {String(i + 1).padStart(2, "0")}
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
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <div>
              <Eyebrow>Our side of it</Eyebrow>
              <H2 className="mt-4">What we will never do.</H2>
              <Lede className="mt-5">
                These are not aspirations. They are rules we hold ourselves to, and you
                can hold us to them.
              </Lede>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <ul className="space-y-3.5">
              {NEVER.map((line) => (
                <li
                  key={line}
                  className="flex gap-3 border-b border-[color:var(--hair)] pb-3.5 text-[color:var(--ink-2)] last:border-0"
                >
                  <span
                    aria-hidden="true"
                    className="font-bold text-[color:var(--color-error)]"
                  >
                    —
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section tone="paper-2" width="narrow" className="text-center">
        <Reveal>
          <Card tone="cream">
            <H2>Ready to start?</H2>
            <p className="mx-auto mt-5 max-w-lg text-lead text-[color:var(--ink-2)]">
              Create your account, choose an opportunity and get your referral link
              today.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/join" size="lg">
                Get started
              </Button>
            </div>
            <div className="mx-auto mt-6 max-w-md">
              <FinePrint>
                Joining is free. Rewards are paid on verified, approved referrals only.
              </FinePrint>
            </div>
          </Card>
        </Reveal>
      </Section>
    </div>
  );
}
