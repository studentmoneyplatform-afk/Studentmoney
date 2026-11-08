import type { Metadata } from "next";
import { EmptyState, Panel, StatTile } from "@/components/dashboard-ui";
import { Money } from "@/components/money";
import { FinePrint } from "@/components/ui";
import { getDashboardData } from "@/lib/dashboard-data";
import { formatUsd } from "@/lib/money";

export const metadata: Metadata = { title: "My earnings" };

export default async function MyEarningsPage() {
  const { totals, joined, earnings } = await getDashboardData();

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile
          label="Approved"
          usd={totals.approvedUsd}
          hint="Verified and counted"
        />
        <StatTile label="Paid out" usd={totals.paidUsd} hint="Already sent to you" />
        <StatTile
          label="Awaiting payout"
          usd={totals.pendingUsd}
          hint="Yours, not yet transferred"
        />
      </div>

      {joined.length > 0 && (
        <Panel title="By opportunity">
          <ul className="divide-y divide-[color:var(--hair)]">
            {joined.map((j) => (
              <li key={j.participationId} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-bold">{j.name}</p>
                  <p className="text-caption text-[color:var(--ink-3)]">
                    {j.approvedCount} approved
                    {j.target ? ` of ${j.target}` : ""}
                    {j.pendingCount > 0 ? ` · ${j.pendingCount} being verified` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <Money usd={j.earnedUsd} size="sm" tone="earned" showNgn={false} />
                  <p className="text-caption text-[color:var(--ink-3)]">
                    {formatUsd(j.paidUsd)} paid
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel title="Payment history">
        {earnings.length === 0 ? (
          <div className="py-2">
            <p className="text-[color:var(--ink-2)]">
              No payments yet. Once a payout is recorded against your account it shows
              here with its reference and date.
            </p>
            <div className="mt-4">
              <FinePrint>
                Withdrawals open once the payout process is live. We are not putting a
                button here that would not actually move money.
              </FinePrint>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-[color:var(--hair)]">
            {earnings.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-bold">{e.opportunityName}</p>
                  <p className="text-caption text-[color:var(--ink-3)]">
                    {new Date(e.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {e.reference ? ` · ${e.reference}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-caption font-bold uppercase tracking-wider text-[color:var(--ink-3)]">
                    {e.status}
                  </span>
                  <Money usd={e.amountUsd} size="sm" tone="earned" showNgn={false} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {totals.approvedUsd === 0 && joined.length === 0 && (
        <EmptyState
          title="Nothing earned yet"
          body="Join an opportunity, share your link, and approved referrals will start building a balance here."
          action={{ href: "/dashboard/opportunities", label: "See what is open" }}
        />
      )}
    </div>
  );
}
