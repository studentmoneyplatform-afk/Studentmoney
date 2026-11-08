/**
 * What a student can actually do here.
 *
 * This is the product's spine: the marketing pages, the marketplace and the
 * dashboard all read it, so a track cannot exist in one place and be missing
 * from another. Every track states how the money arrives, because the brand
 * rule is that an opportunity always says who pays and when.
 */

export type Track = {
  slug: string;
  /** A verb phrase. What you do, not a feature name. */
  title: string;
  blurb: string;
  /** Plain words: how payment actually reaches the student. */
  paid: string;
  examples: string[];
  /** Shipped at launch, or named honestly as still coming. */
  status: "live" | "soon";
};

export const TRACKS: Track[] = [
  {
    slug: "referrals",
    title: "Refer a business",
    blurb:
      "You know a shop, a church, a salon, a startup that needs a website or software built. Introduce them to an approved provider and earn as the client pays.",
    paid: "Up to $25 per qualifying project, released as client payments clear.",
    examples: ["Websites", "AI tools", "Custom software", "Business automation"],
    status: "live",
  },
  {
    slug: "content",
    title: "Make content brands pay for",
    blurb:
      "Short videos, product demos, campus skits, honest reviews of things you actually use. Shoot to a published brief, get paid when it is approved.",
    paid: "A fixed fee per approved piece, stated in the brief before you shoot.",
    examples: ["TikTok and Reels", "Product demos", "Testimonials", "Campus skits"],
    status: "live",
  },
  {
    slug: "gigs",
    title: "Sell a skill you already have",
    blurb:
      "List what you can do and let businesses hire you directly. You set the price, you keep the client, we handle attribution and getting you paid.",
    paid: "You are paid per gig at the price you set, minus a stated platform fee.",
    examples: ["Design", "Video editing", "Writing", "Web building", "Voice-over"],
    status: "live",
  },
  {
    slug: "tutoring",
    title: "Teach what you are good at",
    blurb:
      "You passed that course. Someone a year behind you is struggling with it. Tutor one-to-one or run a small group before exams.",
    paid: "Per session or per group, agreed before the first class.",
    examples: ["Course tutoring", "Past questions", "Exam prep", "Practicals"],
    status: "live",
  },
  {
    slug: "ambassador",
    title: "Represent a brand on campus",
    blurb:
      "Run activations, hand out samples, build a street team, get a brand into your hall. The most visible students earn the most here.",
    paid: "A campaign fee plus performance bonuses, both published up front.",
    examples: ["Activations", "Street teams", "Event hosting", "Sampling"],
    status: "live",
  },
  {
    slug: "micro-tasks",
    title: "Do short paid tasks",
    blurb:
      "Research, data labelling, app testing, transcription, surveys that are actually real. Small amounts, but they add up between lectures.",
    paid: "Per completed task, approved within a stated window.",
    examples: ["Data labelling", "App testing", "Transcription", "Field research"],
    status: "live",
  },
  {
    slug: "academy",
    title: "Learn the thing that pays more",
    blurb:
      "Short, practical lessons on selling, writing, design and getting clients. Finish a track, unlock the campaigns that need that skill.",
    paid: "Free to learn. Completing a track opens higher-paying campaigns.",
    examples: ["Sales", "Copywriting", "Design basics", "Client handling"],
    status: "live",
  },
  {
    slug: "challenges",
    title: "Enter a weekly challenge",
    blurb:
      "Time-boxed goals with a published prize pool. Leaderboards are built on verified outcomes, never on clicks or message volume.",
    paid: "A published prize pool, split by verified result.",
    examples: ["Referral sprints", "Content races", "Team bounties"],
    status: "live",
  },
  {
    slug: "internships",
    title: "Get placed for real work",
    blurb:
      "Businesses that keep hiring students through the marketplace get first access to interns and junior hires. Your track record here is the application.",
    paid: "Paid directly by the employer on their own terms.",
    examples: ["Internships", "Junior roles", "Contract work"],
    status: "soon",
  },
];

export const LIVE_TRACKS = TRACKS.filter((t) => t.status === "live");

export type Category = { slug: string; name: string; blurb: string };

/** Marketplace service categories — what a student can list. */
export const CATEGORIES: Category[] = [
  { slug: "design", name: "Design", blurb: "Logos, flyers, social media, decks, brand kits." },
  { slug: "web", name: "Web & apps", blurb: "Landing pages, portfolios, small business sites, fixes." },
  { slug: "video", name: "Video", blurb: "Editing, subtitles, reels, event coverage, motion graphics." },
  { slug: "writing", name: "Writing", blurb: "Copy, captions, blog posts, proposals, CVs." },
  { slug: "social", name: "Social media", blurb: "Content calendars, posting, community replies, growth." },
  { slug: "photo", name: "Photography", blurb: "Portraits, events, product shots, campus shoots." },
  { slug: "tutoring", name: "Tutoring", blurb: "Course help, exam prep, practicals, project guidance." },
  { slug: "tech", name: "Tech help", blurb: "Setup, troubleshooting, data entry, spreadsheets, automations." },
  { slug: "languages", name: "Languages", blurb: "Yoruba, Hausa, Igbo, Pidgin and French translation and voice." },
  { slug: "events", name: "Events", blurb: "Ushering, hosting, planning, decor, logistics." },
  { slug: "ai", name: "AI work", blurb: "Labelling, prompt writing, model review, dataset cleaning." },
  { slug: "errands", name: "Campus errands", blurb: "Deliveries, queueing, printing, pick-ups between lectures." },
];
