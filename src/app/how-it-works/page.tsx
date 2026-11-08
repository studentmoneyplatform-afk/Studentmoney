import type { Metadata } from "next";
import { Money } from "@/components/money";
import { RewardBar } from "@/components/reward-bar";
import { Button, Card, Eyebrow, FinePrint, H2, Lede, Section } from "@/components/ui";
import { PROJECT_REWARD_USD, rewardAtProgress } from "@/lib/rewards";
import { formatPercent, formatUsd } from "@/lib/money";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Join, get your link, introduce a real business, and earn as the client pays. Every step, with the rule that applies to it.",
};

const STEPS = [
  {
    n: "01",
    title: "Join and get verified",
    body: "Register with your name, your school and a phone number that works on WhatsApp. We verify who you are before any reward is attributed to you, because attribution has to belong to a real person.",
  },
  {
    n: "02",
    title: "Pick a live campaign",
    body: "Every campaign names the provider who delivers the work, what counts as a qualifying project, who funds the reward and when it is paid. If a campaign cannot answer those four questions, it does not go live.",
  },
  {
    n: "03",
    title: "Get your link",
    body: "You receive a referral link or code that is yours alone. Whoever you introduce is attributed to you from the moment they arrive through it.",
  },
  {
    n: "04",
    title: "Make a genuine introduction",
    body: "Talk to a business you actually know needs the work. Submit the lead with the contact and what they need. No spam, no made-up companies, no stuffing the form with names.",
  },
  {
    n: "05",
    title: "The provider delivers",
    body: "The approved provider quotes, agrees a price and does the work. You are not responsible for delivery, and you are never asked to collect money from the client.",
  },
  {
    n: "06",
    title: "You earn as payments clear",
    body: "Each time a client payment clears, your ledger moves. You can see what you have earned, what is still to come, and the date your payout is due.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Section tone="forest">
        <Eyebrow tone="reversed">How it works</Eyebrow>
        <h1 className="font-display mt-5 max-w-4xl text-[2.5rem] leading-[1.05] sm:text-[3.25rem]">
          Six steps, and the rule that applies to each one.
        </h1>
        <Lede className="mt-6 text-[color:var(--on-dark-1)]/90">
          Every opportunity shows what you do, who pays, and when you get paid. Here is
          the whole path, from joining to the money landing.
        </Lede>
      </Section>

      <Section tone="cream">
        <ol className="grid gap-px overflow-hidden rounded-[var(--radius-xl)] bg-[color:var(--hair)] sm:grid-cols-2">
          {STEPS.map((step) => (
            <li key={step.n} className="bg-cream p-7 sm:p-8">
              <span className="money text-[1.75rem] text-moss">{step.n}</span>
              <h2 className="font-display mt-2 text-h3">{step.title}</h2>
              <p className="mt-3 text-ink/80">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="paper-2">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <Eyebrow>The money, worked through</Eyebrow>
            <H2 className="mt-4">A real example.</H2>
            <Lede className="mt-5 text-ink/80">
              You introduce a restaurant that needs a website. The provider agrees a
              price with them. Your reward is {formatUsd(PROJECT_REWARD_USD)} for the
              project, released in proportion to what the client has actually paid.
            </Lede>
            <div className="mt-8 space-y-5">
              {[0.3, 0.7, 1].map((progress) => {
                const split = rewardAtProgress(progress);
                return (
                  <div
                    key={progress}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-5"
                  >
                    <div>
                      <p className="font-bold">
                        Client has paid {formatPercent(progress)}
                      </p>
                      <FinePrint>
                        {formatUsd(split.cash)} cash · {formatUsd(split.grow)} Grow
                      </FinePrint>
                    </div>
                    <Money usd={split.earned} size="sm" tone="earned" showNgn={false} />
                  </div>
                );
              })}
            </div>
            <div className="mt-6">
              <FinePrint>
                The reward is {formatUsd(PROJECT_REWARD_USD)} for the project, not{" "}
                {formatUsd(PROJECT_REWARD_USD)} per instalment. Cumulative rewards are
                never paid twice.
              </FinePrint>
            </div>
          </div>

          <Card tone="forest">
            <Eyebrow tone="reversed">When the project completes</Eyebrow>
            <div className="mt-5">
              <Money usd={PROJECT_REWARD_USD} size="lg" tone="earned-reversed" />
            </div>
            <RewardBar className="mt-7" />
            <p className="mt-6 text-[color:var(--on-dark-1)]/85">
              {formatUsd(20)} is yours to withdraw once you pass the minimum payout
              amount. {formatUsd(5)} is held as your Grow share and stays visible in
              your ledger.
            </p>
            <div className="mt-4">
              <FinePrint tone="reversed">
                Refunds, chargebacks and cancelled projects reverse the reward they
                relate to. The terms page sets out exactly how.
              </FinePrint>
            </div>
          </Card>
        </div>
      </Section>

      <Section tone="cream">
        <H2>What we will never do.</H2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {[
            "Promise guaranteed income, or call anything here passive.",
            "Pay you for recruiting other students and nothing else.",
            "Publish a fake testimonial or a doctored earnings screenshot.",
            "Quote an earning target without the rules that apply to it.",
            "Pay a reward on a payment that has not cleared.",
            "Ask you to collect money from a client on our behalf.",
          ].map((line) => (
            <li key={line} className="flex gap-3 border-b border-ink/10 pb-4">
              <span aria-hidden="true" className="font-bold text-error">
                —
              </span>
              <span className="text-ink/85">{line}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <Button href="/join" size="lg">
            Join StudentMoney
          </Button>
        </div>
      </Section>
    </>
  );
}
