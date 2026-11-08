"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";

const NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/opportunities", label: "Ways to earn" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/students", label: "Students" },
  { href: "/for-businesses", label: "For businesses" },
];

export function SiteHeader({ logo }: { logo?: { src?: string; reversedSrc?: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the sheet on navigation and lock the page behind it.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] ${
        scrolled || open
          ? "border-b border-[color:var(--hair)] bg-paper/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center gap-6 px-5 py-3.5 sm:px-8">
        <Logo size={28} src={logo?.src} reversedSrc={logo?.reversedSrc} />

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3.5 py-2 text-caption font-bold transition-colors duration-200 ${
                  active
                    ? "bg-[color:var(--hair)] text-ink"
                    : "text-[color:var(--ink-2)] hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link
            href="/join"
            className="hidden rounded-full px-3.5 py-2 text-caption font-bold text-[color:var(--ink-2)] transition-colors hover:text-ink sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/join"
            className="rounded-full bg-forest px-4 py-2 text-caption font-bold text-[color:var(--on-dark-1)] transition-colors duration-200 hover:bg-forest-deep"
          >
            Join free
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--hair-strong)] lg:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              {open ? (
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" />
              ) : (
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.6" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-[color:var(--hair)] bg-paper lg:hidden"
        >
          <ul className="mx-auto w-full max-w-7xl px-5 py-3 sm:px-8">
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-[color:var(--hair)] last:border-0">
                <Link href={item.href} className="block py-3.5 text-lead font-bold">
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <Link
                href="/join"
                className="block rounded-full bg-forest px-5 py-3 text-center font-bold text-[color:var(--on-dark-1)]"
              >
                Join free
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
