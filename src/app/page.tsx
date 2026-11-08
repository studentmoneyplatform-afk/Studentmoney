import Link from "next/link";
import { Figure } from "@/components/figure";
import { Counter, LineReveal, Marquee, Parallax, Tilt } from "@/components/motion";
import { Money } from "@/components/money";
import { Reveal } from "@/components/reveal";
import { RewardBar } from "@/components/reward-bar";
import { Button, Card, Chip, Eyebrow, FinePrint, H2, Lede, Section } from "@/components/ui";
import { CATEGORIES } from "@/lib/catalog";
import { OpportunityCard } from "@/components/opportunity-card";
import { getLiveOpportunities } from "@/lib/opportunities-data";
import { PROJECT_REWARD_USD, rewardAtProgress } from "@/lib/rewards";
import { formatPercent, formatUsd } from "@/lib/money";

const MILESTONES = [0.3, 0.7, 1];

export default async function HomePage() {
  const opportunities = await getLiveOpportunities();

  return (
    <div data-page="home">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-8 pt-12 sm:pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-56 left-1/2 h-[40rem] w-[72rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--accent-wash),transparent)] opacity-80"
        />

        <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <Reveal>
              <div className="flex flex-wrap items-center gap-2.5">
                <Chip tone="forest">Opening on Nigerian campuses</Chip>
                <span className="text-caption text-[color:var(--ink-3)]">
                  Bells · McPherson · OOU
                </span>
              </div>
            </Reveal>

            <h1 className="font-display mt-7 text-hero">
              <LineReveal
                lines={[
                  "Students don't",
                  "have to wait",
                  <span key="l3">
                    <span className="italic accent-text">to earn.</span>
                  </span>,
                ]}
              />
            </h1>

            <Reveal delay={420}>
              <Lede className="mt-7">
                A network, a skill, a phone and some hustle. That is already a
                business — StudentMoney is where you run it. Refer a client, sell a
                design, edit a reel, teach a junior. Every opportunity says who pays,
                how much, and when.
              </Lede>
            </Reveal>

            <Reveal delay={480}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button href="/join" size="lg">
                  Start earning — it&apos;s free
                </Button>
                <Button href="/marketplace" variant="ghost" size="lg">
                  Browse the marketplace
                </Button>
              </div>
            </Reveal>

            <Reveal delay={540}>
              <p className="mt-6 text-caption text-[color:var(--ink-3)]">
                Free to join · No fee to list a skill · Paid to your own bank account
              </p>
            </Reveal>
          </div>

          {/* Photo cluster */}
          <div className="relative grid grid-cols-5 gap-3 sm:gap-4">
            <Parallax strength={26} className="col-span-3">
              <Figure
                src="/photos/hero-student-1.jpg"
                alt="A student checking an opportunity on their phone between lectures"
                brief="Student on a phone, campus, natural light"
                ratio="4/5"
                priority
              />
            </Parallax>

            <div className="col-span-2 flex flex-col gap-3 sm:gap-4">
              <Parallax strength={-18}>
                <Figure
                  src="/photos/hero-student-2.jpg"
                  alt="Two students working together on a laptop outdoors"
                  brief="Two students, one laptop, laughing"
                  ratio="1/1"
                />
              </Parallax>

              <Parallax strength={-34}>
                <Figure
                  src="/photos/hero-student-3.jpg"
                  alt="A student filming a short product video on a phone tripod"
                  brief="Filming a reel on a phone tripod"
                  ratio="3/4"
                />
              </Parallax>
            </div>

            {/* Floating proof chip over the cluster */}
            <div className="float-slow pointer-events-none absolute -bottom-5 -left-3 w-[16rem] max-w-[78%] rounded-[var(--radius-lg)] border border-[color:var(--hair)] bg-white/95 p-4 shadow-[0_24px_60px_-30px_rgba(22,19,15,0.55)] backdrop-blur sm:-left-7">
              <p className="text-micro font-bold uppercase tracking-widest text-[color:var(--ink-3)]">
                Reward released
              </p>
              <div className="mt-1.5 flex items-baseline gap-2">
                <Money usd={17.5} size="sm" tone="earned" showNgn={false} />
                <span className="text-caption text-[color:var(--ink-3)]">of $25</span>
              </div>
              <RewardBar cash={14} grow={3.5} surface="light" className="mt-3" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker ─────────────────────────────────────────── */}
      <div className="mt-20 border-y border-[color:var(--hair)] bg-white py-4">
        <Marquee speed={46}>
          {CATEGORIES.map(
            (item) => (
              <span
                key={`${item.slug}-${item.name}`}
                className="flex shrink-0 items-center gap-4 whitespace-nowrap text-[1.0625rem] font-bold text-[color:var(--ink-2)]"
              >
                {item.name}
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-money" />
              </span>
            ),
          )}
        </Marquee>
      </div>

      {/* ── The numbers that are actually true ─────────────── */}
      <Section>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: 9, suffix: "", label: "ways to earn", sub: "Not one gimmick. Nine real tracks." },
            { n: 12, suffix: "", label: "marketplace categories", sub: "Design, video, tutoring, tech, more." },
            { n: 25, prefix: "$", label: "top referral reward", sub: "Per qualifying project, as the client pays." },
            { n: 80, suffix: "%", label: "of every reward is cash", sub: "The other 20% is your Grow share." },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 70}>
              <div className="border-t-2 border-[color:var(--ink-1)] pt-5">
                <p className="money text-[clamp(2.5rem,5vw,3.5rem)] leading-none">
                  <Counter to={stat.n} prefix={stat.prefix ?? ""} suffix={stat.suffix ?? ""} />
                </p>
                <p className="mt-3 font-bold">{stat.label}</p>
                <p className="mt-1 text-caption text-[color:var(--ink-3)]">{stat.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── The three opportunities ────────────────────── */}
      <Section tone="paper-2">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>Live right now</Eyebrow>
              <H2 className="mt-4 max-w-2xl">
                Three ways to earn. One StudentMoney.
              </H2>
              <Lede className="mt-5">
                Join one of them, or run all three at once. Each has its own target and
                its own reward, and each one says what counts before you start.
              </Lede>
            </div>
            <Button href="/opportunities" variant="ghost">
              Explore all three
            </Button>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {opportunities.map((o, i) => (
            <Reveal key={o.slug} delay={i * 70}>
              <OpportunityCard opportunity={o} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 max-w-3xl">
            <FinePrint>
              A click is not a referral and a referral is not a reward. Every referral
              is verified and approved before anything is paid, and you can see which
              stage each one is at.
            </FinePrint>
          </div>
        </Reveal>
      </Section>

      {/* ── Marketplace ────────────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>The marketplace</Eyebrow>
              <H2 className="mt-4 max-w-xl">A profile that earns while you sleep.</H2>
            </div>
            <Button href="/marketplace" variant="ghost">
              Browse everything
            </Button>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CATEGORIES.slice(0, 9).map((c) => (
                <Link
                  key={c.slug}
                  href={`/marketplace#${c.slug}`}
                  className="lift group rounded-[var(--radius-lg)] border border-[color:var(--hair)] bg-white px-4 py-5"
                >
                  <p className="font-bold transition-colors group-hover:accent-text">{c.name}</p>
                  <p className="mt-1 text-caption text-[color:var(--ink-3)]">
                    {c.blurb.split(",")[0]}
                  </p>
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Tilt>
              <Card className="h-full">
                <Figure
                  src="/photos/track-gigs.jpg"
                  alt="A student working on a design commission"
                  brief="Hands on a laptop, design open"
                  ratio="3/2"
                  rounded="lg"
                />
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-h3">Logo and brand kit</p>
                    <p className="mt-1 text-caption text-[color:var(--ink-3)]">
                      Design · 3-day turnaround
                    </p>
                  </div>
                  <span className="money text-[1.5rem] text-money">$35</span>
                </div>
                <div className="mt-4">
                  <FinePrint>
                    The listing format. Real listings open with the first verified
                    students.
                  </FinePrint>
                </div>
              </Card>
            </Tilt>
          </Reveal>
        </div>
      </Section>

      {/* ── Ledger ─────────────────────────────────────────── */}
      <Section tone="forest">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-start">
          <Reveal>
            <div>
              <Eyebrow tone="reversed">Why you can trust the number</Eyebrow>
              <H2 className="mt-4">Every naira traces back to a payment that cleared.</H2>
              <Lede tone="reversed" className="mt-5">
                Most &ldquo;earn online&rdquo; offers go quiet exactly when you ask how
                the money is calculated. Ours is public before you join.
              </Lede>

              <dl className="mt-10 space-y-6">
                {[
                  ["You earn as the client pays", "Not on signature, not on promise. Your reward tracks the share the client has actually paid."],
                  ["Never paid twice", "The ledger recalculates and pays the difference. It is derived from cleared payments, not a number someone types in."],
                  ["A refund walks it back", "If a payment reverses, the part of your reward it funded reverses too. Better you hear that now."],
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
                      <Money usd={split.earned} size="sm" tone="earned-reversed" showNgn={false} />
                    </div>
                  );
                })}
              </div>
              <div className="mt-7">
                <RewardBar />
              </div>
              <div className="mt-6">
                <Button href="/rewards" variant="light" size="sm">
                  Read the full reward rules
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Profiles ───────────────────────────────────────── */}
      <Section tone="paper-2">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal>
            <div>
              <Eyebrow>Student profiles</Eyebrow>
              <H2 className="mt-4">A CV that actually proves something.</H2>
              <Lede className="mt-5">
                Anyone can write &ldquo;hardworking and detail-oriented&rdquo;. Nobody
                can fake twelve delivered jobs, a verified university and ratings from
                the people who paid. By graduation this is worth more than the
                certificate in the conversations that matter.
              </Lede>
              <div className="mt-8">
                <Button href="/students">See how profiles work</Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Figure
                  key={n}
                  src={`/photos/profile-${n}.jpg`}
                  alt={`Portrait of a StudentMoney member`}
                  brief="Portrait, plain background"
                  ratio="1/1"
                  rounded="lg"
                  className={n % 2 === 0 ? "mt-6" : ""}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Businesses ─────────────────────────────────────── */}
      <Section>
        <Reveal>
          <div className="overflow-hidden rounded-[var(--radius-xl)] accent-wash">
            <div className="grid gap-10 p-8 sm:p-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <Eyebrow>For businesses</Eyebrow>
                <H2 className="mt-4">Hire students who have something to prove.</H2>
                <Lede className="mt-5">
                  Post a gig, run a referral campaign, or commission content from
                  students who already live inside the audience you are chasing. You
                  pay for outcomes, not impressions.
                </Lede>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href="/for-businesses">Post a gig</Button>
                  <Button href="/join?as=business" variant="ghost">
                    Run a campaign
                  </Button>
                </div>
              </div>

              <Figure
                src="/photos/business-hero.jpg"
                alt="A small business owner in their shop"
                brief="Small business owner in their shop"
                ratio="4/5"
              />
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ── Close ──────────────────────────────────────────── */}
      <Section tone="paper-2" width="narrow" className="text-center">
        <Reveal>
          <H2>
            Your next {formatUsd(PROJECT_REWARD_USD)} starts with one introduction.
          </H2>
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
              No fee to join. Earning targets are goals, not guarantees — every
              campaign publishes what qualifies, who funds the reward and when it is
              paid.
            </FinePrint>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}
