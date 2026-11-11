import type { Metadata } from "next";
import { LegalPage } from "@/components/legal";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Stormm collects, why, who sees it, and how you control messages and your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="What we hold, and why we hold it."
      intro="We collect what is needed to attribute a referral to you, pay you, and keep the network free of fraud. Nothing beyond that."
      reviewNote="This page describes Stormm's intended practice. The final notice, including our data controller details, retention periods and the lawful basis under the Nigeria Data Protection Act, is being prepared with a qualified adviser and will be published here before launch."
      sections={[
        {
          heading: "What we collect",
          body: (
            <>
              <p>
                From you: your name, WhatsApp number, university, and optionally your
                email. Later, the bank details needed to pay you and the documents used
                to verify your identity.
              </p>
              <p>
                From your activity: the referrals you submit, the opportunities you join, your
                content submissions, and the reward ledger that results.
              </p>
            </>
          ),
        },
        {
          heading: "About the people you introduce",
          body: (
            <p>
              When you submit a lead you give us a business contact&apos;s name, phone
              and what they need. Only submit a contact who knows you are introducing
              them. We share that contact with the approved provider delivering the
              work, and with nobody else.
            </p>
          ),
        },
        {
          heading: "Why we hold it",
          body: (
            <p>
              To attribute referrals correctly, calculate and pay rewards, verify that
              students and projects are genuine, detect duplicate and fraudulent
              submissions, and send you the opportunity updates you asked for.
            </p>
          ),
        },
        {
          heading: "Messages on WhatsApp",
          body: (
            <p>
              You receive opportunity and earning updates because you asked to.
              You can stop marketing messages at any time by replying STOP, and still
              keep the messages about money you have already earned.
            </p>
          ),
        },
        {
          heading: "Who sees your data",
          body: (
            <p>
              Stormm staff who operate the opportunities and payouts, the named
              provider for a lead you submitted, and the services we use to run the
              platform and send payments. We do not sell your data, and we do not share
              your contact list.
            </p>
          ),
        },
        {
          heading: "Your name and your earnings in public",
          body: (
            <p>
              We ask before publishing your name, your photograph, your earnings or
              anything you said about the platform. If you say no, nothing changes about
              what you can earn.
            </p>
          ),
        },
        {
          heading: "Your choices",
          body: (
            <p>
              You can ask for a copy of what we hold on you, correct it, or ask us to
              delete your account. Records we must keep to show a reward was correctly
              paid are retained for as long as the law requires, and no longer.
            </p>
          ),
        },
      ]}
    />
  );
}
