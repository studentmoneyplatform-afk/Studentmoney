import Link from "next/link";
import { Money } from "@/components/money";
import { Card, Chip, Eyebrow, FinePrint } from "@/components/ui";
import { rewardLine } from "@/lib/opportunities-data";
import type { Opportunity } from "@/lib/opportunities";

/**
 * One opportunity, as it appears on the homepage and the explore page.
 * Everything a student needs to decide is on the card itself — nothing
 * essential is hidden behind a hover, so this works on a phone.
 */
export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const { reward } = opportunity;

  const requirement =
    reward.kind === "per_referral"
      ? "One confirmed purchase"
      : `${reward.target} confirmed ${reward.unit}`;

  return (
    <Card interactive className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <Eyebrow>Opportunity {opportunity.index}</Eyebrow>
          <h3 className="font-display mt-2 text-h3 leading-tight">{opportunity.name}</h3>
          <p className="mt-1 text-caption text-[color:var(--ink-3)]">
            {opportunity.partner}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <Money usd={opportunity.headline} size="md" tone="earned" showNgn={false} />
        </div>
      </div>

      <p className="mt-5 flex-1 text-[color:var(--ink-2)]">{opportunity.summary}</p>

      <dl className="mt-6 grid gap-3 border-t border-[color:var(--hair)] pt-5 sm:grid-cols-2">
        <div>
          <dt className="text-micro font-bold uppercase tracking-widest text-[color:var(--ink-3)]">
            How it pays
          </dt>
          <dd className="mt-1 text-caption font-bold">{rewardLine(reward)}</dd>
        </div>
        <div>
          <dt className="text-micro font-bold uppercase tracking-widest text-[color:var(--ink-3)]">
            Requirement
          </dt>
          <dd className="mt-1 text-caption font-bold">{requirement}</dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={`/opportunities/${opportunity.slug}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-forest px-5 py-2.5 text-caption font-bold text-[color:var(--on-dark-1)] transition-colors hover:bg-forest-deep"
        >
          View details
          <span aria-hidden="true">→</span>
        </Link>
        {reward.kind === "proportional" && <Chip>Paid as you progress</Chip>}
        {reward.kind === "threshold" && <Chip>Paid at the target</Chip>}
      </div>

      <div className="mt-4">
        <FinePrint>
          Rewards are paid on referrals we have verified and approved. Terms apply.
        </FinePrint>
      </div>
    </Card>
  );
}
