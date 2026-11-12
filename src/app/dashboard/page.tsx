import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { OPPORTUNITY_ICONS } from "@/components/opportunity-icons";
import { ReferralLinkPanel } from "@/components/referral-link";
import { FinePrint } from "@/components/ui";
import { getDashboardData, type ReferralRow } from "@/lib/dashboard-data";
import { getLiveOpportunities } from "@/lib/opportunities-data";
import { formatUsd } from "@/lib/money";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

const DAY = 24 * 60 * 60 * 1000;

/**
 * A month-on-month change, or null when it cannot honestly be stated.
 *
 * Going from nothing to something is not a percentage, and neither is a
 * window with no history behind it. In those cases the caller shows no badge
 * rather than a number that reads as growth.
 */
function trend(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

function inWindow(iso: string, from: number, to: number): boolean {
  const t = new Date(iso).getTime();
  return t >= from && t < to;
}

export default async function DashboardHomePage() {
  const supabase = await getSupabaseServerClient();

  async function loadName(): Promise<string> {
    if (!supabase) return "";
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return "";
    const { data: row } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();
    return row?.full_name ?? "";
  }

  const [data, allOpportunities, fullName] = await Promise.all([
    getDashboardData(),
    getLiveOpportunities(),
    loadName(),
  ]);

  const { totals, joined, referrals, earnings } = data;
  const firstName = fullName.split(" ")[0] || "there";

  const joinedBySlug = new Map(joined.map((j) => [j.slug, j]));
  const linked = joined.find((j) => j.referralCode) ?? null;

  const goal =
    joined.find((j) => j.target !== null && j.approvedCount < j.target) ??
    joined.find((j) => j.target !== null) ??
    null;

  const recent = referrals.slice(0, 3);

  // Real month-on-month movement, from the dates already in the ledger.
  const now = Date.now();
  const counted = (r: ReferralRow) => r.stage === "approved" || r.stage === "paid";
  const referralTrend = trend(
    referrals.filter((r) => counted(r) && inWindow(r.createdAt, now - 30 * DAY, now)).length,
    referrals.filter((r) => counted(r) && inWindow(r.createdAt, now - 60 * DAY, now - 30 * DAY)).length,
  );
  const paidIn = (from: number, to: number) =>
    earnings
      .filter((e) => inWindow(e.createdAt, from, to))
      .reduce((sum, e) => sum + e.amountUsd, 0);
  const earningsTrend = trend(paidIn(now - 30 * DAY, now), paidIn(now - 60 * DAY, now - 30 * DAY));

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[1.5rem] bg-forest text-[color:var(--on-dark-1)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] md:block">
          <div className="absolute inset-y-0 right-0 w-full rounded-l-[12rem] bg-green-wash" />
          <div className="absolute right-[30%] top-[10%] h-[80%] w-[46%] rounded-full bg-green/25" />
        </div>

        <div className="relative flex items-center gap-6 px-7 py-8 sm:px-9">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight">
              Welcome back, {firstName}! <span aria-hidden="true">&#128075;</span>
            </h1>
            <p className="mt-2.5 text-[1.05rem] leading-snug text-[color:var(--on-dark-2)]">
              Turn your network into <span className="font-bold text-green">real money</span>.
              <br />
              <span className="font-bold text-green">Refer. Earn. Grow.</span>
            </p>
            <Link
              href="/dashboard/opportunities"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 font-bold text-forest-deep transition-transform hover:scale-[1.03]"
            >
              Explore opportunities
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="relative hidden h-[11rem] w-[22rem] shrink-0 items-end justify-end self-stretch lg:flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/hero-cutout.webp"
              alt=""
              aria-hidden="true"
              className="absolute bottom-[-2rem] right-[7rem] h-[15rem] w-auto max-w-none object-contain object-bottom"
            />
            <p className="font-script relative z-10 mb-6 -rotate-3 text-right text-[1.9rem] leading-[1.1] text-forest">
              Refer.
              <br />
              Earn.
              <span className="mt-1 block h-[3px] w-28 rounded-full bg-green" />
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          tint="bg-green-wash"
          icon={<PeopleIcon />}
          value={String(totals.approvedReferrals)}
          label="Successful referrals"
          delta={referralTrend}
        />
        <Stat
          tint="bg-green-wash"
          icon={<WalletIcon />}
          value={formatUsd(totals.approvedUsd)}
          label="Total earnings"
          delta={earningsTrend}
          money
        />
        <Stat
          tint="bg-forest text-[color:var(--on-dark-1)]"
          icon={<ClockIcon />}
          value={formatUsd(totals.pendingUsd)}
          label="Pending earnings"
          hint="Approved and yours, not yet transferred"
          money
        />
        {goal && goal.target !== null ? (
          <Stat
            tint="bg-cream-deep"
            icon={<TrophyIcon />}
            value={`${goal.approvedCount}/${goal.target}`}
            label="Referral goal"
            bar={{ value: goal.approvedCount, max: goal.target }}
          />
        ) : (
          <Stat
            tint="bg-cream-deep"
            icon={<TrophyIcon />}
            value="&mdash;"
            label="Referral goal"
            hint="Join an opportunity to get a target"
          />
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="space-y-5">
          <section className="rounded-[1.4rem] border border-[color:var(--hair)] bg-paper p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display flex items-center gap-2.5 text-[1.3rem]">
                <RocketIcon />
                Earning opportunities
              </h2>
              <Link
                href="/dashboard/opportunities"
                className="shrink-0 text-caption font-bold text-forest hover:underline"
              >
                View all &rarr;
              </Link>
            </div>

            <ul className="mt-5 space-y-3">
              {allOpportunities.map((o) => {
                const tint = OPPORTUNITY_ICONS[o.slug] ?? OPPORTUNITY_ICONS["software-referrals"];
                const mine = joinedBySlug.get(o.slug);
                return (
                  <li key={o.slug} className="flex flex-wrap items-center gap-4">
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tint.bg}`}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        {tint.icon}
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">{o.name}</p>
                      <p className="truncate text-caption text-[color:var(--ink-3)]">
                        {mine
                          ? `${mine.approvedCount} approved so far`
                          : `Earn ${formatUsd(o.headline)} for each approved referral.`}
                      </p>
                    </div>
                    <span className="money shrink-0 rounded-full bg-green-wash px-4 py-2 text-[1rem] font-bold text-forest">
                      {formatUsd(o.headline)}
                    </span>
                    <Link
                      href="/dashboard/opportunities"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-forest px-5 py-2.5 text-caption font-bold text-[color:var(--on-dark-1)] transition-colors hover:bg-forest-deep"
                    >
                      {mine ? "Get link" : "Join"}
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="relative overflow-hidden rounded-[1.4rem] bg-green-wash p-6">
            <div className="relative z-10 pr-24 sm:pr-32">
              <h2 className="font-display flex items-center gap-2.5 text-[1.3rem]">
                <BarsIcon />
                Your progress
              </h2>
              {goal && goal.target !== null ? (
                <>
                  <p className="mt-2 text-[color:var(--ink-2)]">
                    {goal.approvedCount >= goal.target
                      ? `You have met the target on ${goal.name}.`
                      : `Reach ${goal.target} approved referrals on ${goal.name} to unlock the reward.`}
                  </p>
                  <div className="mt-5 flex items-center gap-4">
                    <ProgressBar value={goal.approvedCount} max={goal.target} />
                    <span className="money shrink-0 text-[1.05rem] font-bold">
                      {goal.approvedCount} / {goal.target}
                    </span>
                  </div>
                </>
              ) : (
                <p className="mt-2 text-[color:var(--ink-2)]">
                  Join an opportunity and its target appears here, with your progress
                  against it.
                </p>
              )}
            </div>
            <GiftArt />
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-[1.4rem] bg-forest p-6 text-[color:var(--on-dark-1)]">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-green text-forest-deep">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M10 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M14 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-[1.3rem] leading-tight">Your referral link</h2>
                <p className="text-caption text-[color:var(--on-dark-2)]">
                  {linked
                    ? "Share it and every sign-up through it is attributed to you."
                    : "You get one the moment you join an opportunity."}
                </p>
              </div>
            </div>

            <div className="mt-5">
              {linked?.referralCode ? (
                <ReferralLinkPanel code={linked.referralCode} />
              ) : (
                <Link
                  href="/dashboard/opportunities"
                  className="inline-flex rounded-full bg-paper px-5 py-3 font-bold text-forest-deep transition-transform hover:scale-[1.03]"
                >
                  Join an opportunity
                </Link>
              )}
            </div>
          </section>

          <section className="rounded-[1.4rem] border border-[color:var(--hair)] bg-paper p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display flex items-center gap-2.5 text-[1.3rem]">
                <ClockRing />
                Recent activity
              </h2>
              <Link
                href="/dashboard/referrals"
                className="shrink-0 text-caption font-bold text-forest hover:underline"
              >
                View all &rarr;
              </Link>
            </div>

            {recent.length === 0 ? (
              <p className="mt-5 text-[color:var(--ink-2)]">
                Nothing yet. The first click on your link shows up here.
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {recent.map((r) => (
                  <li key={r.id} className="flex items-start gap-3">
                    <StageDot stage={r.stage} />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{STAGE_HEADLINE[r.stage]}</p>
                      <p className="truncate text-caption text-[color:var(--ink-3)]">
                        {r.label} &middot; {r.opportunityName}
                      </p>
                    </div>
                    <span className="shrink-0 text-caption text-[color:var(--ink-3)]">
                      {timeAgo(r.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5">
              <FinePrint>
                A referral only moves your figures once it has been approved.
              </FinePrint>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/** What each stage is called when it is read as an event rather than a status. */
const STAGE_HEADLINE: Record<string, string> = {
  clicked: "Link clicked",
  registered: "Referral registered",
  pending_verification: "Referral pending",
  approved: "Referral approved",
  rejected: "Referral rejected",
  paid: "Earnings credited",
};

function Stat({
  icon,
  tint,
  value,
  label,
  delta,
  hint,
  bar,
  money = false,
}: {
  icon: ReactNode;
  tint: string;
  value: string;
  label: string;
  delta?: number | null;
  hint?: string;
  bar?: { value: number; max: number };
  money?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-[1.25rem] border border-[color:var(--hair)] bg-paper p-5">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-forest ${tint}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {icon}
        </svg>
      </span>

      <div className="min-w-0 flex-1">
        <p className={`money text-[1.6rem] leading-none ${money ? "text-money" : ""}`}>{value}</p>
        <p className="mt-1.5 text-caption font-bold text-[color:var(--ink-3)]">{label}</p>
        {bar && (
          <div className="mt-2">
            <ProgressBar value={bar.value} max={bar.max} />
          </div>
        )}
        {hint && !bar && (
          <p className="mt-1 text-micro text-[color:var(--ink-3)]">{hint}</p>
        )}
      </div>

      {typeof delta === "number" && (
        <span
          title="Against the thirty days before"
          className={`shrink-0 self-start rounded-full px-2.5 py-1 text-micro font-bold ${
            delta >= 0
              ? "bg-success/15 text-[color:var(--color-success)]"
              : "bg-error/10 text-[color:var(--color-error)]"
          }`}
        >
          {delta >= 0 ? "↑" : "↓"} {delta >= 0 ? "+" : ""}
          {delta}%
        </span>
      )}
    </div>
  );
}

function StageDot({ stage }: { stage: string }) {
  const done = stage === "approved" || stage === "paid";
  const bad = stage === "rejected";
  const tone = done
    ? "bg-success/15 text-[color:var(--color-success)]"
    : bad
      ? "bg-error/10 text-[color:var(--color-error)]"
      : "bg-green-wash text-forest";
  return (
    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${tone}`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {done ? (
          <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        ) : bad ? (
          <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        ) : (
          <>
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v4.3l2.8 1.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
      </svg>
    </span>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`${value} of ${max} approved referrals`}
      className="h-2.5 w-full overflow-hidden rounded-full bg-[color:var(--hair)]"
    >
      <div className="h-full rounded-full bg-green" style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Server-rendered, so "now" is the moment this page was built for this reader. */
function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

function PeopleIcon() {
  return (
    <>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="2" />
      <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 5.6a3.2 3.2 0 0 1 0 6.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M17.5 14.9c2 .5 3.4 2.2 3.9 4.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function WalletIcon() {
  return (
    <>
      <path d="M3.5 8.5h13a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M3.5 8.5v-2a2 2 0 0 1 2-2h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="15" cy="14" r="1.3" fill="currentColor" />
    </>
  );
}

function ClockIcon() {
  return (
    <>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5.2l3.2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

function TrophyIcon() {
  return (
    <>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M7 6H5a2 2 0 0 0 2 3M17 6h2a2 2 0 0 1-2 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9.5 13.5 9 20h6l-.5-6.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </>
  );
}

function RocketIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-green">
      <path d="M13.5 3c4 1.2 6.4 4.4 7.5 9-4.6 1.1-7.8 3.5-9 7.5-2.6-1-4.4-2.8-5.4-5.4C10.1 10.8 12.5 7.6 13.5 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="14.5" cy="9.5" r="1.9" stroke="currentColor" strokeWidth="2" />
      <path d="M6.5 17.5 3 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BarsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-forest">
      <path d="M5 20V12M12 20V5M19 20v-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function ClockRing() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-forest">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5.2l3.2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The parcel in the corner of the progress card. Decorative only. */
function GiftArt() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className="pointer-events-none absolute bottom-3 right-4 h-24 w-24 sm:h-28 sm:w-28"
    >
      <g stroke="var(--color-forest)" strokeWidth="4" fill="none" strokeLinejoin="round">
        <rect x="22" y="52" width="76" height="52" rx="7" fill="var(--color-green)" />
        <path d="M18 52h84M60 52v52" />
        <path d="M60 52s-6-24-18-24a10 10 0 0 0 0 20M60 52s6-24 18-24a10 10 0 0 1 0 20" fill="var(--color-green-bright)" />
      </g>
      <g stroke="var(--color-green)" strokeWidth="4" strokeLinecap="round">
        <path d="M14 34 8 28M30 20l-2-8M48 16l2-8M94 30l8-6M104 46l8-2" />
      </g>
    </svg>
  );
}
