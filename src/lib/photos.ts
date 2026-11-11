/**
 * Stand-in photography, curated from Unsplash.
 *
 * These fill the slots until Stormm has photographs of its own
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
    url: "https://images.unsplash.com/photo-1758270705518-b61b40527e76",
    credit: unsplash("Vitaly Gariev", "vitalygariev"),
  },
  "/photos/hero-student-2.jpg": {
    url: "https://images.unsplash.com/photo-1620829813573-7c9e1877706f",
    credit: unsplash("Kojo Kwarteng", "kojokwarteng"),
  },
  "/photos/hero-student-3.jpg": {
    url: "https://images.unsplash.com/photo-1528980917907-8df7f48f6f2a",
    credit: unsplash("Andre Hunter", "dre0316"),
  },
  "/photos/track-referral.jpg": {
    url: "https://images.unsplash.com/photo-1677594334053-afe4b41aa0a3",
    credit: unsplash("The Jopwell Collection", "jopwellcollection"),
  },
  "/photos/track-content.jpg": {
    url: "https://images.unsplash.com/photo-1648301033733-44554c74ec50",
    credit: unsplash("Creab ThePolymath", "creabthepolymath"),
  },
  "/photos/track-gigs.jpg": {
    url: "https://images.unsplash.com/photo-1758270705317-3ef6142d306f",
    credit: unsplash("Vitaly Gariev", "vitalygariev"),
  },
  "/photos/profile-1.jpg": {
    url: "https://images.unsplash.com/photo-1594750852563-5ed8e0421d40",
    credit: unsplash("Nqobile Vundla", "nqobilevundla"),
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

/**
 * Hero video. Free under the Pexels licence; attribution is not required but
 * is given anyway. It is ~6.7MB, so nothing fetches it until a viewer
 * presses play — see HeroVideo.
 */
export const HERO_VIDEO = {
  src: "https://videos.pexels.com/video-files/9198421/9198421-hd_1920_1080_25fps.mp4",
  credit: "Mikhail Nilov / Pexels",
  label: "A student working on a laptop in class",
};
