import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Money } from "@/components/money";
import { RewardBar } from "@/components/reward-bar";
import { Button, Card, Eyebrow, FinePrint, H2, Section } from "@/components/ui";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { PROJECT_REWARD_USD } from "@/lib/rewards";
import { formatUsd } from "@/lib/money";

export const metadata: Metadata = { title: "Your ledger" };

type Entry = {
  earned_usd: number;
  cash_usd: number;
  grow_usd: number;
  cleared_usd: number;
  price_usd: number;
  reward_usd: number;
};

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/join");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/join");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, university, verified_at")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/welcome");

  const { data: entries } = await supabase
    .from("reward_entries")
    .select("earned_usd, cash_usd, grow_usd, cleared_usd, price_usd, reward_usd");

  const rows: Entry[] = (entries ?? []).map((e) => ({
    earned_usd: Number(e.earned_usd),
    cash_usd: Number(e.cash_usd),
    grow_usd: Number(e.grow_usd),
    cleared_usd: Number(e.cleared_usd),
    price_usd: Number(e.price_usd),
    reward_usd: Number(e.reward_usd),
  }));

  const total = rows.reduce(
    (acc, r) => ({
      earned: acc.earned + r.earned_usd,
      cash: acc.cash + r.cash_usd,
      grow: acc.grow + r.grow_usd,
      reward: acc.reward + r.reward_usd,
    }),
    { earned: 0, cash: 0, grow: 0, reward: 0 },
  );

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("id, title, summary, reward_usd, qualifying_rule, payout_terms")
    .eq("status", "live")
    .limit(6);

  const firstName = profile.full_name.split(" ")[0];

  return (
    <>
      <Section tone="forest">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <Eyebrow tone="accent">Your ledger</Eyebrow>
            <h1 className="font-display mt-4 text-[2.25rem] leading-[1.05] sm:text-[3rem]">
              Welcome, {firstName}.
            </h1>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-full border-2 border-cream/40 px-5 py-2.5 text-[0.9375rem] font-bold text-cream transition-colors hover:border-cream"
            >
              Sign out
            </button>
          </form>
        </div>

        {!profile.verified_at && (
          <Card tone="forest" className="mt-8 border-2 border-warning">
            <h2 className="font-display text-subhead">Verification pending</h2>
            <p className="mt-3 text-cream/90">
              You can browse campaigns now. Before a reward can be attributed to you we
              verify who you are, because attribution has to belong to a real person.
              We will message you on WhatsApp when that is done.
            </p>
          </Card>
        )}

        <Card
          tone="forest"
          className="mt-8 border border-[color:var(--color-rule-reversed)]"
        >
          <Eyebrow tone="accent">Earned so far</Eyebrow>
          <div className="mt-4">
            <Money usd={total.earned} size="xl" tone="earned-reversed" />
          </div>

          {total.reward > 0 ? (
            <>
              <RewardBar
                cash={total.cash}
                grow={total.grow}
                total={total.reward}
                className="mt-7"
              />
              <div className="mt-5">
                <FinePrint tone="reversed">
                  Across {rows.length} project{rows.length === 1 ? "" : "s"}. Figures
                  move as client payments clear, and a refund reverses the part it
                  funded.
                </FinePrint>
              </div>
            </>
          ) : (
            <div className="mt-6">
              <p className="text-cream/90">
                Nothing yet. Your first {formatUsd(PROJECT_REWARD_USD)} starts with one
                genuine introduction.
              </p>
              <div className="mt-6">
                <Button href="/opportunities" variant="cream">
                  See what is live
                </Button>
              </div>
            </div>
          )}
        </Card>
      </Section>

      <Section tone="cream">
        <H2>Live campaigns</H2>

        {campaigns && campaigns.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {campaigns.map((c) => (
              <Card key={c.id} tone="outline">
                <h3 className="font-display text-subhead">{c.title}</h3>
                <p className="mt-3 text-ink/80">{c.summary}</p>
                <div className="mt-5">
                  <Money usd={Number(c.reward_usd)} size="sm" tone="earned" />
                </div>
                <div className="mt-4 space-y-1">
                  <FinePrint>Qualifies: {c.qualifying_rule}</FinePrint>
                  <FinePrint>Paid: {c.payout_terms}</FinePrint>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-8 max-w-2xl">
            <p className="text-ink/80">
              No campaigns are live yet. When one opens you will get it on WhatsApp
              first, with the reward and the rules attached.
            </p>
          </div>
        )}
      </Section>
    </>
  );
}
