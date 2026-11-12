import type { Metadata } from "next";
import Link from "next/link";
import { Panel } from "@/components/dashboard-ui";
import { FinePrint } from "@/components/ui";

export const metadata: Metadata = { title: "Help & support" };

const ANSWERS: { q: string; a: string }[] = [
  {
    q: "My referral is not showing up",
    a: "A referral only appears once someone has used your link and reached the stage the opportunity counts. A click on its own is recorded but does not earn anything.",
  },
  {
    q: "A referral has been pending for a while",
    a: "Pending means it is with us, not with you. We verify that the person is real and that the opportunity's rules were met before anything is approved.",
  },
  {
    q: "When do I get paid?",
    a: "Rewards are released once your referrals are approved and the opportunity's target is met. The payout process is not open yet, which is why there is no withdraw button on your payouts page.",
  },
  {
    q: "A referral was rejected",
    a: "The reason is shown against it on your referrals page. If you think it is wrong, message us and a person will look at it again.",
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <Panel title="Talk to a person">
        <p className="text-[color:var(--ink-2)]">
          Message us on WhatsApp from the number on your account and we will pick it up.
          Anything about who a reward belongs to is decided by a person, not a rule.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/faqs"
            className="rounded-full bg-forest px-5 py-2.5 font-bold text-[color:var(--on-dark-1)] transition-colors hover:bg-forest-deep"
          >
            Read the full FAQs
          </Link>
          <Link
            href="/how-it-works"
            className="rounded-full border border-[color:var(--hair-strong)] px-5 py-2.5 font-bold transition-colors hover:border-[color:var(--ink-1)]"
          >
            How it works
          </Link>
        </div>
      </Panel>

      <Panel title="The usual questions">
        <dl className="divide-y divide-[color:var(--hair)]">
          {ANSWERS.map((item) => (
            <div key={item.q} className="py-4 first:pt-0 last:pb-0">
              <dt className="font-bold">{item.q}</dt>
              <dd className="mt-1.5 text-[color:var(--ink-2)]">{item.a}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5">
          <FinePrint>
            Stormm does not guarantee income or employment. Rewards are paid on referrals
            that have been verified and approved, under the rules published on each
            opportunity.
          </FinePrint>
        </div>
      </Panel>
    </div>
  );
}
