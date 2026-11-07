import Link from "next/link";
import { Money } from "@/components/money";
import { RewardBar } from "@/components/reward-bar";
import { Button, Card, Eyebrow, FinePrint, H2, Lede, Section } from "@/components/ui";
import { PROJECT_REWARD_USD, rewardAtProgress } from "@/lib/rewards";
import { formatPercent, formatUsd } from "@/lib/money";

const MILESTONES = [0.3, 0.7, 1];

const REASONS = [
  {
    title: "Rewards you can trace",
    body: "A ledger shows each reward as client payments clear. You always know what you have earned and what is still to come.",
  },
  {
    title: "Real projects only",
    body: "Approved providers, real customers, real work delivered. You are never asked to promote something that does not exist.",
  },
  {
    title: "Rules in plain words",
    body: "Published terms for refunds, disputes and payouts. What qualifies you to earn is written down before you start.",
  },
];

const OPPORTUNITIES = [
  {
    title: "Referral campaigns",
    body: "Introduce a business that needs a website, an AI tool or software built. Earn as the client pays.",
    href: "/opportunities#referrals",
  },
  {
    title: "Paid video campaigns",
    body: "Make an approved promotional video to a published brief. Paid on approval, separate from referral rewards.",
    href: "/opportunities#videos",
  },
  {
    title: "Sales lessons",
    body: "Short, practical lessons on finding customers, writing messages that land, handling objections and closing.",
    href: "/opportunities#lessons",
  },
  {
    title: "Weekly challenges",
    body: "Time-bound goals that keep you moving, with the eligibility rules and the number of live openings stated up front.",
    href: "/opportunities#challenges",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-forest text-cream">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <Eyebrow tone="accent">Referral campaign · live</Eyebrow>
            <h1 className="font-display mt-5 text-[2.75rem] leading-[1.02] sm:text-display">
              One introduction.
              <br />
              Up to{" "}
              <span className="text-hibiscus-light">
                {formatUsd(PROJECT_REWARD_USD)}
              </span>
              .
            </h1>
            <Lede className="mt-6 text-cream/90">
              Know a business that needs a website? Introduce the customer to an
              approved provider. You earn as the client pays, and you can always see
              where you stand.
            </Lede>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/join" variant="cream" size="lg">
                Get your link
              </Button>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center rounded-full border-2 border-cream/40 px-8 py-4 text-[1.0625rem] font-bold text-cream transition-colors hover:border-cream"
              >
                See how it works
              </Link>
            </div>

            <div className="mt-6">
              <FinePrint tone="reversed">
                Paid as qualifying client payments clear. Terms apply.
              </FinePrint>
            </div>
          </div>

          {/* The reward, shown before anything is shared. */}
          <Card
            tone="forest"
            className="border border-[color:var(--color-rule-reversed)]"
          >
            <Eyebrow tone="accent">Your reward on a qualifying project</Eyebrow>
            <div className="mt-5">
              <Money usd={PROJECT_REWARD_USD} size="xl" tone="earned-reversed" />
            </div>
            <RewardBar className="mt-7" />
            <p className="mt-5 text-[0.9375rem] text-cream/85">
              Every reward shows the split before you share anything.{" "}
              <strong className="font-extrabold text-cream">
                {formatUsd(20)} is yours to withdraw
              </strong>
              , and {formatUsd(5)} is held as your Grow share.
            </p>
            <div className="mt-3">
              <FinePrint tone="reversed">
                The Grow share stays visible in your ledger from the day it is earned.
              </FinePrint>
            </div>
          </Card>
        </div>
      </section>

      {/* Reasons to believe */}
      <Section tone="cream">
        <Eyebrow>Why you can trust it</Eyebrow>
        <H2 className="mt-4 max-w-3xl">Earning, made visible and honest.</H2>
        <Lede className="mt-5 text-ink/80">
          Every opportunity shows what you do, who pays, and when you get paid.
        </Lede>

        <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-[color:var(--color-rule)] sm:grid-cols-3">
          {REASONS.map((reason) => (
            <div key={reason.title} className="bg-cream p-7">
              <h3 className="font-display text-[1.375rem]">{reason.title}</h3>
              <p className="mt-3 text-ink/80">{reason.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* The ledger */}
      <Section tone="raised">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div>
            <Eyebrow>The reward, step by step</Eyebrow>
            <H2 className="mt-4">You earn as the client pays.</H2>
            <Lede className="mt-5 text-ink/80">
              The reward is {formatUsd(PROJECT_REWARD_USD)} for one qualifying project,
              released in proportion to the client payments that have actually cleared.
              Not {formatUsd(PROJECT_REWARD_USD)} per instalment —{" "}
              {formatUsd(PROJECT_REWARD_USD)} for the project.
            </Lede>
            <div className="mt-7">
              <Button href="/rewards" variant="outline">
                Read the full reward rules
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[var(--radius-card)] border-2 border-ink/15">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Cumulative student reward as client payments clear
              </caption>
              <thead>
                <tr className="bg-forest text-cream">
                  <th
                    scope="col"
                    className="px-5 py-4 text-fine font-extrabold uppercase tracking-wider"
                  >
                    Client has paid
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-4 text-fine font-extrabold uppercase tracking-wider"
                  >
                    You have earned
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-4 text-fine font-extrabold uppercase tracking-wider"
                  >
                    Cash / Grow
                  </th>
                </tr>
              </thead>
              <tbody>
                {MILESTONES.map((progress) => {
                  const split = rewardAtProgress(progress);
                  return (
                    <tr key={progress} className="border-t border-ink/10 bg-cream">
                      <th scope="row" className="px-5 py-5 font-bold">
                        {formatPercent(progress)}
                      </th>
                      <td className="px-5 py-5">
                        <Money
                          usd={split.earned}
                          size="sm"
                          tone="earned"
                          showNgn={false}
                        />
                      </td>
                      <td className="px-5 py-5 text-[0.9375rem] text-ink/80">
                        {formatUsd(split.cash)} / {formatUsd(split.grow)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="bg-cream px-5 pb-5">
              <FinePrint>
                Worked on a project priced at its full agreed amount. Rewards are
                calculated from cleared, eligible payments and are never paid twice.
              </FinePrint>
            </div>
          </div>
        </div>
      </Section>

      {/* Opportunity types */}
      <Section tone="cream">
        <Eyebrow>More than referrals</Eyebrow>
        <H2 className="mt-4 max-w-3xl">Four ways to earn and get better.</H2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {OPPORTUNITIES.map((item) => (
            <Card key={item.title} tone="outline" className="flex flex-col">
              <h3 className="font-display text-subhead">{item.title}</h3>
              <p className="mt-3 flex-1 text-ink/80">{item.body}</p>
              <Link
                href={item.href}
                className="mt-5 inline-flex font-bold text-forest underline underline-offset-4"
              >
                Read more
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      {/* Businesses */}
      <Section tone="forest">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow tone="accent">For businesses</Eyebrow>
            <H2 className="mt-4">A student network that brings you real customers.</H2>
            <Lede className="mt-5 text-cream/85">
              You pay for outcomes, not impressions. Rewards are funded per campaign and
              released only when your client payments clear.
            </Lede>
            <div className="mt-8">
              <Button href="/for-businesses" variant="cream">
                Run a campaign
              </Button>
            </div>
          </div>
          <Card
            tone="forest"
            className="border border-[color:var(--color-rule-reversed)]"
          >
            <ul className="space-y-4 text-cream/90">
              <li>Approved providers with real delivery capacity, vetted before launch.</li>
              <li>Unique attribution per student, with duplicate and fraud controls.</li>
              <li>Campaign economics agreed before a single reward is promised.</li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* Final call */}
      <Section tone="raised" className="text-center">
        <H2 className="mx-auto max-w-2xl">
          Your next {formatUsd(PROJECT_REWARD_USD)} starts with one genuine
          introduction.
        </H2>
        <div className="mt-8 flex justify-center">
          <Button href="/join" size="lg">
            Join StudentMoney
          </Button>
        </div>
        <div className="mx-auto mt-6 max-w-xl">
          <FinePrint>
            Joining is free. Earning targets are goals, not guarantees — each campaign
            states what qualifies, who funds the reward and when it is paid.
          </FinePrint>
        </div>
      </Section>
    </>
  );
}
