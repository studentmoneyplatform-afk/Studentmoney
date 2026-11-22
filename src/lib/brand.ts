/**
 * Where the brand artwork lives.
 *
 * These are plain public paths rather than a filesystem probe: `public/` is
 * served statically but is not reliably present in a serverless function's
 * own filesystem, so an existsSync() check here can come back false in
 * production and silently drop the site back to the text logo.
 *
 *   logo.png           wordmark in forest, for the cream grounds
 *   logo-reversed.png  wordmark in bone, for the deep green sections
 *   mark.png           the tile on its own, for the dashboard rail
 */
export type BrandLogo = { src?: string; reversedSrc?: string };

export function getBrandLogo(): BrandLogo {
  return {
    src: "/brand/logo.png",
    reversedSrc: "/brand/logo-reversed.png",
  };
}
