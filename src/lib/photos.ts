/**
 * Stand-in photography, curated from Unsplash.
 *
 * These fill the slots until StudentMoney has photographs of its own
 * students. A local file always wins: drop `hero-student-1.jpg` into
 * /public/photos and it replaces the stock shot, credit and all, with no
 * code change. That is the intended path — real students will do more for
 * trust than any stock library.
 *
 * Unsplash's licence requires crediting the photographer and Unsplash, so
 * every entry carries its credit and Figure renders it.
 */

export type Credit = { photographer: string; href: string };

export type CuratedPhoto = {
  /** The images.unsplash.com id, without query parameters. */
  url: string;
  credit: Credit;
};

const unsplash = (photographer: string, handle: string): Credit => ({
  photographer,
  href: `https://unsplash.com/@${handle}`,
});

/** Keyed by the local path a slot asks for. */
export const CURATED: Record<string, CuratedPhoto> = {
  "/photos/hero-student-1.jpg": {
    url: "https://images.unsplash.com/photo-1687422808424-4a8e78fa6ae8",
    credit: unsplash("Ali Mkumbwa", "mkumbwa"),
  },
  "/photos/hero-student-2.jpg": {
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998",
    credit: unsplash("Headway", "headwayio"),
  },
  "/photos/hero-student-3.jpg": {
    url: "https://images.unsplash.com/photo-1764013003044-6b52d85995f4",
    credit: unsplash("Ben Iwara", "beniwara"),
  },
  "/photos/track-referral.jpg": {
    url: "https://images.unsplash.com/photo-1761370571806-886404629697",
    credit: unsplash("Muhammad-Taha Ibrahim", "m_taha"),
  },
  "/photos/track-content.jpg": {
    url: "https://images.unsplash.com/photo-1659362768558-fcdc835e04d1",
    credit: unsplash("Lukas Menke", "lukasmenke"),
  },
  "/photos/track-gigs.jpg": {
    url: "https://images.unsplash.com/photo-1694175271713-a6e2cc378980",
    credit: unsplash("Seth Ebenezer Tetteh", "sethebenezer"),
  },
  "/photos/profile-1.jpg": {
    url: "https://images.unsplash.com/photo-1546525848-3ce03ca516f6",
    credit: unsplash("Mubarak Showole", "mubarakshowole"),
  },
};

/**
 * Builds the delivery URL. Unsplash resizes and re-encodes on their CDN, so
 * asking for the width actually needed keeps a hero photo well under a
 * megabyte on a Nigerian mobile connection.
 */
export function unsplashSrc(url: string, width: number, ratio: string): string {
  const [w, h] = ratio.split("/").map(Number);
  const height = Math.round((width * h) / w);
  const params = new URLSearchParams({
    auto: "format",
    fit: "crop",
    crop: "faces,entropy",
    w: String(width),
    h: String(height),
    q: "70",
  });
  return `${url}?${params.toString()}`;
}

export function getCurated(path: string | undefined): CuratedPhoto | undefined {
  return path ? CURATED[path] : undefined;
}
