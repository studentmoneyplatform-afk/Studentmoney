import type { Metadata } from "next";
import { Money } from "@/components/money";
import { Button, Card, Eyebrow, FinePrint, H2, Lede, Section } from "@/components/ui";
import { PROJECT_REWARD_USD } from "@/lib/rewards";
import { formatUsd } from "@/lib/money";

export const metadata: Metadata = {
  title: "Opportunities",
  description:
    "Referral campaigns, paid video campaigns, sales lessons and weekly challenges. Each one states what you do, who pays and when.",
};

const PROJECT_TYPES = [
  "Websites and landing pages",
  "AI-powered tools",
  "Machine-learning projects",
  "Custom software",
  "Business automation",
  "Other approved commercial work",
];

const VIDEO_BRIEF = [
  "The format and the length",
  "Where it will be published",
  "The submission deadline",
  "Quality and originality requirements",
  "Whether you must post it, or submitting is enough",
  "Who owns the content and how it may be used",
];

const LESSONS = [
  "Finding prospective customers",
  "Understanding what a customer actually needs",
  "Writing a message someone replies to",
  "Presenting what a service is worth",
  "Handling objections without arguing",
  "Following up without becoming a nuisance",
  "Making a marketing video that holds attention",
  "Negotiation and professional communication",
];

export default function OpportunitiesPage() {
  return (
    <>
      <Section tone="forest">
        <Eyebrow tone="accent">Opportunities</Eyebrow>
        <h1 className="font-display mt-5 max-w-4xl text-[2.5rem] leading-[1.05] sm:text-[3.25rem]">
          Four ways to earn, and to get better at earning.
        </h1>
        <Lede className="mt-6 text-cream/90">
          Campaigns reach you on WhatsApp. Every one of them carries its own brief, its
          own rules and its own reward.
        </Lede>
      </Section>

      {/* Referrals */}
      <Section tone="cream" id="referrals">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-start">
          <div>
            <Eyebrow>01 · Referral campaigns</Eyebrow>
            <H2 className="mt-4">Introduce a business. Earn as the client pays.</H2>
            <Lede className="mt-5 text-ink/80">
              Businesses need customers. You know people who need real work done. A
              referral campaign pays you for the introductions that turn into paid
              projects.
            </Lede>
            <p className="mt-6 text-ink/80">
              The work is delivered by an approved provider. You make the introduction,
              submit the lead, and your ledger moves as the client pays.
            </p>
            <div className="mt-8">
              <Button href="/rewards" variant="outline">
                See the reward rules
              </Button>
            </div>
          </div>

          <Card tone="raised">
            <Eyebrow>What gets referred</Eyebrow>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {PROJECT_TYPES.map((type) => (
                <li key={type} className="border-b border-ink/10 pb-3 text-ink/85">
                  {type}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-ink/80">Standard reward</span>
              <Money usd={PROJECT_REWARD_USD} size="sm" tone="earned" />
            </div>
            <div className="mt-3">
              <FinePrint>
                Per qualifying project, released proportionally as cleared client
                payments come in. Duplicate and fraudulent referrals are excluded.
              </FinePrint>
            </div>
          </Card>
        </div>
      </Section>

      {/* Videos */}
      <Section tone="raised" id="videos">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <Card tone="forest" className="lg:order-2">
            <Eyebrow tone="accent">Every video brief states</Eyebrow>
            <ul className="mt-5 space-y-3">
              {VIDEO_BRIEF.map((item) => (
                <li
                  key={item}
                  className="border-b border-[color:var(--color-rule-reversed)] pb-3 text-cream/90"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <div>
            <Eyebrow>02 · Paid video campaigns</Eyebrow>
            <H2 className="mt-4">Make the content. Get paid on approval.</H2>
            <Lede className="mt-5 text-ink/80">
              Some campaigns pay for approved promotional videos, product demos, or a
              testimonial based on something you have genuinely used.
            </Lede>
            <p className="mt-6 text-ink/80">
              A campaign may offer{" "}
              <span className="font-bold">{formatUsd(PROJECT_REWARD_USD)}</span> per
              approved video, subject to its published requirements. Video rewards are
              separate from referral rewards, and you are not promised both for the
              same piece of work unless the campaign says so.
            </p>
            <div className="mt-6">
              <FinePrint>
                If a campaign requires you to disclose that a post is promotional, that
                disclosure is part of what gets approved.
              </FinePrint>
            </div>
          </div>
        </div>
      </Section>

      {/* Lessons */}
      <Section tone="cream" id="lessons">
        <Eyebrow>03 · Sales and marketing lessons</Eyebrow>
        <H2 className="mt-4 max-w-3xl">
          The skill is worth more than any single reward.
        </H2>
        <Lede className="mt-5 text-ink/80">
          Short, practical lessons that you apply to a live campaign the same week. No
          theory you cannot use on Monday.
        </Lede>
        <ul className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {LESSONS.map((lesson) => (
            <li key={lesson} className="border-t-2 border-forest pt-3 text-ink/85">
              {lesson}
            </li>
          ))}
        </ul>
      </Section>

      {/* Challenges */}
      <Section tone="forest" id="challenges">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <Eyebrow tone="accent">04 · Weekly challenges</Eyebrow>
            <H2 className="mt-4">Something to aim at, every week.</H2>
            <Lede className="mt-5 text-cream/85">
              Time-bound challenges that reward action and consistency. Leaderboards are
              built on verified outcomes, never on clicks or message volume.
            </Lede>
            <div className="mt-8">
              <Button href="/join" variant="cream">
                Join and get this week&apos;s challenge
              </Button>
            </div>
          </div>

          <Card
            tone="forest"
            className="border border-[color:var(--color-rule-reversed)]"
          >
            <ul className="space-y-4 text-cream/90">
              <li>&ldquo;Three businesses to approach this week.&rdquo;</li>
              <li>
                &ldquo;Learn one sales skill. Apply it to a real opportunity.&rdquo;
              </li>
              <li>
                &ldquo;Create a video. Submit it. Earn when your content meets the
                campaign requirements.&rdquo;
              </li>
            </ul>
            <div className="mt-6">
              <FinePrint tone="reversed">
                Challenge targets are motivational goals, not guarantees. Each challenge
                publishes how many openings exist, who is eligible, and what must happen
                for a reward to be earned.
              </FinePrint>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
