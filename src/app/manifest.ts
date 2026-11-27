import type { MetadataRoute } from "next";

/**
 * Makes the site installable on an Android home screen, which is where most
 * of this audience is. The colours are the brand's own, sampled from the
 * supplied logo.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MirusEarn — Earn. Refer. Grow.",
    short_name: "MirusEarn",
    description:
      "Turn your network into real money through simple referrals. Three opportunities, each with its own reward and its own rules.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf6ec",
    theme_color: "#123d28",
    icons: [
      { src: "/brand/mark.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
