import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Money } from "@/components/money";
import { ProgressPreview } from "@/components/progress-preview";
import { Reveal } from "@/components/reveal";
import { Button, Card, Chip, Eyebrow, FinePrint, H2, Lede, Section } from "@/components/ui";
import { getOpportunity, rewardLine } from "@/lib/opportunities-data";
import { OPPORTUNITIES } from "@/lib/opportunities";

// Runs at build time, outside any request, so it reads the seeded slugs
// rather than the cookie-scoped Supabase client. Slugs are stable; an
// opportunity added later is served on demand.
export function generateStaticParams() {
  return OPPORTUNITIES.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const o = await getOpportunity(slug);
  if (!o) return { title: "Opportunity" };
  return { title: o.name, description: o.summary };
}

export default async function OpportunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const o = await getOpportunity(slug);
  if (!o) notFound();

  const { reward } = o;

  const requirement =
    reward.kind === "per_referral"
      ? "Each confirmed purchase counts on its own."
      : `${reward.target} confirmed ${reward.unit} make up the target.`;

  const payTiming =
    reward.kind === "per_referral"
      ? "Each approved referral adds its reward to your balance."
      : reward.kind === "proportional"
        ? `The $${reward.potUsd} is released in proportion to your progress, so you see money long before the ${reward.target}th.`
        : `Nothing is released until all ${reward.target} ${reward.unit} are confirmed, then the full $${reward.rewardUsd} lands at once.`;

  return (
    <div data-page="earn">
      <Section tone="forest">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <Chip tone="forest">Opportunity {o.index}</Chip>
            <span className="text-caption text-[color:var(--on-dark-3)]">{o.partner}</span>
          </div>
          <h1 className="font-display mt-6 max-w-3xl text-h1">{o.name}</h1>
          <Lede tone="reversed" className="mt-6">
            {o.summary}
          </Lede>

          <div className="mt-10 flex flex-wrap items-end gap-x-8 gap-y-3">
            <div>
              <Eyebrow tone="reversed">Reward</Eyebrow>
              <div className="mt-2">
                <Money usd={o.headline} size="lg" tone="earned-reversed" />
              </div>
            </div>
            <p className="pb-2 text-[color:var(--on-dark-2)]">{rewardLine(reward)}</p>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/join" variant="light" size="lg">
              Join this opportunity
            </Button>
            <Button href="/opportunities" variant="ghost" size="lg">
              See the other two
            </Button>
          </div>
        </Reveal>
      </Section>

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Reveal>
            <div>
              <Eyebrow>What you do</Eyebrow>
              <H2 className="mt-4">{o.whatYouDo.split(".")[0]}.</H2>
              <Lede className="mt-5">{o.whatYouDo}</Lede>

              <dl className="mt-10 space-y-6">
                {[
                  ["What counts", requirement],
                  ["When you get paid", payTiming],
                  [
                    "Who pays",
                    `${o.partner} funds this reward. Stormm verifies the referral and makes the payment to you.`,
                  ],
                  [
                    "Your tracking code",
                    "You receive a link that is yours alone. Anyone who arrives through it is attributed to you from that moment.",
                  ],
                  [
                    "What happens after you submit",
                    "The referral sits at pending verification until we have checked it is genuine. You can see that status at any time, and you are told when it changes.",
                  ],
                ].map(([term, def]) => (
                  <div key={term} className="border-t border-[color:var(--hair)] pt-5">
                    <dt className="font-bold">{term}</dt>
                    <dd className="mt-1.5 text-[color:var(--ink-2)]">{def}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <ProgressPreview reward={reward} />
          </Reveal>
        </div>
      </Section>

      {o.toConfirm.length > 0 && (
        <Section tone="paper-2" width="narrow">
          <Reveal>
            <Card tone="outline">
              <Eyebrow>Still being confirmed with {o.partner}</Eyebrow>
              <p className="mt-3 text-[color:var(--ink-2)]">
                We publish what we know and nothing we do not. These details are being
                settled and will appear here before anyone can be paid on them.
              </p>
              <ul className="mt-5 space-y-2.5">
                {o.toConfirm.map((q) => (
                  <li
                    key={q}
                    className="flex gap-3 border-b border-[color:var(--hair)] pb-2.5 last:border-0"
                  >
                    <span aria-hidden="true" className="text-[color:var(--ink-4)]">
                      —
                    </span>
                    <span className="text-[color:var(--ink-2)]">{q}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </Section>
      )}

      <Section tone="paper-2" width="narrow" className="text-center">
        <Reveal>
          <H2>Ready to start on this one?</H2>
          <p className="mx-auto mt-5 max-w-lg text-lead text-[color:var(--ink-2)]">
            Create your account, get your tracking link, and your progress appears on
            your dashboard from the first click.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/join" size="lg">
              Create your account
            </Button>
          </div>
          <div className="mx-auto mt-6 max-w-md">
            <FinePrint>
              Joining is free. Rewards are paid on verified, approved referrals only.
            </FinePrint>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}
