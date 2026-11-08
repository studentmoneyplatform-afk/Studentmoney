"use client";

import { useState } from "react";

/** The student's tracking code, with a copy button that confirms itself. */
export function ReferralLink({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window === "undefined" ? `/r/${code}` : `${window.location.origin}/r/${code}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the code is on screen to type instead.
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <code className="rounded-full bg-[color:var(--hair)] px-4 py-2 font-mono text-caption font-bold tracking-wider">
        {code}
      </code>
      <button
        type="button"
        onClick={copy}
        className="rounded-full border border-[color:var(--hair-strong)] px-4 py-2 text-caption font-bold transition-colors hover:border-[color:var(--ink-1)]"
      >
        {copied ? "Copied" : "Copy link"}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Referral link copied" : ""}
      </span>
    </div>
  );
}
