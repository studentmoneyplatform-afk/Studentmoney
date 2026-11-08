import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Button, Card, Chip, Eyebrow, FinePrint, H2, Lede, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Student profiles",
  description:
    "A profile built from work you actually delivered — verified university, real ratings, and a record of every completed job.",
};

const PROOF = [
  {
    title: "Your university, confirmed",
    body: "Not a field you typed. We verify it, because a buyer deciding between two strangers deserves at least one fact that is checked.",
  },
  {
    title: "Ratings from completed jobs only",
    body: "No rating without a job. No job without a brief. You cannot buy, farm or trade your way to a good profile here.",
  },
  {
    title: "Earnings you can show, privately",
    body: "Your ledger is yours. You choose whether a buyer sees your total earned, and you can show it without showing who paid it.",
  },
  {
    title: "Work samples attached to real briefs",
    body: "Each sample is tied to the job it came from, so a portfolio piece is evidence rather than a claim.",
  },
];

export default function StudentsPage() {
  return (
    <div data-page="students">
      <PageHero
        eyebrow="Student profiles"
        lines={[
          "A CV that actually",
          <span key="l2" className="italic accent-text">proves something.</span>,
        ]}
        lede="Anyone can write hardworking and detail-oriented on a CV. Nobody can fake twelve delivered jobs, a verified university and ratings from the people who paid. That is what a StudentMoney profile is."
        actions={
          <>
            <Button href="/join" size="lg">Build your profile</Button>
            <Button href="/marketplace" variant="ghost" size="lg">See the marketplace</Button>
          </>
        }
        photo={{
          src: "/photos/profile-1.jpg",
          alt: "Portrait of a StudentMoney member",
          brief: "Portrait, plain background, confident",
          ratio: "4/5",
        }}
      />

      <Section tone="paper-2">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
          <Reveal>
            <div>
              <H2 className="max-w-md">Four things on your profile that cannot be faked.</H2>
              <Lede className="mt-5">
                By the time you graduate, this is worth more than the certificate in
                the conversations that matter.
              </Lede>
            </div>
          </Reveal>

          <div className="space-y-4">
            {PROOF.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <Card>
                  <h3 className="font-display text-h3">{p.title}</h3>
                  <p className="mt-2.5 text-[color:var(--ink-2)]">{p.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Profile anatomy */}
      <Section>
        <Reveal>
          <Eyebrow>What a profile looks like</Eyebrow>
          <H2 className="mt-4 max-w-2xl">Built from work, not from adjectives.</H2>
        </Reveal>

        <Reveal delay={100}>
          <Card className="mt-12 overflow-hidden p-0">
            <div className="bg-forest px-6 py-8 text-[color:var(--on-dark-1)] sm:px-10">
              <div className="flex flex-wrap items-center gap-5">
                <span
                  aria-hidden="true"
                  className="grid h-16 w-16 place-items-center rounded-full bg-cream font-display text-[1.75rem] text-forest"
                >
                  A
                </span>
                <div>
                  <p className="font-display text-[1.75rem]">Your name here</p>
                  <p className="text-[color:var(--on-dark-2)]">
                    300 level · Bells University · verified
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-8 px-6 py-8 sm:grid-cols-3 sm:px-10">
              <div>
                <Eyebrow>Skills</Eyebrow>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["Design", "Video", "Copywriting"].map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </div>
              <div>
                <Eyebrow>Jobs delivered</Eyebrow>
                <p className="money mt-3 text-[1.75rem]">12</p>
                <p className="text-caption text-[color:var(--ink-3)]">
                  Every one with a brief behind it
                </p>
              </div>
              <div>
                <Eyebrow>Rating</Eyebrow>
                <p className="money mt-3 text-[1.75rem]">4.8</p>
                <p className="text-caption text-[color:var(--ink-3)]">
                  From buyers who paid
                </p>
              </div>
            </div>

            <div className="border-t border-[color:var(--hair)] px-6 py-6 sm:px-10">
              <FinePrint>
                An illustration of the format. Profiles fill with real work as students
                complete jobs — nothing on a profile is ever written by us.
              </FinePrint>
            </div>
          </Card>
        </Reveal>
      </Section>

      <Section tone="paper-2" width="narrow" className="text-center">
        <Reveal>
          <H2>Start building it now, while you still have time between lectures.</H2>
          <div className="mt-9 flex justify-center">
            <Button href="/join" size="lg">
              Create your profile free
            </Button>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}
