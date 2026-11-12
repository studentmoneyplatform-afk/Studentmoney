import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InterestForm } from "@/components/interest-form";
import { Eyebrow, FinePrint, Section } from "@/components/ui";
import { getOpportunity } from "@/lib/opportunities-data";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "You have been invited",
  robots: { index: false, follow: false },
};

/**
 * Where a shared link lands.
 *
 * Two doors, because two different people follow these links and until now
 * the site only had a door for one of them. Someone who wants the service
 * leaves a name and a number and never makes an account; someone who wants to
 * earn signs up as everybody else does, and the cookie set on the way in
 * attributes them to whoever shared it.
 */
export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const supabase = await getSupabaseServerClient();
  if (!supabase) notFound();

  const { data } = await supabase.rpc("resolve_referral_code", { p_code: code });
  const match = Array.isArray(data) ? data[0] : null;
  if (!match?.opportunity_slug) notFound();

  const opportunity = await getOpportunity(match.opportunity_slug);
  if (!opportunity) notFound();

  return (
    <div data-page="earn">
      <Section>
        <div className="mx-auto max-w-3xl">
          <Eyebrow>You have been invited</Eyebrow>
          <h1 className="font-display mt-4 text-[clamp(1.9rem,4vw,2.8rem)] leading-tight">
            {opportunity.name}
          </h1>
          <p className="mt-5 text-lead leading-relaxed text-[color:var(--ink-2)]">
            {opportunity.summary}
          </p>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <section className="rounded-[1.5rem] border-2 border-forest bg-paper p-7">
              <h2 className="font-display text-[1.4rem]">I want this</h2>
              <p className="mt-2 text-[color:var(--ink-2)]">
                Leave your name and one way to reach you. {opportunity.partner} will get
                in touch. You do not need an account.
              </p>
              <div className="mt-6">
                <InterestForm code={code} partner={opportunity.partner} />
              </div>
            </section>

            <section className="rounded-[1.5rem] bg-forest p-7 text-[color:var(--on-dark-1)]">
              <h2 className="font-display text-[1.4rem]">I want to earn too</h2>
              <p className="mt-2 text-[color:var(--on-dark-2)]">
                Join Stormm and you get your own link and your own dashboard, and can
                refer people to this and to everything else we run.
              </p>
              <div className="mt-6">
                <Link
                  href="/join"
                  className="inline-flex rounded-full bg-paper px-6 py-3 font-bold text-forest-deep transition-transform hover:scale-[1.03]"
                >
                  Create your account
                </Link>
              </div>
              <div className="mt-7">
                <FinePrint tone="reversed">
                  {opportunity.whatYouDo}
                </FinePrint>
              </div>
            </section>
          </div>

          <div className="mt-10 max-w-2xl">
            <FinePrint>
              Stormm does not guarantee income or employment. Leaving your details here
              is not a purchase and commits you to nothing.
            </FinePrint>
          </div>
        </div>
      </Section>
    </div>
  );
}
