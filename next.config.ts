import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 produces a folder of plain HTML in /out that can be
 * dragged onto Netlify. See scripts/export-demo.mjs.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

/**
 * Production builds write to their own directory.
 *
 * `next build` and `next dev` both default to .next, so running a build
 * while the dev server is up replaced the chunks it had open and every
 * route started failing with "Cannot find module './586.js'". Separate
 * directories mean a build can never break a running dev server.
 */
const isProductionBuild = process.env.NODE_ENV === "production";

/**
 * Only locally, though. A hosted build has no dev server to protect, and
 * Vercel looks for the output in the default .next — point it elsewhere and
 * the deploy fails to find the build.
 */
const isHostedBuild = Boolean(process.env.VERCEL || process.env.CI);

const nextConfig: NextConfig = {
  // Not during a static export: `output: "export"` writes the finished site
  // into distDir, so a custom one lands the HTML somewhere the export script
  // does not expect. Exports keep the default and produce /out.
  distDir:
    isProductionBuild && !isStaticExport && !isHostedBuild ? ".next-build" : ".next",
  ...(isStaticExport
    ? {
        output: "export",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
