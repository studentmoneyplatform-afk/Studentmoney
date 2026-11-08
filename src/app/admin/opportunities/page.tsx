import type { Metadata } from "next";
import { Panel } from "@/components/dashboard-ui";
import { OpportunityForm } from "@/components/admin-forms";
import { Chip, FinePrint } from "@/components/ui";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { rewardLine } from "@/lib/opportunities-data";
import { OPPORTUNITIES } from "@/lib/opportunities";

export const metadata: Metadata = { title: "Opportunities" };

export default async function AdminOpportunitiesPage() {
  const supabase = await getSupabaseServerClient();
  const { data } = supabase
    ? await supabase
        .from("opportunities")
        .select(
          "slug, name, partner, summary, what_you_do, status, reward_kind, reward_usd, pot_usd, target, unit",
        )
        .order("display_order")
    : { data: null };

  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <Panel title="Editing">
        <p className="text-[color:var(--ink-2)]">
          Wording saves straight to the public pages — no deploy. The reward shape and
          amounts are deliberately not editable here: changing how an opportunity pays
          after students have joined would move money, so it goes through a migration
          and a conversation.
        </p>
        <div className="mt-4">
          <FinePrint>
            Each opportunity also carries open questions on its public page. Those live
            in the codebase under toConfirm, so they change only when the partner
            actually answers.
          </FinePrint>
        </div>
      </Panel>

      {rows.length === 0 ? (
        <Panel title="Not connected">
          <p className="text-[color:var(--ink-2)]">
            The opportunity table is not reachable, so the seeded definitions are
            serving the public pages:
          </p>
          <ul className="mt-4 space-y-2">
            {OPPORTUNITIES.map((o) => (
              <li key={o.slug} className="text-caption">
                <span className="font-bold">{o.name}</span> — {rewardLine(o.reward)}
              </li>
            ))}
          </ul>
        </Panel>
      ) : (
        rows.map((o) => (
          <Panel key={o.slug} title={o.name}>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Chip>{o.status}</Chip>
              <Chip>{String(o.reward_kind).replace("_", " ")}</Chip>
              <span className="text-caption text-[color:var(--ink-3)]">
                {o.pot_usd
                  ? `$${o.pot_usd} across ${o.target} ${o.unit}`
                  : o.target
                    ? `$${o.reward_usd} at ${o.target} ${o.unit}`
                    : `$${o.reward_usd} per referral`}
              </span>
            </div>
            <OpportunityForm
              slug={o.slug}
              name={o.name}
              partner={o.partner}
              summary={o.summary}
              whatYouDo={o.what_you_do}
              status={o.status}
            />
          </Panel>
        ))
      )}
    </div>
  );
}
