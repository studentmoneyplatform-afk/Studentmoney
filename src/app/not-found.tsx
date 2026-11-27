import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found" };

/**
 * Shown for any URL that does not resolve — including a referral link whose
 * code has been retired, which is the most likely way a real person lands
 * here. So the copy points at the opportunities rather than apologising.
 */
export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-paper px-5 py-20">
      <div className="w-full max-w-[34rem] text-center">
        <p className="eyebrow text-forest/70">404</p>
        <h1 className="font-display mt-3 text-[clamp(2rem,6vw,2.75rem)] leading-[1.1] text-forest">
          That page has moved on.
        </h1>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink/70">
          The link may be old, or the opportunity behind it may have closed. The three
          live opportunities are always on one page.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 font-bold text-paper transition-colors hover:bg-forest-deep"
          >
            See the opportunities
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-forest/30 px-6 py-3 font-bold text-forest transition-colors hover:border-forest hover:bg-green-wash/60"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
