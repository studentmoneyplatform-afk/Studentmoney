import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 produces a folder of plain HTML in /out that can be dragged
 * onto Netlify. It exists for showing the marketing site to people before the
 * backend is hosted anywhere.
 *
 * The export cannot include anything that needs a server: the signup action,
 * the auth routes, the dashboard or the middleware. `npm run export:demo`
 * moves those aside first and puts them back afterwards.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export",
        // Netlify serves /path/ as /path/index.html, so emit directories.
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
