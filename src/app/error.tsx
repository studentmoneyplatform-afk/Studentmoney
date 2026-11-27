"use client";

import { useEffect } from "react";

/**
 * Catches a render or data error anywhere under the root layout.
 *
 * The digest is shown deliberately: it is the only handle a member can quote
 * that ties their report to the server log, and without it "the dashboard
 * broke" is unactionable.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <main className="grid min-h-[70vh] place-items-center bg-paper px-5 py-20">
      <div className="w-full max-w-[34rem] text-center">
        <p className="eyebrow text-forest/70">Something went wrong</p>
        <h1 className="font-display mt-3 text-[clamp(2rem,6vw,2.75rem)] leading-[1.1] text-forest">
          That did not load.
        </h1>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink/70">
          Nothing you have earned is affected — this is a display problem, not a
          change to your referrals. Try again, and if it keeps happening, send us the
          reference below.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center rounded-full bg-forest px-6 py-3 font-bold text-paper transition-colors hover:bg-forest-deep"
          >
            Try again
          </button>
          {/*
            A hard navigation, not <Link>: this boundary renders because
            something already failed, and a client-side transition can land
            straight back in the broken state. A full load clears it.
          */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="inline-flex items-center rounded-full border border-forest/30 px-6 py-3 font-bold text-forest transition-colors hover:border-forest hover:bg-green-wash/60"
          >
            Back home
          </a>
        </div>
        {error.digest && (
          <p className="mt-6 font-mono text-caption text-ink/45">
            Reference: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
