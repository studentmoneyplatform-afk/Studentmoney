import type { Metadata } from "next";
import { EmptyState, Panel } from "@/components/dashboard-ui";
import { ReferralTable } from "@/components/referral-table";
import { FinePrint } from "@/components/ui";
import { getDashboardData } from "@/lib/dashboard-data";

export const metadata: Metadata = { title: "My referrals" };

const STAGE_MEANING = [
  ["Clicked", "Someone opened your link. Nothing is owed yet."],
  ["Registered", "They signed up or made contact through you."],
  ["Pending verification", "We are checking the referral is genuine."],
  ["Approved", "It counts. Your progress and earnings have moved."],
  ["Rejected", "It did not qualify, and the reason is shown on the referral."],
  ["Reward paid", "The money for it has been sent to you."],
];

export default async function MyReferralsPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      {data.referrals.length === 0 ? (
        <EmptyState
          title="No referrals yet"
          body="Once you share a tracking link, every click and sign-up appears here with the stage it has reached — including the ones that have not earned anything yet."
          action={{ href: "/dashboard/opportunities", label: "Get a tracking link" }}
        />
      ) : (
        <Panel title={`${data.referrals.length} referrals`}>
          <ReferralTable rows={data.referrals} />
        </Panel>
      )}

      <Panel title="What each stage means">
        <dl className="divide-y divide-[color:var(--hair)]">
          {STAGE_MEANING.map(([stage, meaning]) => (
            <div key={stage} className="flex flex-wrap gap-x-6 gap-y-1 py-3">
              <dt className="w-44 shrink-0 font-bold">{stage}</dt>
              <dd className="flex-1 text-[color:var(--ink-2)]">{meaning}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5">
          <FinePrint>
            A click is not a referral and a referral is not a reward. Only approved
            referrals move your earnings, and you can see the reason behind any
            rejection.
          </FinePrint>
        </div>
      </Panel>
    </div>
  );
}
