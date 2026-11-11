import Link from "next/link";
import { Figure } from "@/components/figure";
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

export function Hero({ opportunities }: { opportunities: Opportunity[] }) {
  return (
    <section className="relative overflow-hidden pb-6">
      {/* Soft organic wash behind the photograph */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 hidden h-[36rem] w-[52%] lg:block"
      >
        <div className="absolute right-[-8%] top-[-12%] h-[34rem] w-[34rem] rounded-full bg-green-wash/70" />
        <div className="absolute right-[14%] top-[18%] h-[22rem] w-[26rem] rounded-[46%_54%_44%_56%] bg-green/20" />
      </div>

      <div className="relative mx-auto w-full max-w-[86rem] px-5 pt-4 sm:px-8">
        <div className="grid items-stretch gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-[2.25rem] bg-forest px-7 py-10 text-paper sm:px-12 sm:py-14">
              <span className="inline-flex items-center gap-2 rounded-full bg-green/25 px-4 py-2 text-[0.8125rem] font-bold text-green-bright">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" fill="currentColor" />
                </svg>
                Earn • Refer • Grow
              </span>

              <h1 className="font-display mt-7 text-[clamp(2.25rem,4.4vw,3.6rem)] leading-[1.06]">
                Are you a student looking to{" "}
                <span className="relative inline-block text-green-bright">
                  earn
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 160 18"
                    className="absolute -bottom-2 left-0 w-full"
                    fill="none"
                  >
                    <path
                      d="M3 12c26-7 94-11 154-5"
                      stroke="var(--color-green-bright)"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                on the side?
              </h1>

              <p className="mt-9 max-w-md text-[1.0625rem] leading-relaxed text-paper/80 sm:text-lead">
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

          <div className="relative">
            <Reveal delay={120}>
              <div className="relative mx-auto h-full max-w-md lg:max-w-none">
                <Figure
                  src="/photos/hero-student-1.jpg"
                  alt="A student holding a phone"
                  brief="Cut-out student, hoodie, pointing, holding a phone"
                  ratio="4/5"
                  rounded="xl"
                  priority
                  className="lg:h-full"
                />
              </div>
            </Reveal>

            <div className="pointer-events-none absolute -right-1 top-6 hidden w-[19rem] flex-col gap-3 lg:flex">
              <Reveal delay={200}>
                <p className="font-script -mb-1 rotate-[-4deg] text-right text-[1.75rem] text-forest">
                  Three Ways to Earn!
                  <svg
                    viewBox="0 0 140 10"
                    className="ml-auto mt-0.5 block w-36"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 7c24-5 90-7 136-2"
                      stroke="var(--color-green)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </p>
              </Reveal>

              {opportunities.slice(0, 3).map((o, i) => {
                const tint = TINTS[o.slug] ?? TINTS["software-referrals"];
                return (
                  <Reveal key={o.slug} delay={260 + i * 90}>
                    <Link
                      href={`/opportunities/${o.slug}`}
                      className="pointer-events-auto flex items-center gap-3.5 rounded-2xl bg-paper p-3.5 shadow-[0_18px_44px_-26px_rgba(18,32,26,0.65)] ring-1 ring-ink/5 transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] hover:-translate-y-1"
                      style={{ transform: `rotate(${i % 2 === 0 ? -1.4 : 1.2}deg)` }}
                    >
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tint.bg}`}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          {tint.icon}
                        </svg>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.9375rem] font-extrabold leading-tight text-ink">
                          {o.name}
                        </span>
                        <span className="mt-0.5 block text-[0.75rem] leading-snug text-moss">
                          {shortLine(o.slug)}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-forest text-[0.75rem] text-paper"
                      >
                        →
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>

        <Reveal delay={320}>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-[1.75rem] bg-ink/10 sm:grid-cols-3">
            {TRUST.map((item) => (
              <li key={item.label} className="flex items-center gap-3.5 bg-cream px-6 py-5 sm:px-8">
                <span className="shrink-0 text-forest">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    {item.icon}
                  </svg>
                </span>
                <span className="whitespace-pre-line text-[0.9375rem] font-bold leading-snug text-ink">
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
