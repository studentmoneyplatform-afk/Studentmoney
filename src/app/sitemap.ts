import type { MetadataRoute } from "next";
import { getLiveOpportunities } from "@/lib/opportunities-data";

export const dynamic = "force-dynamic";

const BASE = "https://studentmoney-beta.vercel.app";

/**
 * Only pages a stranger can land on and act from.
 *
 * /welcome and /invite/[code] are left out on purpose: the first is a step
 * inside signing up and means nothing without a session, and the second is
 * personal to whoever shared the link — it should not be discoverable by
 * anyone who was not sent it.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const fixed: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/opportunities`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/join`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/faqs`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // The opportunities are the pages worth finding, and they change without a
  // deploy, so they are read rather than listed.
  let live: MetadataRoute.Sitemap = [];
  try {
    const opportunities = await getLiveOpportunities();
    live = opportunities.map((o) => ({
      url: `${BASE}/opportunities/${o.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // A sitemap that is missing three URLs still works; one that 500s does not.
  }

  return [...fixed, ...live];
}
