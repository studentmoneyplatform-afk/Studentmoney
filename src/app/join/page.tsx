import type { Metadata } from "next";
import { SignupForm } from "@/components/signup-form";
import { GoogleButton } from "@/components/google-button";
import { Money } from "@/components/money";
import { Card, Eyebrow, FinePrint, H2, Lede, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Join StudentMoney. Campaigns, lessons and earning updates arrive on WhatsApp.",
};

const WHAT_HAPPENS = [
  "A welcome message that explains exactly how this works.",
  "The campaigns that are live, with the reward and the rules on each.",
  "Your own referral link when you are ready to use one.",
  "A short sales lesson each week that you can use the same day.",
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
            {isBusiness ? "For businesses" : "Join StudentMoney"}
          </Eyebrow>
          <h1 className="font-display mt-5 text-[2.5rem] leading-[1.05] sm:text-[3.25rem]">
            {isBusiness
              ? "Tell us what you need built."
              : "One introduction is all it takes to start."}
          </h1>
          <Lede className="mt-6 text-[color:var(--on-dark-1)]/90">
            {isBusiness
              ? "Tell us about the work you deliver and the customers you want. We will come back to you about running a campaign."
              : "Campaigns, lessons and earning updates arrive on WhatsApp. Joining is free, and you decide which campaigns you take."}
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
                    Per qualifying project, released as the client pays. Terms apply.
                  </FinePrint>
                </div>
              </Card>

              <div className="mt-10">
                <H2 className="text-[1.75rem]">What arrives after you join</H2>
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
            {isBusiness ? "Talk to us about a campaign" : "Join the network"}
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
              label={isBusiness ? "Send this to the team" : "Message me on WhatsApp"}
            />
          </div>
        </Card>
      </div>
    </Section>
  );
}
