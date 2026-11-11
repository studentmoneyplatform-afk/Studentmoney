import Link from "next/link";
import { Card, Chip, FinePrint } from "@/components/ui";
import { rewardLine } from "@/lib/opportunities-data";
import { OPPORTUNITY_ICONS } from "@/components/opportunity-icons";
import type { Opportunity } from "@/lib/opportunities";
import { formatUsd } from "@/lib/money";

/**
 * One opportunity, in the same shape as the cards floating in the hero.
 * Everything a student needs to decide is on the card itself — nothing
 * essential hides behind a hover, so this works on a phone.
 */
export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const { reward } = opportunity;
  const tint = OPPORTUNITY_ICONS[opportunity.slug] ?? OPPORTUNITY_ICONS["software-referrals"];

  const requirement =
    reward.kind === "per_referral"
      ? "One confirmed purchase"
      : `${reward.target} confirmed ${reward.unit}`;

  return (
    <Card interactive className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tint.bg}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {tint.icon}
          </svg>
        </span>
        <span className="money text-[1.75rem] leading-none text-forest">
          {formatUsd(opportunity.headline)}
        </span>
      </div>

      <h3 className="font-display mt-5 text-[1.375rem] leading-tight">{opportunity.name}</h3>
      <p className="mt-1 text-caption text-ink/50">{opportunity.partner}</p>

      <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink/75">
        {opportunity.summary}
      </p>

      <dl className="mt-6 space-y-3 border-t border-ink/10 pt-5">
        <div>
          <dt className="text-[0.6875rem] font-extrabold uppercase tracking-[0.12em] text-ink/40">
            How it pays
          </dt>
          <dd className="mt-1 text-[0.875rem] font-bold text-forest">{rewardLine(reward)}</dd>
        </div>
        <div>
          <dt className="text-[0.6875rem] font-extrabold uppercase tracking-[0.12em] text-ink/40">
            Requirement
          </dt>
          <dd className="mt-1 text-[0.875rem] font-bold">{requirement}</dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={`/opportunities/${opportunity.slug}`}
          className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-[0.875rem] font-extrabold text-paper transition-colors hover:bg-forest-deep"
        >
          View details
          <span aria-hidden="true">→</span>
        </Link>
        {reward.kind === "proportional" && <Chip>Paid as you progress</Chip>}
        {reward.kind === "threshold" && <Chip>Paid at the target</Chip>}
      </div>

      <div className="mt-4">
        <FinePrint>Paid on referrals we have verified and approved. Terms apply.</FinePrint>
      </div>
    </Card>
  );
}
