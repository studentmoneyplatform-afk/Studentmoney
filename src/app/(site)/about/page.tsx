import type { Metadata } from "next";
import { Figure } from "@/components/figure";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Button, Card, Eyebrow, H2, Lede, Section } from "@/components/ui";
import { CtaBand, SectionHead, StatBand } from "@/components/sections";

export const metadata: Metadata = {
  title: "About",
  description:
    "Stormm exists so Nigerian students, graduates and freelancers do not have to wait for a job offer to earn, build commercial skills and take part in the economy.",
};

const PRINCIPLES = [
  {
    title: "Say who pays, and when",
    body: "Every opportunity names the organisation funding it and the point at which money is released. If we cannot answer those two questions, the opportunity does not go live.",
  },
  {
    title: "A click is not a reward",
    body: "Referrals move through verification before anything is owed. We would rather show you an honest pending status than an encouraging number that later disappears.",
  },
  {
    title: "No guaranteed income",
    body: "We do not promise earnings, we do not call any of this passive, and we do not pay for recruitment on its own. Targets are goals with rules attached.",
  },
  {
    title: "Skills outlast rewards",
    body: "Selling, writing, handling a client, following up without being a nuisance — the money is the reason to start, but the skill is what you keep.",
  },
];

export default function AboutPage() {
  return (
    <div data-page="students">
      <PageHero
        eyebrow="About"
        lines={[
          "Earning should not",
          "have to wait for",
          <span key="l3" className="italic text-green-bright">a job offer.</span>,
        ]}
        lede="Stormm is a Nigerian platform where students, graduates and freelancers find legitimate earning opportunities, refer real customers to real businesses, and earn from the network they already have."
        actions={
          <>
            <Button href="/opportunities" size="lg">Explore opportunities</Button>
            <Button href="/join" variant="ghost" size="lg">Create your account</Button>
          </>
        }
        photo={{
          src: "/photos/hero-student-2.jpg",
          alt: "Two students working together",
          brief: "Two students, one laptop, laughing",
          ratio: "4/5",
        }}
      />

      <Section tone="paper-2">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal>
            <div>
              <Eyebrow>Why we exist</Eyebrow>
              <H2 className="mt-4">Value before the certificate.</H2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="space-y-5 text-lead leading-relaxed text-[color:var(--ink-2)]">
              <p>
                Businesses need customers. Students, graduates and freelancers have
                networks, creativity, communities and access to people who genuinely need
                useful products and services. Stormm connects those two sides and pays
                you for the introductions that work out.
              </p>
              <p>
                We are creating opportunities for young people to earn, build business
                and marketing skills, grow in confidence, and take part in the economy,
                whether they are still studying, newly graduated or working for themselves.
              </p>
              <p className="font-bold text-ink">
                Nobody should have to wait for a job offer to start creating value,
                earning income and building their future.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>How we hold ourselves</Eyebrow>
          <H2 className="mt-4 max-w-2xl">Four rules we do not bend.</H2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <Card className="h-full">
                <h3 className="font-display text-h3">{p.title}</h3>
                <p className="mt-3 text-[color:var(--ink-2)]">{p.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="paper">
        <SectionHead
          script="Where we are"
          eyebrow="The numbers that are true"
          title="Small, deliberate, and honest about it."
          lede="We would rather open with a handful of opportunities that pay than a long list that does not. These are the only figures we quote, because they are the only ones we can stand behind."
        />
        <div className="mt-12">
          <StatBand
            items={[
              { value: "3", label: "live opportunities, each with published rules" },
              { value: "5", label: "stages every referral passes before a reward" },
              { value: "100%", label: "of rewards paid on verified referrals only" },
              { value: "0", label: "guarantees of income, now or ever" },
            ]}
          />
        </div>
      </Section>

      <Section tone="paper-2">
        <CtaBand
          eyebrow="Get started"
          title="Three opportunities are open now."
          body="Create your account, choose the one that fits the people you already know, and get your referral link today."
          primary={{ href: "/join", label: "Create your account" }}
          secondary={{ href: "/opportunities", label: "Explore opportunities" }}
          note="Joining is free. Rewards are paid on referrals that have been verified and approved."
        />
      </Section>

      <Section tone="forest">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal>
            <div>
              <Eyebrow tone="reversed">Where we are</Eyebrow>
              <H2 className="mt-4">Starting on Nigerian campuses.</H2>
              <Lede tone="reversed" className="mt-5">
                We are opening with a small number of trustworthy partners and proving
                the reward economics before opening the platform to everyone. Bells,
                McPherson and OOU first, WhatsApp as the main channel.
              </Lede>
              <div className="mt-8">
                <Button href="/join" variant="light">Join the first group</Button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Figure
              src="/photos/track-content.jpg"
              alt="A student working on campus"
              brief="Student creating content"
              ratio="3/2"
            />
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
