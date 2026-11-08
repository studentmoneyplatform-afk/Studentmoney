import Link from "next/link";
import { Money } from "@/components/money";
import { Reveal } from "@/components/reveal";
import { RewardBar } from "@/components/reward-bar";
import { Button, Card, Chip, Eyebrow, FinePrint, H2, Lede, Section } from "@/components/ui";
import { LIVE_TRACKS, CATEGORIES } from "@/lib/catalog";
import { PROJECT_REWARD_USD, rewardAtProgress } from "@/lib/rewards";
import { formatPercent, formatUsd } from "@/lib/money";

const MILESTONES = [0.3, 0.7, 1];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* A single soft wash, so the hero has depth without a green slab. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 h-[32rem] bg-[radial-gradient(60%_60%_at_50%_40%,var(--color-cream),transparent_70%)]"
        />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
          <Reveal>
            <Chip>Now opening on Nigerian campuses</Chip>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="font-display mt-7 max-w-4xl text-hero">
              Students don&apos;t have to wait{" "}
              <em className="font-display not-italic text-forest">
                <span className="italic">to earn.</span>
              </em>
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <Lede className="mt-7 text-lead">
              StudentMoney turns what you already have — a network, a skill, a phone
              and some hustle — into real income. Refer a business, sell a skill, make
              content, teach a junior. Every opportunity tells you who pays, how much,
              and when.
            </Lede>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button href="/join" size="lg">
                Start earning — it&apos;s free
              </Button>
              <Button href="/marketplace" variant="ghost" size="lg">
                Browse the marketplace
              </Button>
            </div>
          </Reveal>

          {/* The product, shown rather than described. */}
          <Reveal delay={240}>
            <div className="mt-16 grid gap-4 sm:grid-cols-3">
              <Card className="sm:col-span-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Eyebrow>Referral · website project</Eyebrow>
                    <p className="mt-2 font-bold">Mama Nkechi Catering</p>
                  </div>
                  <Chip tone="forest">Client paid 70%</Chip>
                </div>
                <div className="mt-6">
                  <Money usd={17.5} size="lg" tone="earned" />
                </div>
                <RewardBar cash={14} grow={3.5} surface="light" className="mt-6" />
                <div className="mt-4">
                  <FinePrint>
                    Your ledger moves the moment a client payment clears. Nothing is
                    estimated.
                  </FinePrint>
                </div>
              </Card>

              <Card tone="cream">
                <Eyebrow>This week</Eyebrow>
                <ul className="mt-5 space-y-4">
                  {[
                    ["Logo for a barber", "$30"],
                    ["Edit 3 reels", "$18"],
                    ["Tutor ECO 201", "$12"],
                  ].map(([job, fee]) => (
                    <li
                      key={job}
                      className="flex items-baseline justify-between gap-3 border-b border-[color:var(--hair)] pb-3 last:border-0"
                    >
                      <span className="text-[color:var(--ink-2)]">{job}</span>
                      <span className="money text-[1.0625rem] text-hibiscus">{fee}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <FinePrint>Illustrative gigs. Real listings open at launch.</FinePrint>
                </div>
              </Card>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Ways to earn ─────────────────────────────────────── */}
      <Section tone="paper-2">
        <Reveal>
          <Eyebrow>Ways to earn</Eyebrow>
          <H2 className="mt-4 max-w-3xl">
            Nine ways to make money, not one.
          </H2>
          <Lede className="mt-5">
            Different students have different things to sell. Some have a network, some
            have a skill, some just have time between lectures. Pick what fits this
            week and change it next week.
          </Lede>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {LIVE_TRACKS.map((track, i) => (
            <Reveal key={track.slug} delay={i * 45}>
              <Link href={`/opportunities#${track.slug}`} className="block h-full">
                <Card interactive className="flex h-full flex-col">
                  <h3 className="font-display text-h3">{track.title}</h3>
                  <p className="mt-3 flex-1 text-[color:var(--ink-2)]">{track.blurb}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {track.examples.slice(0, 3).map((e) => (
                      <Chip key={e}>{e}</Chip>
                    ))}
                  </div>
                  <p className="mt-5 border-t border-[color:var(--hair)] pt-4 text-caption font-bold text-forest">
                    {track.paid}
                  </p>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10">
            <Button href="/opportunities" variant="ghost">
              See all nine, with the rules on each
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* ── Marketplace ──────────────────────────────────────── */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div>
              <Eyebrow>The marketplace</Eyebrow>
              <H2 className="mt-4">
                A profile that earns while you sleep.
              </H2>
              <Lede className="mt-5">
                List what you can do. Businesses find you, hire you, and the work you
                deliver builds a record nobody can argue with — the closest thing to a
                CV that actually proves something.
              </Lede>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/marketplace">Browse the marketplace</Button>
                <Button href="/students" variant="ghost">
                  See student profiles
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {CATEGORIES.map((c, i) => (
                <div
                  key={c.slug}
                  className="lift rounded-[var(--radius-lg)] border border-[color:var(--hair)] bg-white px-4 py-5"
                  style={{ transitionDelay: `${i * 12}ms` }}
                >
                  <p className="font-bold">{c.name}</p>
                  <p className="mt-1 text-caption text-[color:var(--ink-3)]">
                    {c.blurb.split(",")[0]}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── The ledger: the trust machinery ─────────────────── */}
      <Section tone="forest">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-start">
          <Reveal>
            <div>
              <Eyebrow tone="reversed">Why you can trust the number</Eyebrow>
              <H2 className="mt-4">
                Every naira is traceable to a payment that cleared.
              </H2>
              <Lede tone="reversed" className="mt-5">
                Most &ldquo;earn online&rdquo; offers go quiet exactly when you ask how
                the money is calculated. Here is ours, in public, before you join.
              </Lede>

              <dl className="mt-10 space-y-6">
                {[
                  [
                    "You earn as the client pays",
                    "Not on signature, not on promise. Your reward is the campaign reward multiplied by the share the client has actually paid.",
                  ],
                  [
                    "Never paid twice",
                    "The ledger recalculates and pays the difference. It is derived from cleared payments, not a balance someone types in.",
                  ],
                  [
                    "A refund walks it back",
                    "If a payment is reversed, the part of your reward it funded reverses with it. We would rather tell you that now than surprise you later.",
                  ],
                ].map(([term, def]) => (
                  <div key={term} className="border-t border-[color:var(--hair-reversed)] pt-5">
                    <dt className="font-bold">{term}</dt>
                    <dd className="mt-1.5 text-[color:var(--on-dark-2)]">{def}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-[var(--radius-xl)] border border-[color:var(--hair-reversed)] p-6 sm:p-8">
              <Eyebrow tone="reversed">A $25 referral, step by step</Eyebrow>

              <div className="mt-7 space-y-5">
                {MILESTONES.map((progress) => {
                  const split = rewardAtProgress(progress);
                  return (
                    <div
                      key={progress}
                      className="flex items-center justify-between gap-4 border-b border-[color:var(--hair-reversed)] pb-5 last:border-0"
                    >
                      <div>
                        <p className="font-bold">Client has paid {formatPercent(progress)}</p>
                        <p className="text-caption text-[color:var(--on-dark-3)]">
                          {formatUsd(split.cash)} cash · {formatUsd(split.grow)} Grow
                        </p>
                      </div>
                      <Money
                        usd={split.earned}
                        size="sm"
                        tone="earned-reversed"
                        showNgn={false}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-7">
                <RewardBar />
              </div>

              <p className="mt-6 text-[color:var(--on-dark-2)]">
                Of every {formatUsd(PROJECT_REWARD_USD)},{" "}
                <strong className="text-[color:var(--on-dark-1)]">
                  {formatUsd(20)} is yours to withdraw
                </strong>{" "}
                and {formatUsd(5)} is held as your Grow share.
              </p>

              <div className="mt-6">
                <Button href="/rewards" variant="light" size="sm">
                  Read the full reward rules
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── How it works ────────────────────────────────────── */}
      <Section tone="paper-2">
        <Reveal>
          <Eyebrow>Getting started</Eyebrow>
          <H2 className="mt-4 max-w-2xl">Three steps, and the first one is free.</H2>
        </Reveal>

        <ol className="mt-14 grid gap-10 md:grid-cols-3">
          {[
            [
              "Join and get verified",
              "Sign in with Google or leave your WhatsApp number. Verification matters because attribution has to belong to a real person.",
            ],
            [
              "Pick what fits you",
              "A referral if you know people. A gig if you have a skill. A challenge if you want pressure. You are never locked into one track.",
            ],
            [
              "Get paid, and see why",
              "Your ledger shows what you earned, what is still coming, and which payment moved it. Withdraw to your own bank account.",
            ],
          ].map(([title, body], i) => (
            <Reveal key={title} delay={i * 80}>
              <li className="border-t-2 border-forest pt-5">
                <span className="money text-[1.75rem] text-[color:var(--ink-4)]">
                  0{i + 1}
                </span>
                <h3 className="font-display mt-2 text-h3">{title}</h3>
                <p className="mt-3 text-[color:var(--ink-2)]">{body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* ── For businesses ──────────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="rounded-[var(--radius-xl)] bg-cream p-8 sm:p-14">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <Eyebrow>For businesses</Eyebrow>
                <H2 className="mt-4">
                  Hire students who have something to prove.
                </H2>
                <Lede className="mt-5">
                  Post a gig, run a referral campaign, or commission content from
                  students who know the audience you are trying to reach. You pay for
                  outcomes, not impressions.
                </Lede>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href="/for-businesses">Post a gig</Button>
                  <Button href="/join?as=business" variant="ghost">
                    Run a campaign
                  </Button>
                </div>
              </div>

              <ul className="space-y-4">
                {[
                  "Rewards funded per campaign, agreed before launch.",
                  "Unique attribution per student, with duplicate controls.",
                  "Providers vetted for real delivery capacity.",
                  "Nothing published to students that we cannot describe honestly.",
                ].map((line) => (
                  <li
                    key={line}
                    className="border-b border-[color:var(--hair-strong)] pb-4 text-[color:var(--ink-2)] last:border-0"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ── Honest close ────────────────────────────────────── */}
      <Section tone="paper-2" width="narrow" className="text-center">
        <Reveal>
          <H2>Your next {formatUsd(PROJECT_REWARD_USD)} starts with one introduction.</H2>
          <p className="mx-auto mt-6 max-w-xl text-lead text-[color:var(--ink-2)]">
            Or one logo, one reel, one tutoring session. Whatever you are already good
            at, somebody is willing to pay for it.
          </p>
          <div className="mt-9 flex justify-center">
            <Button href="/join" size="lg">
              Join StudentMoney free
            </Button>
          </div>
          <div className="mx-auto mt-7 max-w-lg">
            <FinePrint>
              No fee to join. Earning targets are goals, not guarantees — every campaign
              publishes what qualifies, who funds the reward and when it is paid.
            </FinePrint>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
