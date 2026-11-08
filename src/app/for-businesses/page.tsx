import type { Metadata } from "next";
import { Button, Card, Eyebrow, FinePrint, H2, Lede, Section } from "@/components/ui";
import { PROJECT_REWARD_USD } from "@/lib/rewards";
import { formatUsd } from "@/lib/money";

export const metadata: Metadata = {
  title: "For businesses",
  description:
    "Reach customers through a student network that is paid for outcomes, not impressions. Run a referral or content campaign with StudentMoney.",
};

const STEPS = [
  {
    title: "We agree the economics first",
    body: "Before a campaign goes live we agree the reward, who funds it, and what counts as a qualifying project. A campaign only launches if it covers the student payout, the payment fees and the operating cost.",
  },
  {
    title: "You are vetted as a provider",
    body: "We check that the product is real, that you can deliver at the volume a campaign could produce, and that your pricing survives student-led acquisition.",
  },
  {
    title: "Students introduce real customers",
    body: "Each student carries a unique attribution code. Leads arrive with the contact, the need and the student attached.",
  },
  {
    title: "You deliver and the ledger follows",
    body: "You quote, agree a price and do the work. Rewards release only as the client payments you report actually clear.",
  },
];

const OFFER = [
  {
    title: "Referral campaigns",
    body: "Pay a fixed reward per qualifying project, released in proportion to cleared payments.",
  },
  {
    title: "Content campaigns",
    body: "Commission approved promotional videos from student creators against a published brief.",
  },
  {
    title: "Campaign management",
    body: "Brief writing, student briefing, approval workflow, attribution and reconciliation handled by us.",
  },
];

export default function ForBusinessesPage() {
  return (
    <>
      <Section tone="forest">
        <Eyebrow tone="reversed">For businesses</Eyebrow>
        <h1 className="font-display mt-5 max-w-4xl text-[2.5rem] leading-[1.05] sm:text-[3.25rem]">
          Customers, brought to you by students who know them.
        </h1>
        <Lede className="mt-6 text-[color:var(--on-dark-1)]/90">
          You pay for outcomes, not impressions. Rewards are funded per campaign and
          released only when your client payments clear.
        </Lede>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/join?as=business" variant="light" size="lg">
            Talk to us about a campaign
          </Button>
        </div>
      </Section>

      <Section tone="cream">
        <Eyebrow>What we run</Eyebrow>
        <H2 className="mt-4 max-w-3xl">Two campaign types, one standard.</H2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {OFFER.map((item) => (
            <Card key={item.title} tone="outline">
              <h3 className="font-display text-[1.375rem]">{item.title}</h3>
              <p className="mt-3 text-ink/80">{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="paper-2" id="providers">
        <Eyebrow>How a campaign runs</Eyebrow>
        <H2 className="mt-4 max-w-3xl">Nothing is promised before it is funded.</H2>
        <ol className="mt-10 space-y-px overflow-hidden rounded-[var(--radius-xl)] bg-[color:var(--hair)]">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-4 bg-paper-2 p-7 sm:flex-row sm:gap-8"
            >
              <span className="money text-[1.75rem] text-moss sm:w-16">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-h3">{step.title}</h3>
                <p className="mt-2 max-w-2xl text-ink/80">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="forest">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <Eyebrow tone="reversed">What it costs you</Eyebrow>
            <H2 className="mt-4">A reward you fund, and nothing you did not agree.</H2>
            <Lede className="mt-5 text-[color:var(--on-dark-1)]/85">
              The standard student reward on a referral campaign is{" "}
              {formatUsd(PROJECT_REWARD_USD)} per qualifying project. Campaign
              management and any content budget are agreed separately, in writing,
              before launch.
            </Lede>
          </div>
          <Card tone="forest" className="border border-[color:var(--hair-reversed)]">
            <h2 className="font-display text-h3">What we need from you</h2>
            <ul className="mt-5 space-y-3 text-[color:var(--on-dark-1)]/90">
              <li>A real product or service, already being delivered.</li>
              <li>Capacity to handle the leads a campaign will produce.</li>
              <li>Honest reporting of client payments as they clear.</li>
              <li>Published pricing or a quote process a student can explain.</li>
            </ul>
            <div className="mt-6">
              <FinePrint tone="reversed">
                We decline campaigns we cannot describe honestly to a student, and
                campaigns whose economics do not cover the reward.
              </FinePrint>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
