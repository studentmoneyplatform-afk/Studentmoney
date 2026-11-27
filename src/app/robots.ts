import type { MetadataRoute } from "next";

const BASE = "https://studentmoney-beta.vercel.app";

/**
 * The signed-in areas are already behind a server-side guard, so this is not
 * a security measure — it keeps crawlers from spending their budget on pages
 * that will only ever redirect them, and keeps personal referral links out of
 * search results.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/admin", "/welcome", "/invite/", "/auth/", "/r/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
