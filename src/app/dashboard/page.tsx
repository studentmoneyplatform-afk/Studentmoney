import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, Panel, StageBadge, StatTile } from "@/components/dashboard-ui";
import { Money } from "@/components/money";
import { FinePrint } from "@/components/ui";
import { getDashboardData } from "@/lib/dashboard-data";
import { getLiveOpportunities } from "@/lib/opportunities-data";
import { formatUsd } from "@/lib/money";

export const metadata: Metadata = { title: "Overview" };

export default async function DashboardOverviewPage() {
  const [data, allOpportunities] = await Promise.all([
    getDashboardData(),
    getLiveOpportunities(),
  ]);

  const { totals, joined, referrals } = data;
  const joinedSlugs = new Set(joined.map((j) => j.slug));
  const available = allOpportunities.filter((o) => !joinedSlugs.has(o.slug));
  const recent = referrals.slice(0, 6);

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Approved earnings"
          usd={totals.approvedUsd}
          hint="From referrals we have verified"
        />
        <StatTile
          label="Awaiting payout"
          usd={totals.pendingUsd}
          hint="Earned, not yet paid out"
        />
        <StatTile
          label="Approved referrals"
          count={totals.approvedReferrals}
          hint={`${totals.pendingReferrals} still being verified`}
        />
        <StatTile
          label="Active opportunities"
          count={joined.length}
          hint={`${available.length} more you can join`}
        />
      </div>

      {joined.length === 0 ? (
        <EmptyState
          title="You have not joined an opportunity yet"
          body="Pick one and you will get a tracking link straight away. Your progress appears here from the first click — including the stages before anything is owed."
          action={{ href: "/dashboard/opportunities", label: "See what is open" }}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Panel title="Recent referral activity">
            {recent.length === 0 ? (
              <p className="text-[color:var(--ink-2)]">
                Nothing yet. Share your link and the first click shows up here.
              </p>
            ) : (
              <ul className="divide-y divide-[color:var(--hair)]">
                {recent.map((r) => (
                  <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate font-bold">{r.label}</p>
                      <p className="text-caption text-[color:var(--ink-3)]">
                        {r.opportunityName} · {formatDate(r.createdAt)}
                      </p>
                    </div>
                    <StageBadge stage={r.stage} />
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5">
              <Link
                href="/dashboard/referrals"
                className="font-bold text-forest underline underline-offset-4"
              >
                See all referrals
              </Link>
            </div>
          </Panel>

          <Panel title="Where your money stands">
            <dl className="space-y-4">
              {[
                ["Approved", totals.approvedUsd, "Verified and counted"],
                ["Paid out", totals.paidUsd, "Already sent to you"],
                ["Awaiting payout", totals.pendingUsd, "Yours, not yet transferred"],
              ].map(([label, value, hint]) => (
                <div
                  key={label as string}
                  className="flex items-start justify-between gap-4 border-b border-[color:var(--hair)] pb-4 last:border-0"
                >
                  <div>
                    <dt className="font-bold">{label as string}</dt>
                    <dd className="text-caption text-[color:var(--ink-3)]">{hint as string}</dd>
                  </div>
                  <span className="money text-[1.25rem] text-money">
                    {formatUsd(value as number)}
                  </span>
                </div>
              ))}
            </dl>
            <div className="mt-5">
              <FinePrint>
                A referral only moves these figures once it has been approved. Payouts
                are requested from My earnings.
              </FinePrint>
            </div>
          </Panel>
        </div>
      )}

      {available.length > 0 && (
        <Panel title="Opportunities you have not joined">
          <ul className="divide-y divide-[color:var(--hair)]">
            {available.map((o) => (
              <li key={o.slug} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-bold">{o.name}</p>
                  <p className="text-caption text-[color:var(--ink-3)]">{o.partner}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Money usd={o.headline} size="sm" tone="earned" showNgn={false} />
                  <Link
                    href="/dashboard/opportunities"
                    className="rounded-full bg-forest px-4 py-2 text-caption font-bold text-[color:var(--on-dark-1)] transition-colors hover:bg-forest-deep"
                  >
                    Join
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
