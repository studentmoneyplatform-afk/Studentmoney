import Link from "next/link";
import type { ReactNode } from "react";
import { Money } from "@/components/money";
import { Eyebrow, FinePrint } from "@/components/ui";
import { STAGE_LABEL, type ReferralStage } from "@/lib/dashboard-types";

/** A headline figure. Money figures stay in the money colour; counts do not. */
export function StatTile({
  label,
  usd,
  count,
  hint,
}: {
  label: string;
  usd?: number;
  count?: number;
  hint?: string;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[color:var(--hair)] bg-paper p-5">
      <Eyebrow>{label}</Eyebrow>
      <div className="mt-3">
        {usd !== undefined ? (
          <Money usd={usd} size="md" tone="earned" showNgn={false} />
        ) : (
          <p className="money text-[1.875rem] leading-none">{count ?? 0}</p>
        )}
      </div>
      {hint && (
        <div className="mt-2">
          <FinePrint>{hint}</FinePrint>
        </div>
      )}
    </div>
  );
}

const STAGE_STYLE: Record<ReferralStage, string> = {
  clicked: "bg-[color:var(--hair)] text-[color:var(--ink-2)]",
  registered: "bg-[color:var(--hair)] text-[color:var(--ink-2)]",
  pending_verification: "bg-warning/15 text-[color:var(--color-warning)]",
  approved: "bg-success/15 text-[color:var(--color-success)]",
  rejected: "bg-error/10 text-[color:var(--color-error)]",
  paid: "bg-forest text-[color:var(--on-dark-1)]",
};

export function StageBadge({ stage }: { stage: ReferralStage }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-micro font-bold uppercase tracking-wider ${STAGE_STYLE[stage]}`}
    >
      {STAGE_LABEL[stage]}
    </span>
  );
}

/** Used wherever a student has nothing yet — never a fake row. */
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-dashed border-[color:var(--hair-strong)] bg-paper p-10 text-center">
      <h2 className="font-display text-h3">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-[color:var(--ink-2)]">{body}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-7 inline-flex rounded-full bg-forest px-6 py-3 font-bold text-[color:var(--on-dark-1)] transition-colors hover:bg-forest-deep"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[var(--radius-xl)] border border-[color:var(--hair)] bg-paper p-6 sm:p-7">
      <h2 className="font-display text-h3">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
