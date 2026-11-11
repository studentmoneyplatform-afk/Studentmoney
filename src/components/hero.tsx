import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { Opportunity } from "@/lib/opportunities";

/** Icon tint per opportunity, matching the floating cards in the design. */
const TINTS: Record<string, { bg: string; icon: React.ReactNode }> = {
  "software-referrals": {
    bg: "bg-tint-code",
    icon: (
      <path
        d="M8 7.5 4 12l4 4.5M16 7.5 20 12l-4 4.5M13.5 5l-3 14"
        stroke="#15803d"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  "dare-company-global": {
    bg: "bg-tint-globe",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" stroke="#5b43c7" strokeWidth="1.8" />
        <path
          d="M4 12h16M12 4c2.2 2.3 2.2 13.7 0 16M12 4c-2.2 2.3-2.2 13.7 0 16"
          stroke="#5b43c7"
          strokeWidth="1.8"
        />
      </>
    ),
  },
  "tobi-music-academy": {
    bg: "bg-tint-music",
    icon: (
      <>
        <path d="M9 18V6.5l9-2v11" stroke="#c23b7a" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="6.8" cy="18" r="2.4" stroke="#c23b7a" strokeWidth="1.8" />
        <circle cx="15.8" cy="15.5" r="2.4" stroke="#c23b7a" strokeWidth="1.8" />
      </>
    ),
  },
};

const TRUST = [
  {
    label: "Flexible Earning\nOpportunities",
    icon: (
      <path
        d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Secure & Trusted\nPlatform",
    icon: (
      <>
        <path
          d="M12 2.5 4.5 5.8v5.5c0 4.6 3.1 8.6 7.5 10 4.4-1.4 7.5-5.4 7.5-10V5.8L12 2.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="m8.8 11.8 2.3 2.3 4.1-4.4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  {
    label: "Join a Growing\nCommunity",
    icon: (
      <>
        <circle cx="9" cy="8.5" r="3.2" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M2.8 19c.6-3.2 3.1-5 6.2-5s5.6 1.8 6.2 5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M16 6.2a3.2 3.2 0 0 1 0 6M18 14.4c2 .7 3.3 2.3 3.7 4.6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </>
    ),
  },
];

/** Short enough for the floating card, true to what the opportunity is. */
function shortLine(slug: string): string {
  switch (slug) {
    case "dare-company-global":
      return "Refer and earn from global services.";
    case "tobi-music-academy":
      return "Refer and earn from music lessons.";
    default:
      return "Refer and earn from software services.";
  }
}

/** One floating opportunity card. */
function OpportunityPill({
  opportunity,
  index,
  flat = false,
}: {
  opportunity: Opportunity;
  index: number;
  flat?: boolean;
}) {
  const tint = TINTS[opportunity.slug] ?? TINTS["software-referrals"];
  return (
    <Link
      href={`/opportunities/${opportunity.slug}`}
      className="pointer-events-auto flex items-center gap-3.5 rounded-2xl bg-paper p-3.5 shadow-[0_18px_44px_-26px_rgba(18,32,26,0.65)] ring-1 ring-ink/5 transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] hover:-translate-y-1"
      style={flat ? undefined : { transform: `rotate(${index % 2 === 0 ? -1.4 : 1.2}deg)` }}
    >
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tint.bg}`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {tint.icon}
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.9375rem] font-extrabold leading-tight text-ink">
          {opportunity.name}
        </span>
        <span className="mt-0.5 block text-[0.75rem] leading-snug text-moss">
          {shortLine(opportunity.slug)}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-forest text-[0.75rem] text-paper"
      >
        →
      </span>
    </Link>
  );
}

/** Hand-drawn marks, as in the reference. Decorative only. */
function Doodles() {
  return (
    <>
      <svg
        aria-hidden="true"
        viewBox="0 0 70 60"
        className="pointer-events-none absolute left-[52%] top-[2%] z-30 hidden w-12 text-green lg:block"
        fill="none"
      >
        <path d="M6 44C14 30 10 16 22 6" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <path d="M34 38C44 28 44 16 56 10" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 60 60"
        className="pointer-events-none absolute bottom-[16%] right-[25%] z-30 hidden w-10 text-green lg:block"
        fill="none"
      >
        <path d="M8 30h16M44 12l10-6M40 44l12 6" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    </>
  );
}

export function Hero({ opportunities }: { opportunities: Opportunity[] }) {
  const cards = opportunities.slice(0, 3);

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto w-full max-w-[86rem] px-5 pb-8 sm:px-8">
        {/* Organic washes behind the figure */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="absolute right-[2%] top-[-6%] h-[26rem] w-[30rem] rounded-[48%_52%_42%_58%] bg-green-wash" />
          <div className="absolute right-[7%] top-[24%] h-[23rem] w-[25rem] rounded-[44%_56%_52%_48%] bg-green/25" />
        </div>

        {/* The student spans the whole hero and overlaps the card */}
        <div className="pointer-events-none absolute bottom-0 right-4 z-20 hidden lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/photos/hero-cutout.webp"
            alt="A Stormm student pointing, holding a phone"
            className="h-[39rem] w-auto object-contain object-bottom xl:h-[41rem]"
          />
        </div>

        <div className="relative lg:min-h-[41rem]">
          <Reveal>
            <div className="relative z-10 overflow-hidden rounded-[2.5rem] bg-forest px-7 py-10 text-paper sm:px-12 sm:py-14 lg:min-h-[32rem] lg:w-[57%]">
              <span className="inline-flex items-center gap-2 rounded-full bg-green/25 px-4 py-2 text-[0.8125rem] font-bold text-green-bright">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" fill="currentColor" />
                </svg>
                Earn • Refer • Grow
              </span>

              <h1 className="font-display mt-7 max-w-[13ch] text-[clamp(2.25rem,4vw,3.4rem)] leading-[1.08]">
                Are you a student looking to{" "}
                <span className="relative inline-block text-green-bright">
                  earn
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 160 18"
                    className="absolute -bottom-1.5 left-0 w-full"
                    fill="none"
                  >
                    <path
                      d="M4 11c26-6 92-10 152-4"
                      stroke="var(--color-green-bright)"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                on the side?
              </h1>

              <p className="mt-9 max-w-sm text-[1.0625rem] leading-relaxed text-paper/80">
                Stormm helps you turn your network into{" "}
                <span className="font-bold text-green-bright">real money</span> — through
                simple referrals.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Link
                  href="/join"
                  className="inline-flex items-center gap-2.5 rounded-full bg-paper px-7 py-4 text-[1.0625rem] font-extrabold text-forest transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Start Earning Now
                  <span aria-hidden="true">→</span>
                </Link>

                <Link href="/how-it-works" className="group inline-flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-paper/35 transition-colors group-hover:border-paper">
                    <svg width="13" height="15" viewBox="0 0 13 15" fill="none" aria-hidden="true">
                      <path d="M12 7.5 0.5 14.4V0.6L12 7.5Z" fill="currentColor" />
                    </svg>
                  </span>
                  <span className="font-bold">Watch How It Works</span>
                </Link>
              </div>
            </div>
          </Reveal>

          <Doodles />

          <div className="absolute -right-2 top-[5.5rem] z-30 hidden w-[19rem] flex-col gap-3 lg:flex">
            <Reveal delay={200}>
              <p className="font-script -mb-0.5 rotate-[-5deg] pr-2 text-right text-[1.875rem] leading-tight text-forest">
                Three Ways
                <br />
                to Earn!
                <svg
                  viewBox="0 0 150 10"
                  className="ml-auto mt-1 block w-32"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 7c26-5 96-7 146-2"
                    stroke="var(--color-green)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </p>
            </Reveal>

            {cards.map((o, i) => (
              <Reveal key={o.slug} delay={260 + i * 90}>
                <OpportunityPill opportunity={o} index={i} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Mobile: figure then cards, in flow */}
        <div className="lg:hidden">
          <div className="relative mt-8 flex justify-center">
            <div
              aria-hidden="true"
              className="absolute bottom-0 h-[82%] w-[88%] rounded-[46%_54%_44%_56%] bg-green-wash"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/hero-cutout.webp"
              alt="A Stormm student pointing, holding a phone"
              className="relative h-[22rem] w-auto object-contain"
            />
          </div>

          <p className="font-script mt-6 rotate-[-3deg] text-center text-[1.75rem] text-forest">
            Three Ways to Earn!
          </p>
          <div className="mt-4 grid gap-3">
            {cards.map((o, i) => (
              <OpportunityPill key={o.slug} opportunity={o} index={i} flat />
            ))}
          </div>
        </div>

        <Reveal delay={320}>
          <ul className="relative z-30 mt-6 grid gap-px overflow-hidden rounded-[1.75rem] bg-ink/10 shadow-[0_18px_50px_-34px_rgba(18,32,26,0.6)] sm:grid-cols-3 lg:mt-[-1.75rem] lg:w-[57%]">
            {TRUST.map((item) => (
              <li key={item.label} className="flex items-center gap-3.5 bg-cream px-6 py-5">
                <span className="shrink-0 text-forest">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    {item.icon}
                  </svg>
                </span>
                <span className="whitespace-pre-line text-[0.875rem] font-bold leading-snug text-ink">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
