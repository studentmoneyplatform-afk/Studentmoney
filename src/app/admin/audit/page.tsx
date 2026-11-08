import type { Metadata } from "next";
import { EmptyState, Panel } from "@/components/dashboard-ui";
import { FinePrint } from "@/components/ui";
import { getAuditTrail } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Audit log" };

export default async function AdminAuditPage() {
  const trail = await getAuditTrail();

  if (trail.length === 0) {
    return (
      <EmptyState
        title="Nothing logged yet"
        body="Every approval, rejection, payment and verification is written here with who did it and when. The log fills as staff act."
      />
    );
  }

  return (
    <Panel title={`Last ${trail.length} actions`}>
      <ul className="divide-y divide-[color:var(--hair)]">
        {trail.map((a) => (
          <li key={a.id} className="flex flex-wrap items-start justify-between gap-3 py-3.5">
            <div className="min-w-0">
              <p className="font-mono text-caption font-bold">{a.action}</p>
              <p className="mt-0.5 text-caption text-[color:var(--ink-3)]">
                {a.entity}
                {a.detail && Object.keys(a.detail).length > 0
                  ? ` · ${summarise(a.detail)}`
                  : ""}
              </p>
            </div>
            <time
              dateTime={a.createdAt}
              className="shrink-0 text-caption text-[color:var(--ink-3)]"
            >
              {new Date(a.createdAt).toLocaleString("en-NG", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <FinePrint>
          Written by the database as part of each action, so a reward cannot be
          approved without the decision being recorded alongside it.
        </FinePrint>
      </div>
    </Panel>
  );
}

function summarise(detail: Record<string, unknown>): string {
  return Object.entries(detail)
    .filter(([, v]) => v !== null && v !== "")
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join(", ");
}
