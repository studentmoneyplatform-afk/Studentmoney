import type { Metadata } from "next";
import { Panel, StatTile } from "@/components/dashboard-ui";
import { FinePrint } from "@/components/ui";
import { getDashboardData } from "@/lib/dashboard-data";
import { formatUsd } from "@/lib/money";

export const metadata: Metadata = { title: "Payouts" };

/**
 * What has actually been paid, and what is still owed.
 *
 * There is deliberately no withdraw button. The payout process is not live,
 * and a control that does not move money is worse than none on a page about
 * money. When it is live this is where it goes.
 */
export default async function PayoutsPage() {
  const { totals, earnings } = await getDashboardData();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Paid out" usd={totals.paidUsd} hint="Already sent to you" />
        <StatTile label="Awaiting payout" usd={totals.pendingUsd} hint="Yours, not yet transferred" />
        <StatTile label="Approved in total" usd={totals.approvedUsd} hint="Verified and counted" />
      </div>

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
                <div className="min-w-0">
                  <p className="font-bold">{e.opportunityName}</p>
                  <p className="text-caption text-[color:var(--ink-3)]">
                    {e.reference ? `Reference ${e.reference} · ` : ""}
                    {new Date(e.paidAt ?? e.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-caption font-bold uppercase tracking-wider text-[color:var(--ink-3)]">
                    {e.status}
                  </span>
                  <span className="money text-[1.15rem] text-money">{formatUsd(e.amountUsd)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
