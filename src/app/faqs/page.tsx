import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Button, Eyebrow, FinePrint, H2, Section } from "@/components/ui";
import { SectionHead, StatBand } from "@/components/sections";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "How referrals are counted, when rewards are paid, what a pending status means, and what Stormm will never do.",
};

const GROUPS = [
  {
    heading: "Getting started",
    items: [
      [
        "Does it cost anything to join?",
        "No. Joining is free, listing a skill is free, and there is no fee taken before you have earned anything.",
      ],
      [
        "Who can join?",
        "Nigerian university students aged 18 and over who can verify their identity. One account per person — attribution has to belong to a real, verified individual.",
      ],
      [
        "Do I have to pick one opportunity?",
        "No. You can join one, two or all three. Each has its own target and reward, and progress on one never cancels another.",
      ],
    ],
  },
  {
    heading: "Referrals and tracking",
    items: [
      [
        "How is a referral tracked to me?",
        "You get a link or code that is yours alone for each opportunity. Anyone who arrives through it is attributed to you from that moment.",
      ],
      [
        "Someone clicked my link. Have I earned?",
        "Not yet, and we will not pretend otherwise. A click is the first of five stages: clicked, registered, pending verification, approved, paid. Money only moves at approved.",
      ],
      [
        "Why would a referral be rejected?",
        "Because it was already attributed to another student, because the contact was not genuine, because the person never completed what the opportunity requires, or because it was a self-referral. You are told the reason.",
      ],
      [
        "Can I refer myself or use a second account?",
        "No. Self-referrals are blocked, and duplicate claims on the same person are rejected automatically.",
      ],
    ],
  },
  {
    heading: "Getting paid",
    items: [
      [
        "When does money actually reach me?",
        "After a referral is approved, the reward is added to your balance. Payouts go to a Nigerian bank account in your own name, and the fee, minimum and timing are shown before you confirm.",
      ],
      [
        "Why is my reward showing as pending?",
        "It is waiting on verification. We check referrals are genuine before approving them, because a reward paid on a fake referral is money taken from the students who did the work.",
      ],
      [
        "What happens if a referral is reversed?",
        "If the underlying payment is refunded or cancelled, the part of your reward it funded reverses with it. Where that happens after payout, it is recovered from future rewards rather than demanded back.",
      ],
      [
        "What rate do you use for naira?",
        "Rewards are set in dollars and converted at the rate posted on this site. The amount you receive is the amount confirmed at the moment you withdraw.",
      ],
    ],
  },
  {
    heading: "What we will not do",
    items: [
      [
        "Do you guarantee I will earn?",
        "No. Earning targets are goals with published rules, not promises. Anyone telling you a platform guarantees income is not being straight with you.",
      ],
      [
        "Do you pay for recruiting other students?",
        "Not on its own. Any recruitment incentive must be funded by a real opportunity and disclosed, never by the sign-ups themselves.",
      ],
      [
        "Will you publish my name or earnings?",
        "Only if you agree first. We ask before using anyone's name, photograph, earnings or words.",
      ],
    ],
  },
];

export default function FaqsPage() {
  return (
    <div data-page="rewards">
      <PageHero
        variant="centred"
        eyebrow="FAQs"
        lines={[
          "The questions worth",
          <span key="l2" className="italic text-green-bright">asking first.</span>,
        ]}
        lede="Especially the uncomfortable ones. If something here reads vaguely, tell us and we will make it plainer."
      />

      <Section tone="paper">
        <SectionHead
          align="centre"
          script="The short version"
          title="If you only read four lines."
        />
        <div className="mt-12">
          <StatBand
            items={[
              { value: "Free", label: "to join, and to take on any opportunity" },
              { value: "5", label: "stages a referral passes before anything is owed" },
              { value: "Naira", label: "paid to a bank account in your own name" },
              { value: "No", label: "guaranteed income, and we will never claim otherwise" },
            ]}
          />
        </div>
      </Section>

      <Section tone="paper-2" width="narrow" className="[&_>div>div]:space-y-14">
        {GROUPS.map((group, gi) => (
          <Reveal key={group.heading} delay={gi * 60}>
            <div>
              <Eyebrow>{group.heading}</Eyebrow>
              <div className="mt-5 divide-y divide-[color:var(--hair)] border-y border-[color:var(--hair)]">
                {group.items.map(([q, a]) => (
                  <details key={q} className="group py-5">
                    <summary className="flex cursor-pointer items-start justify-between gap-5 font-display text-[1.25rem] leading-snug marker:content-['']">
                      {q}
                      <span
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-[color:var(--ink-3)] transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-prose text-[color:var(--ink-2)]">{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </Section>

      <Section width="narrow" className="text-center">
        <Reveal>
          <H2>Still unsure about something?</H2>
          <p className="mx-auto mt-5 max-w-lg text-lead text-[color:var(--ink-2)]">
            The terms page sets out the rules in full, and the opportunity pages carry
            the specifics for each one.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/opportunities" size="lg">Explore opportunities</Button>
            <Button href="/terms" variant="ghost" size="lg">Read the terms</Button>
          </div>
          <div className="mx-auto mt-6 max-w-md">
            <FinePrint>
              Some details on the newer opportunities are still being confirmed with
              our partners. Those are marked as such on each opportunity page.
            </FinePrint>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}
