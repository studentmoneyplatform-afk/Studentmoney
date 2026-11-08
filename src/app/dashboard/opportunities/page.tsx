import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, Panel } from "@/components/dashboard-ui";
import { JoinButton } from "@/components/join-button";
import { Money } from "@/components/money";
import { OpportunityProgress } from "@/components/opportunity-progress";
import { ReferralLink } from "@/components/referral-link";
import { Chip, FinePrint } from "@/components/ui";
import { getDashboardData } from "@/lib/dashboard-data";
import { getLiveOpportunities, rewardLine } from "@/lib/opportunities-data";

export const metadata: Metadata = { title: "My opportunities" };

export default async function MyOpportunitiesPage() {
  const [data, allOpportunities] = await Promise.all([
    getDashboardData(),
    getLiveOpportunities(),
  ]);

  const joinedSlugs = new Set(data.joined.map((j) => j.slug));
  const available = allOpportunities.filter((o) => !joinedSlugs.has(o.slug));

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-h3">Joined</h2>

        {data.joined.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              title="Nothing joined yet"
              body="Join an opportunity below and you get a tracking link immediately. Progress shows here, including the stages before anything is owed."
            />
          </div>
        ) : (
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {data.joined.map((j) => (
              <div
                key={j.participationId}
                className="rounded-[var(--radius-xl)] border border-[color:var(--hair)] bg-paper p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-display text-h3 leading-tight">{j.name}</h3>
                    <p className="mt-1 text-caption text-[color:var(--ink-3)]">{j.partner}</p>
                  </div>
                  <Chip>Active</Chip>
                </div>

                <p className="mt-4 text-caption font-bold text-forest">
                  {rewardLine(j.reward)}
                </p>

                <div className="mt-6 border-t border-[color:var(--hair)] pt-5">
                  <OpportunityProgress
                    reward={j.reward}
                    approved={j.approvedCount}
                    pending={j.pendingCount}
                    earned={j.earnedUsd}
                  />
                </div>

                <div className="mt-6 border-t border-[color:var(--hair)] pt-5">
                  <p className="text-micro font-bold uppercase tracking-widest text-[color:var(--ink-3)]">
                    Your tracking code
                  </p>
                  <div className="mt-3">
                    {j.referralCode ? (
                      <ReferralLink code={j.referralCode} />
                    ) : (
                      <FinePrint>
                        No code issued yet. Refresh, and tell us if it does not appear.
                      </FinePrint>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <Link
                    href={`/opportunities/${j.slug}`}
                    className="text-caption font-bold text-forest underline underline-offset-4"
                  >
                    Read the full rules
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {available.length > 0 && (
        <Panel title="Open to join">
          <ul className="divide-y divide-[color:var(--hair)]">
            {available.map((o) => (
              <li key={o.slug} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-display text-[1.25rem]">{o.name}</p>
                    <p className="mt-1 text-caption text-[color:var(--ink-3)]">{o.partner}</p>
                    <p className="mt-2 max-w-xl text-[color:var(--ink-2)]">{o.summary}</p>
                    <p className="mt-3 text-caption font-bold text-forest">
                      {rewardLine(o.reward)}
                    </p>
                  </div>
                  <Money usd={o.headline} size="sm" tone="earned" showNgn={false} />
                </div>
                <div className="mt-4">
                  <JoinButton slug={o.slug} />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <FinePrint>
              Joining is free and you can run all three at once. Progress on one never
              cancels another.
            </FinePrint>
          </div>
        </Panel>
      )}
    </div>
  );
}
