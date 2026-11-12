"use client";

import { useEffect, useState } from "react";

/**
 * The origin is only known in the browser. Returning the path first and
 * filling the full URL in after mount keeps the server and client markup
 * identical, which a bare `typeof window` check at render time does not.
 */
function useReferralUrl(code: string): { url: string; ready: boolean } {
  const [origin, setOrigin] = useState<string | null>(null);
  useEffect(() => setOrigin(window.location.origin), []);
  return { url: origin ? `${origin}/r/${code}` : `/r/${code}`, ready: origin !== null };
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard access can be refused; the link stays on screen to copy by hand.
    return false;
  }
}

/** The student's tracking code, with a copy button that confirms itself. */
export function ReferralLink({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const { url } = useReferralUrl(code);

  async function copy() {
    const ok = await copyToClipboard(url);
    setCopied(ok);
    if (ok) window.setTimeout(() => setCopied(false), 2000);
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

/**
 * The same link as the headline of a dark panel: the whole URL in view, a
 * copy button beside it, and a share button that hands off to the phone's
 * own share sheet where there is one and copies where there is not.
 */
export function ReferralLinkPanel({ code }: { code: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const { url, ready } = useReferralUrl(code);

  function flash(ok: boolean) {
    setStatus(ok ? "copied" : "failed");
    window.setTimeout(() => setStatus("idle"), 2200);
  }

  async function copy() {
    flash(await copyToClipboard(url));
  }

  async function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Stormm",
          text: "Join through my link and we both get going.",
          url,
        });
        return;
      } catch {
        // Dismissing the sheet lands here too, so fall through to copying
        // rather than reporting a failure that did not happen.
      }
    }
    flash(await copyToClipboard(url));
  }

  return (
    <div>
      <div className="flex items-center gap-2 rounded-full bg-[color:var(--hair-reversed)] py-2 pl-5 pr-2">
        <span className="min-w-0 flex-1 truncate font-mono text-[0.85rem] text-[color:var(--on-dark-1)]">
          {ready ? url : `…/r/${code}`}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy your referral link"
          className="shrink-0 rounded-full bg-forest-deep p-2.5 text-[color:var(--on-dark-1)] transition-transform hover:scale-105"
        >
          <svg className="h-[1.1rem] w-[1.1rem]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="9" y="9" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="2" />
            <path d="M15 6.5A2.5 2.5 0 0 0 12.5 4H6.5A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <button
        type="button"
        onClick={share}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-paper px-5 py-3 font-bold text-forest-deep transition-transform hover:scale-[1.02]"
      >
        <svg className="h-[1.1rem] w-[1.1rem]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="18" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="18" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
          <path d="m8.3 10.8 7.4-4M8.3 13.2l7.4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Share link
      </button>

      <p aria-live="polite" className="mt-2 text-center text-caption text-[color:var(--on-dark-2)]">
        {status === "copied" && "Copied to your clipboard"}
        {status === "failed" && "Could not copy — select the link above instead"}
      </p>
    </div>
  );
}
