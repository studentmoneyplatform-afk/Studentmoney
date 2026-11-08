import type { Metadata } from "next";
import { EmptyState, Panel } from "@/components/dashboard-ui";
import { ReviewControls } from "@/components/admin-forms";
import { FinePrint } from "@/components/ui";
import { getReviewQueue } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Review queue" };

export default async function AdminReferralsPage() {
  const queue = await getReviewQueue();

  if (queue.length === 0) {
    return (
      <EmptyState
        title="Nothing waiting"
        body="Every submitted referral has been reviewed. New ones appear here as students submit them."
      />
    );
  }

  return (
    <Panel title={`${queue.length} awaiting a decision`}>
      <ul className="divide-y divide-[color:var(--hair)]">
        {queue.map((r) => (
          <li key={r.id} className="py-5 first:pt-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold">{r.label}</p>
                <p className="mt-0.5 text-caption text-[color:var(--ink-3)]">
                  {r.email ?? r.phone ?? "No contact given"}
                </p>
                <p className="mt-1 text-caption">
                  {r.opportunityName} · referred by{" "}
                  <span className="font-bold">{r.studentName}</span> ·{" "}
                  {new Date(r.createdAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <ReviewControls id={r.id} />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <FinePrint>
          Approving moves the student&apos;s ledger immediately and notifies them.
          Rejecting requires a reason, which the student sees on their referral.
        </FinePrint>
      </div>
    </Panel>
  );
}
