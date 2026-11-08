import type { Metadata } from "next";
import { EmptyState, Panel } from "@/components/dashboard-ui";
import { PaymentForm } from "@/components/admin-forms";
import { FinePrint } from "@/components/ui";
import { getParticipations } from "@/lib/admin-data";
import { formatUsd } from "@/lib/money";

export const metadata: Metadata = { title: "Payments" };

export default async function AdminPaymentsPage() {
  const rows = await getParticipations();
  const owed = rows.filter((r) => r.earnedUsd - r.paidUsd > 0.005);

  if (rows.length === 0) {
    return (
      <EmptyState
        title="No balances yet"
        body="Once referrals are approved, the students who have earned appear here with the amount outstanding."
      />
    );
  }

  return (
    <div className="space-y-8">
      <Panel title={`${owed.length} with money outstanding`}>
        {owed.length === 0 ? (
          <p className="text-[color:var(--ink-2)]">Everyone approved has been paid.</p>
        ) : (
          <ul className="divide-y divide-[color:var(--hair)]">
            {owed.map((r) => {
              const outstanding = r.earnedUsd - r.paidUsd;
              return (
                <li key={r.id} className="py-5 first:pt-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{r.studentName}</p>
                      <p className="text-caption text-[color:var(--ink-3)]">
                        {r.opportunityName} · {r.approvedCount} approved · earned{" "}
                        {formatUsd(r.earnedUsd)}, paid {formatUsd(r.paidUsd)}
                      </p>
                    </div>
                    <p className="money text-[1.25rem] text-money">
                      {formatUsd(outstanding)}
                    </p>
                  </div>
                  <div className="mt-4">
                    <PaymentForm participationId={r.id} outstanding={round2(outstanding)} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <div className="mt-6">
          <FinePrint>
            The database refuses any payment that would take the total above what the
            student has earned, so an extra zero cannot get through.
          </FinePrint>
        </div>
      </Panel>

      <Panel title="All balances">
        <ul className="divide-y divide-[color:var(--hair)]">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="font-bold">{r.studentName}</p>
                <p className="text-caption text-[color:var(--ink-3)]">{r.opportunityName}</p>
              </div>
              <p className="text-caption">
                {formatUsd(r.earnedUsd)} earned · {formatUsd(r.paidUsd)} paid
              </p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
