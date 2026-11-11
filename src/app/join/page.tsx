import type { Metadata } from "next";
import { SignupForm } from "@/components/signup-form";
import { GoogleButton } from "@/components/google-button";
import { Money } from "@/components/money";
import { Card, Eyebrow, FinePrint, H2, Lede, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Create your Stormm account and start on any of the three opportunities.",
};

const WHAT_HAPPENS = [
  "A welcome message that explains exactly how this works.",
  "The three opportunities, with the reward and the rules on each.",
  "Your own referral link when you are ready to use one.",
  "Updates when a referral moves stage, and when a reward is approved.",
];

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ as?: string; error?: string }>;
}) {
  const params = await searchParams;
  const isBusiness = params.as === "business";
  const signInError = params.error;

  return (
    <Section tone="forest">
      <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div>
          <Eyebrow tone="reversed">
            {isBusiness ? "For businesses" : "Join Stormm"}
          </Eyebrow>
          <h1 className="font-display mt-5 text-[2.5rem] leading-[1.05] sm:text-[3.25rem]">
            {isBusiness
              ? "Tell us what you need built."
              : "Three ways to earn. One account."}
          </h1>
          <Lede className="mt-6 text-[color:var(--on-dark-1)]/90">
            {isBusiness
              ? "Tell us about the work you deliver and the customers you want. We will come back to you."
              : "Joining is free. Pick one of the three opportunities, or run all three, and your progress appears on your dashboard."}
          </Lede>

          {!isBusiness && (
            <>
              <Card
                tone="forest"
                className="mt-10 border border-[color:var(--hair-reversed)]"
              >
                <Eyebrow tone="reversed">The standard referral reward</Eyebrow>
                <div className="mt-4">
                  <Money usd={25} size="lg" tone="earned-reversed" />
                </div>
                <div className="mt-5">
                  <FinePrint tone="reversed">
                    Per approved referral on Software Service Referrals. Terms apply.
                  </FinePrint>
                </div>
              </Card>

              <div className="mt-10">
                <H2 className="text-[1.75rem]">What happens after you join</H2>
                <ul className="mt-5 space-y-3">
                  {WHAT_HAPPENS.map((item) => (
                    <li
                      key={item}
                      className="border-b border-[color:var(--hair-reversed)] pb-3 text-[color:var(--on-dark-1)]/90"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <Card tone="forest" className="border border-[color:var(--hair-reversed)]">
          <h2 className="font-display text-h3">
            {isBusiness ? "Talk to us" : "Create your account"}
          </h2>

          {signInError && (
            <p
              role="alert"
              className="mt-5 rounded-2xl bg-error px-4 py-3 font-bold text-[color:var(--on-dark-1)]"
            >
              Sign-in did not complete: {signInError}
            </p>
          )}

          {!isBusiness && (
            <div className="mt-6">
              <GoogleButton label="Sign up with Google" />
              <div className="mt-7 flex items-center gap-4">
                <span className="h-px flex-1 bg-[color:var(--hair-reversed)]" />
                <span className="eyebrow text-[color:var(--on-dark-1)]/60">or leave your number</span>
                <span className="h-px flex-1 bg-[color:var(--hair-reversed)]" />
              </div>
            </div>
          )}

          <div className="mt-6">
            <SignupForm
              audience={isBusiness ? "business" : "student"}
              label={isBusiness ? "Send this to the team" : "Message me on WhatsApp instead"}
            />
          </div>
        </Card>
      </div>
    </Section>
  );
}
