import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Looks for the brand artwork on disk. Server-only: the header and footer are
 * client components, so this must never be imported into them — the layout
 * resolves it once and passes the result down as plain strings.
 *
 * Drop files into /public/brand:
 *   logo.png           used on light grounds
 *   logo-reversed.png  optional, used on the deep green sections
 */
export type BrandLogo = { src?: string; reversedSrc?: string };

export function getBrandLogo(): BrandLogo {
  const find = (file: string) =>
    existsSync(join(process.cwd(), "public", file)) ? file : undefined;

  const src = find("/brand/logo.png") ?? find("/brand/logo.svg");
  const reversedSrc =
    find("/brand/logo-reversed.png") ?? find("/brand/logo-reversed.svg") ?? src;

  return { src, reversedSrc };
}
