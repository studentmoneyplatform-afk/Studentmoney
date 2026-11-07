import type { Metadata } from "next";
import { Money } from "@/components/money";
import { RewardCalculator } from "@/components/reward-calculator";
import { Button, Card, Eyebrow, FinePrint, H2, Lede, Section } from "@/components/ui";
import { GROW_USD, PROJECT_REWARD_USD, WITHDRAWABLE_USD } from "@/lib/rewards";
import { NGN_PER_USD, formatUsd } from "@/lib/money";

export const metadata: Metadata = {
  title: "Rewards and payouts",
  description:
    "How the $25 project reward is calculated, how the cash and Grow split works, and the rules that govern refunds, disputes and payouts.",
};

const RULES = [
  {
    title: "One code, one student",
    body: "Each referral carries an attribution code or link that belongs to you alone. Whoever arrives through it is attributed to you.",
  },
  {
    title: "The customer and the project must be real",
    body: "A qualifying project is genuine work, agreed with a real customer, delivered by an approved provider.",
  },
  {
    title: "Cleared payments only",
    body: "Rewards are calculated from client payments that have actually cleared. A pending or failed payment moves nothing.",
  },
  {
    title: "Never paid twice",
    body: "Your reward is cumulative. Each time it recalculates, you are paid the difference, never the whole amount again.",
  },
  {
    title: "Duplicates and fraud are excluded",
    body: "A referral already attributed to another student, or a lead submitted in bad faith, does not qualify and is removed from the ledger.",
  },
  {
    title: "Reversals follow the money",
    body: "If a client payment is refunded, charged back or cancelled, the part of your reward that payment funded reverses with it.",
  },
];

export default function RewardsPage() {
  return (
    <>
      <Section tone="forest">
        <Eyebrow tone="accent">Rewards and payouts</Eyebrow>
        <h1 className="font-display mt-5 max-w-4xl text-[2.5rem] leading-[1.05] sm:text-[3.25rem]">
          The whole reward, in plain words.
        </h1>
        <Lede className="mt-6 text-cream/90">
          No part of how you get paid is hidden in a footnote. This page is the rule,
          and the ledger in your dashboard follows it exactly.
        </Lede>
      </Section>

      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <Eyebrow>The formula</Eyebrow>
            <H2 className="mt-4">
              {formatUsd(PROJECT_REWARD_USD)} for one qualifying project.
            </H2>
            <Lede className="mt-5 text-ink/80">
              Your cumulative reward is the project reward multiplied by the share of
              the project price the client has paid.
            </Lede>

            <div className="mt-8 rounded-[var(--radius-card)] border-2 border-ink/15 p-6">
              <p className="font-display text-[1.375rem] leading-relaxed">
                {formatUsd(PROJECT_REWARD_USD)} ×{" "}
                <span className="italic">cleared client payments</span> ÷{" "}
                <span className="italic">qualifying project price</span>
              </p>
            </div>

            <p className="mt-6 text-ink/80">
              If the client has paid 70% of the agreed price, you have earned{" "}
              <span className="font-bold">{formatUsd(17.5)}</span>. When they finish
              paying, you have earned the full {formatUsd(PROJECT_REWARD_USD)}. It is{" "}
              {formatUsd(PROJECT_REWARD_USD)} for the project, not per instalment.
            </p>
          </div>

          <RewardCalculator />
        </div>
      </Section>

      <Section tone="raised">
        <Eyebrow>The split</Eyebrow>
        <H2 className="mt-4 max-w-3xl">
          {formatUsd(WITHDRAWABLE_USD)} you can take out. {formatUsd(GROW_USD)} that
          stays and grows.
        </H2>
        <Lede className="mt-5 text-ink/80">
          Of every {formatUsd(PROJECT_REWARD_USD)} you earn,{" "}
          {formatUsd(WITHDRAWABLE_USD)} is cash you can withdraw and{" "}
          {formatUsd(GROW_USD)} is held as your Grow share. Both are visible in your
          ledger from the day they are earned.
        </Lede>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Card tone="outline">
            <Eyebrow>Cash</Eyebrow>
            <div className="mt-4">
              <Money usd={WITHDRAWABLE_USD} size="md" />
            </div>
            <p className="mt-4 text-ink/80">
              Yours to withdraw once your balance passes the minimum payout amount. You
              choose when to take it out.
            </p>
          </Card>

          <Card tone="outline">
            <Eyebrow>Grow</Eyebrow>
            <div className="mt-4">
              <Money usd={GROW_USD} size="md" tone="earned" />
            </div>
            <p className="mt-4 text-ink/80">
              Held inside StudentMoney and put to work within the platform rather than
              paid out as cash. You can see the balance at any time.
            </p>
          </Card>
        </div>

        <div className="mt-8 max-w-3xl">
          <FinePrint>
            The full terms of the Grow share — where the money is held, what it is put
            into, what it can and cannot return, and the conditions under which you can
            access it — are published in the terms before you earn your first reward.
            StudentMoney does not promise a return on the Grow share.
          </FinePrint>
        </div>
      </Section>

      <Section tone="cream">
        <Eyebrow>The rules that govern it</Eyebrow>
        <H2 className="mt-4">Six rules, and they do not move.</H2>

        <ol className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-[color:var(--color-rule)] sm:grid-cols-2">
          {RULES.map((rule, index) => (
            <li key={rule.title} className="bg-cream p-7">
              <span className="money text-[1.5rem] text-moss">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display mt-2 text-[1.375rem]">{rule.title}</h3>
              <p className="mt-3 text-ink/80">{rule.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="forest">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <Eyebrow tone="accent">Getting paid</Eyebrow>
            <H2 className="mt-4">When the money reaches you.</H2>
            <Lede className="mt-5 text-cream/85">
              Your ledger updates as soon as a client payment clears and is verified.
              Payouts are made to a Nigerian bank account in your own name.
            </Lede>
            <div className="mt-8">
              <Button href="/join" variant="cream">
                Join StudentMoney
              </Button>
            </div>
          </div>

          <Card tone="forest" className="border border-[color:var(--color-rule-reversed)]">
            <dl className="space-y-5">
              <div className="border-b border-[color:var(--color-rule-reversed)] pb-5">
                <dt className="eyebrow text-cream/60">Paid in</dt>
                <dd className="mt-1.5 text-cream/90">
                  Naira, to a bank account in your own name.
                </dd>
              </div>
              <div className="border-b border-[color:var(--color-rule-reversed)] pb-5">
                <dt className="eyebrow text-cream/60">Conversion</dt>
                <dd className="mt-1.5 text-cream/90">
                  Rewards are set in dollars and paid at the rate posted on this site,
                  currently ₦{NGN_PER_USD.toLocaleString("en-NG")} to {formatUsd(1)}.
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-cream/60">Fees and timing</dt>
                <dd className="mt-1.5 text-cream/90">
                  Any payout fee, the minimum withdrawal amount and the processing time
                  are shown before you confirm a withdrawal.
                </dd>
              </div>
            </dl>
            <div className="mt-6">
              <FinePrint tone="reversed">
                Naira figures across this site are indicative and follow the posted
                rate. The amount you receive is the amount confirmed at withdrawal.
              </FinePrint>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
