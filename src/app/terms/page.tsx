import type { Metadata } from "next";
import { LegalPage } from "@/components/legal";

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
      reviewNote="This page states StudentMoney's operating rules in plain words. It is not yet the final contract: the binding terms, including dispute handling and the governing law, are being prepared with a qualified Nigerian legal adviser and will be published here before the first reward is paid."
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
          heading: "How each reward is calculated",
          body: (
            <>
              <p>
                Each opportunity publishes its own reward and the rule that releases
                it. Software Service Referrals pays a fixed amount for each approved
                referral. DARE Company Global releases one reward across a target
                number of referrals, in proportion to how far along you are. Tobi
                Music Academy releases its reward once the required number of students
                have been confirmed.
              </p>
              <p>
                Only approved referrals count toward any of them. Figures shown to you
                are derived from approved referrals, never from clicks or
                submissions, and a reward is never paid twice for the same referral.
              </p>
            </>
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
