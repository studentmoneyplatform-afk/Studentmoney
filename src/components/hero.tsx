import Link from "next/link";
import { OPPORTUNITY_ICONS } from "@/components/opportunity-icons";
import { Parallax } from "@/components/motion";
import type { Opportunity } from "@/lib/opportunities";

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
  const tint = OPPORTUNITY_ICONS[opportunity.slug] ?? OPPORTUNITY_ICONS["software-referrals"];
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

/**
 * The hero is a fixed stage on large screens with each element placed at a
 * percentage of it, because the composition is an overlap: the figure
 * crosses the card, a cream curve scoops the card's top-right around his
 * head, and the trust bar sits over the card's lower edge. Flow layout
 * cannot express that. Below lg it unstacks into ordinary blocks.
 */
export function Hero({ opportunities }: { opportunities: Opportunity[] }) {
  const cards = opportunities.slice(0, 3);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-[82rem] px-5 sm:px-8">
        {/* ── Large screens: the placed composition ─────────── */}
        <div className="relative hidden h-[34rem] lg:block xl:h-[38rem]">
          {/* Layered green shapes behind the figure */}
          <div aria-hidden="true" className="absolute inset-0">
            {/* Pale mint behind the head, then a stronger green form behind
                his torso, which is what gives the figure something to stand
                against rather than floating on cream. */}
            <div className="absolute right-[1%] top-[2%] h-[72%] w-[44%] rounded-[46%_54%_40%_60%] bg-green-wash" />
            <div className="absolute right-[4%] top-[16%] h-[80%] w-[34%] rounded-[52%_48%_42%_58%] bg-green/45" />
            <div className="absolute right-[17%] bottom-[-10%] h-[58%] w-[30%] rounded-[48%_52%_58%_42%] bg-green/30" />
            <div className="absolute right-[26%] top-[30%] h-[46%] w-[18%] rounded-[56%_44%_48%_52%] bg-forest/15" />
          </div>

          {/* The green card */}
          <div className="absolute left-0 top-0 z-10 h-[84%] w-[52.5%] overflow-hidden rounded-[2.75rem] bg-forest px-10 py-9 text-paper xl:px-12 xl:py-11">
            <span className="inline-flex items-center gap-2 rounded-full bg-green/25 px-4 py-2 text-[0.8125rem] font-bold text-green-bright">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" fill="currentColor" />
              </svg>
              Earn • Refer • Grow
            </span>

            <h1 className="font-display mt-6 max-w-[17ch] text-[clamp(2.4rem,3.9vw,3.4rem)] leading-[1.1]">
              Student, graduate or freelancer looking to{" "}
              <span className="relative inline-block text-green-bright">
                earn
                <svg
                  aria-hidden="true"
                  viewBox="0 0 190 20"
                  className="absolute -bottom-2 left-0 w-[128%]"
                  fill="none"
                >
                  <path
                    d="M4 13C40 5 128 2 186 9"
                    stroke="var(--color-green-bright)"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              on the side?
            </h1>

            <p className="mt-7 max-w-[26rem] text-[1.0625rem] leading-relaxed text-paper/85">
              Stormm helps you turn your network into{" "}
              <span className="font-bold text-green-bright">real money</span> — through
              simple referrals.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                href="/join"
                className="inline-flex items-center gap-2.5 rounded-full bg-paper px-7 py-3.5 text-[1.0625rem] font-extrabold text-forest transition-transform duration-200 hover:-translate-y-0.5"
              >
                Start Earning Now
                <span aria-hidden="true">→</span>
              </Link>

              <Link href="/how-it-works" className="group inline-flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-paper/40 transition-colors group-hover:border-paper">
                  <svg width="12" height="14" viewBox="0 0 13 15" fill="none" aria-hidden="true">
                    <path d="M12 7.5 0.5 14.4V0.6L12 7.5Z" fill="currentColor" />
                  </svg>
                </span>
                <span className="font-bold">Watch How It Works</span>
              </Link>
            </div>
          </div>

          {/* Cream curve scooping the card's top-right, around his head */}
          <div
            aria-hidden="true"
            className="absolute left-[46%] top-[-12%] z-20 h-[60%] w-[25%] rounded-[50%] bg-paper"
          />

          {/* The figure, crossing the card */}
          <Parallax
            strength={34}
            innerClassName="h-full"
            className="pointer-events-none absolute bottom-0 left-[43%] z-30 h-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/hero-cutout.webp"
              alt="A Stormm student pointing, holding a phone"
              className="h-[106%] w-auto max-w-none object-contain object-bottom"
            />
          </Parallax>

          <Doodles />

          {/* Script label and the three cards */}
          <Parallax
            strength={-30}
            className="absolute right-0 top-[1%] z-40 w-[17.5rem]"
          >
            <p className="font-script rotate-[-4deg] pl-6 text-[2rem] leading-[1.05] text-forest">
              Three Ways
              <br />
              to Earn!
              <svg viewBox="0 0 160 10" className="mt-1 block w-40" fill="none" aria-hidden="true">
                <path
                  d="M2 7c28-5 104-7 156-2"
                  stroke="var(--color-green)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </p>

            <div className="mt-4 flex flex-col gap-3.5">
              {cards.map((o, i) => (
                <OpportunityPill key={o.slug} opportunity={o} index={i} />
              ))}
            </div>
          </Parallax>

          {/* Trust bar, overlapping the card's lower edge */}
          <ul className="absolute bottom-0 left-0 z-40 grid w-[54%] grid-cols-3 gap-px overflow-hidden rounded-[1.5rem] bg-ink/10 shadow-[0_20px_50px_-32px_rgba(18,32,26,0.65)]">
            {TRUST.map((item) => (
              <li key={item.label} className="flex items-center gap-3 bg-cream px-5 py-4">
                <span className="shrink-0 text-forest">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    {item.icon}
                  </svg>
                </span>
                <span className="whitespace-pre-line text-[0.8125rem] font-bold leading-snug text-ink">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Small screens: the same parts, unstacked ──────── */}
        <div className="lg:hidden">
          <div className="overflow-hidden rounded-[2rem] bg-forest px-7 py-9 text-paper">
            <span className="inline-flex items-center gap-2 rounded-full bg-green/25 px-4 py-2 text-[0.8125rem] font-bold text-green-bright">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" fill="currentColor" />
              </svg>
              Earn • Refer • Grow
            </span>

            <h1 className="font-display mt-6 text-[clamp(2rem,7.5vw,2.75rem)] leading-[1.1]">
              Student, graduate or freelancer looking to{" "}
              <span className="text-green-bright underline decoration-[6px] underline-offset-[6px]">
                earn
              </span>{" "}
              on the side?
            </h1>

            <p className="mt-6 text-[1.0625rem] leading-relaxed text-paper/85">
              Stormm helps you turn your network into{" "}
              <span className="font-bold text-green-bright">real money</span> — through
              simple referrals.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <Link
                href="/join"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-paper px-7 py-3.5 font-extrabold text-forest"
              >
                Start Earning Now
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/how-it-works" className="inline-flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-paper/40">
                  <svg width="12" height="14" viewBox="0 0 13 15" fill="none" aria-hidden="true">
                    <path d="M12 7.5 0.5 14.4V0.6L12 7.5Z" fill="currentColor" />
                  </svg>
                </span>
                <span className="font-bold">Watch How It Works</span>
              </Link>
            </div>
          </div>

          <div className="relative mt-6 flex justify-center">
            <div
              aria-hidden="true"
              className="absolute bottom-0 h-[86%] w-[92%] rounded-[46%_54%_44%_56%] bg-green-wash"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/hero-cutout.webp"
              alt="A Stormm student pointing, holding a phone"
              className="relative h-[20rem] w-auto object-contain"
            />
          </div>

          <p className="font-script mt-5 rotate-[-3deg] text-center text-[1.875rem] text-forest">
            Three Ways to Earn!
          </p>

          <div className="mt-5 grid gap-3">
            {cards.map((o, i) => (
              <OpportunityPill key={o.slug} opportunity={o} index={i} flat />
            ))}
          </div>

          <ul className="mt-7 grid gap-px overflow-hidden rounded-[1.5rem] bg-ink/10 sm:grid-cols-3">
            {TRUST.map((item) => (
              <li key={item.label} className="flex items-center gap-3 bg-cream px-5 py-4">
                <span className="shrink-0 text-forest">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    {item.icon}
                  </svg>
                </span>
                <span className="whitespace-pre-line text-[0.875rem] font-bold leading-snug text-ink">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
