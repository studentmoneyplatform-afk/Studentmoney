"use client";

import { useMemo, useState } from "react";
import { StageBadge } from "@/components/dashboard-ui";
import { STAGE_LABEL, type ReferralRow, type ReferralStage } from "@/lib/dashboard-types";

const STAGES = Object.keys(STAGE_LABEL) as ReferralStage[];

/**
 * The referral list, filterable and searchable.
 *
 * On a phone this is a list of cards rather than a squeezed table: a table
 * with six columns on a 375px screen is unreadable however it is scrolled.
 */
export function ReferralTable({ rows }: { rows: ReferralRow[] }) {
  const [stage, setStage] = useState<ReferralStage | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (stage !== "all" && r.stage !== stage) return false;
      if (!q) return true;
      return (
        r.label.toLowerCase().includes(q) || r.opportunityName.toLowerCase().includes(q)
      );
    });
  }, [rows, stage, query]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) map.set(r.stage, (map.get(r.stage) ?? 0) + 1);
    return map;
  }, [rows]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex-1 min-w-[12rem]">
          <span className="sr-only">Search referrals</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or opportunity"
            className="w-full rounded-full border border-[color:var(--hair-strong)] bg-paper px-4 py-2.5 text-caption"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Filter by stage">
        <FilterChip active={stage === "all"} onClick={() => setStage("all")}>
          All ({rows.length})
        </FilterChip>
        {STAGES.map((s) => (
          <FilterChip key={s} active={stage === s} onClick={() => setStage(s)}>
            {STAGE_LABEL[s]} ({counts.get(s) ?? 0})
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-[color:var(--ink-2)]">
          Nothing matches that. Clear the filter to see everything.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-[color:var(--hair)] border-t border-[color:var(--hair)]">
          {filtered.map((r) => (
            <li key={r.id} className="py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-bold">{r.label}</p>
                  <p className="mt-0.5 text-caption text-[color:var(--ink-3)]">
                    {r.opportunityName} · {formatDate(r.createdAt)}
                  </p>
                  {r.stage === "rejected" && r.rejectedReason && (
                    <p className="mt-1.5 text-caption text-[color:var(--color-error)]">
                      {r.rejectedReason}
                    </p>
                  )}
                </div>
                <StageBadge stage={r.stage} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3.5 py-1.5 text-micro font-bold uppercase tracking-wider transition-colors ${
        active
          ? "bg-forest text-[color:var(--on-dark-1)]"
          : "border border-[color:var(--hair-strong)] text-[color:var(--ink-2)] hover:border-[color:var(--ink-1)]"
      }`}
    >
      {children}
    </button>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
