import type { Metadata } from "next";
import Link from "next/link";
import { Panel, StatTile } from "@/components/dashboard-ui";
import { FinePrint } from "@/components/ui";
import { getParticipations, getReviewQueue, getStudents } from "@/lib/admin-data";
import {
  formatUsd,
  NGN_PER_USD,
  NGN_RATE_SET_ON,
  NGN_RATE_STALE_AFTER_DAYS,
  ngnRateAgeDays,
  ngnRateIsStale,
} from "@/lib/money";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminOverviewPage() {
  const [queue, participations, students] = await Promise.all([
    getReviewQueue(),
    getParticipations(),
    getStudents(),
  ]);

  const earned = participations.reduce((s, p) => s + p.earnedUsd, 0);
  const paid = participations.reduce((s, p) => s + p.paidUsd, 0);
  const unverified = students.filter((s) => !s.verifiedAt).length;

  return (
    <div className="space-y-8">
      {/*
        Every naira figure on the site is a dollar amount times this rate.
        It is posted, not live, so the risk is not that it is wrong today but
        that nobody looks at it again while the naira moves.
      */}
      {ngnRateIsStale() && (
        <div className="rounded-[var(--radius-lg)] border-2 border-warning/50 bg-warning/5 px-5 py-4">
          <p className="font-bold">The naira rate needs another look</p>
          <p className="mt-1 text-[color:var(--ink-2)]">
            Students are seeing figures converted at{" "}
            <span className="font-bold">
              ₦{NGN_PER_USD.toLocaleString("en-NG")} to $1
            </span>
            , set on {NGN_RATE_SET_ON} — {ngnRateAgeDays()} days ago. Anything over{" "}
            {NGN_RATE_STALE_AFTER_DAYS} days is worth rechecking, because a rate that has
            drifted misquotes every reward on the site.
          </p>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Awaiting review" count={queue.length} hint="Referrals needing a decision" />
        <StatTile label="Owed to students" usd={Math.max(earned - paid, 0)} hint="Approved, not yet paid" />
        <StatTile label="Paid out" usd={paid} hint="Recorded payments" />
        <StatTile label="Students" count={students.length} hint={`${unverified} not yet verified`} />
      </div>

      <Panel title="What needs you">
        <ul className="divide-y divide-[color:var(--hair)]">
          {[
            [queue.length, "referrals awaiting a decision", "/admin/referrals", "Review"],
            [unverified, "students awaiting verification", "/admin/students", "Verify"],
            [
              participations.filter((p) => p.earnedUsd - p.paidUsd > 0).length,
              "students with money owed",
              "/admin/payments",
              "Pay",
            ],
          ].map(([count, label, href, cta]) => (
            <li key={label as string} className="flex items-center justify-between gap-4 py-4">
              <p>
                <span className="money mr-2 text-[1.25rem]">{count as number}</span>
                <span className="text-[color:var(--ink-2)]">{label as string}</span>
              </p>
              {(count as number) > 0 && (
                <Link
                  href={href as string}
                  className="rounded-full bg-forest px-4 py-2 text-caption font-bold text-[color:var(--on-dark-1)]"
                >
                  {cta as string}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-5">
          <FinePrint>
            Totals come from the ledger, which the database recomputes from approved
            referrals. They are not a separate tally that could drift.
          </FinePrint>
        </div>
      </Panel>

      {participations.length > 0 && (
        <Panel title="Top balances">
          <ul className="divide-y divide-[color:var(--hair)]">
            {participations.slice(0, 8).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-bold">{p.studentName}</p>
                  <p className="text-caption text-[color:var(--ink-3)]">
                    {p.opportunityName} · {p.approvedCount} approved
                  </p>
                </div>
                <p className="money text-[1.125rem] text-money">
                  {formatUsd(p.earnedUsd - p.paidUsd)}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
