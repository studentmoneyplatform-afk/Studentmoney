import type { Metadata } from "next";
import { LegalPage } from "@/components/legal";
import { GROW_USD, PROJECT_REWARD_USD, WITHDRAWABLE_USD } from "@/lib/rewards";
import { formatUsd } from "@/lib/money";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "The rules that govern rewards, qualifying projects, refunds, disputes and payouts on StudentMoney.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="The rules, written down before you start."
      intro="These are the operating rules of the platform. Each campaign may add its own published requirements, but no campaign may contradict what is on this page."
      reviewNote="This page states StudentMoney's operating rules in plain words. It is not yet the final contract: the binding terms, including the Grow share, dispute handling and the governing law, are being prepared with a qualified Nigerian legal adviser and will be published here before the first reward is paid."
      sections={[
        {
          heading: "Who can take part",
          body: (
            <>
              <p>
                You must be a registered university student, over 18, and able to verify
                your identity. One account per person. Attribution belongs to a verified
                person, not to a phone number or a link.
              </p>
            </>
          ),
        },
        {
          heading: "What qualifies as a project",
          body: (
            <p>
              A qualifying project is genuine work, agreed at a stated price with a real
              customer you introduced, delivered by an approved provider. Each campaign
              publishes its own definition, and that definition applies to the leads you
              submit under it.
            </p>
          ),
        },
        {
          heading: "How the reward is calculated",
          body: (
            <>
              <p>
                The standard referral reward is {formatUsd(PROJECT_REWARD_USD)} for one
                qualifying project. Your cumulative reward is the campaign reward
                multiplied by the cleared client payments, divided by the qualifying
                project price.
              </p>
              <p>
                The reward is for the project, not for each instalment. Cumulative
                rewards are never paid twice: each recalculation pays only the
                difference.
              </p>
            </>
          ),
        },
        {
          heading: "The cash and Grow split",
          body: (
            <p>
              Of every reward, {formatUsd(WITHDRAWABLE_USD)} in each{" "}
              {formatUsd(PROJECT_REWARD_USD)} is withdrawable cash and{" "}
              {formatUsd(GROW_USD)} is held as your Grow share. Both are visible in your
              ledger from the day they are earned. StudentMoney does not promise any
              return on the Grow share.
            </p>
          ),
        },
        {
          heading: "What does not qualify",
          body: (
            <p>
              Duplicate referrals, a business already attributed to another student,
              leads submitted without the customer&apos;s knowledge, fabricated contacts,
              self-referrals, and any attempt to manipulate attribution. These are
              removed from the ledger and may end your participation.
            </p>
          ),
        },
        {
          heading: "Refunds, chargebacks and cancellation",
          body: (
            <p>
              If a client payment is refunded, charged back or cancelled, the portion of
              your reward that payment funded reverses with it. If this happens after a
              payout, the amount is recovered from your next rewards rather than
              demanded back from you.
            </p>
          ),
        },
        {
          heading: "Content campaigns",
          body: (
            <p>
              Video rewards are separate from referral rewards. A submission is paid
              only if it meets the published brief and is approved. Where a campaign
              requires you to disclose that a post is promotional, that disclosure is
              part of approval. You keep ownership of what you make except where the
              brief states otherwise and you accept it before submitting.
            </p>
          ),
        },
        {
          heading: "Payouts",
          body: (
            <p>
              Payouts are made in naira to a bank account in your own name, at the rate
              posted on this site. The payout fee, the minimum withdrawal amount and the
              processing time are shown before you confirm a withdrawal.
            </p>
          ),
        },
        {
          heading: "Disputes",
          body: (
            <p>
              If you believe a reward is wrong, you can raise it and we will show you the
              payments the calculation used. We publish the outcome of the review to you
              in writing.
            </p>
          ),
        },
        {
          heading: "No income guarantee",
          body: (
            <p>
              Earning targets and challenge goals are motivational, not promises.
              StudentMoney does not guarantee income, does not offer passive income, and
              does not pay for recruiting other students on its own.
            </p>
          ),
        },
      ]}
    />
  );
}
