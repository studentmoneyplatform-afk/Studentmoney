"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/opportunities", label: "Earn" },
  { href: "/how-it-works", label: "Resources", children: [
    { href: "/how-it-works", label: "How it works" },
    { href: "/faqs", label: "FAQ" },
  ] },
  { href: "/about", label: "About" },
  { href: "/faqs", label: "FAQ" },
];

export function SiteHeader({ logo }: { logo?: { src?: string; reversedSrc?: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    setResourcesOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[86rem] items-center gap-6 px-5 py-4 sm:px-8">
        <Logo size={34} src={logo?.src} reversedSrc={logo?.reversedSrc} />

        <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex" aria-label="Main">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            if (item.children) {
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setResourcesOpen(true)}
                  onMouseLeave={() => setResourcesOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setResourcesOpen((v) => !v)}
                    aria-expanded={resourcesOpen}
                    className="flex items-center gap-1.5 py-2 text-[0.9375rem] font-bold text-ink/80 transition-colors hover:text-ink"
                  >
                    {item.label}
                    <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" />
                    </svg>
                  </button>
                  {resourcesOpen && (
                    <div className="absolute left-1/2 top-full w-52 -translate-x-1/2 pt-2">
                      <ul className="overflow-hidden rounded-2xl border border-ink/10 bg-paper p-1.5 shadow-[0_20px_50px_-24px_rgba(18,61,40,0.5)]">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              className="block rounded-xl px-3.5 py-2.5 text-[0.9375rem] font-semibold text-ink/80 transition-colors hover:bg-green-wash hover:text-forest"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-2 text-[0.9375rem] font-bold transition-colors ${
                  active ? "text-forest" : "text-ink/80 hover:text-ink"
                }`}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-forest"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <Link
            href="/dashboard"
            aria-label="Your dashboard"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-forest transition-colors hover:bg-green-wash sm:inline-flex"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M2.5 8.5 12 4l9.5 4.5L12 13 2.5 8.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="M6.5 10.8v4c0 1.8 2.5 3 5.5 3s5.5-1.2 5.5-3v-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </Link>

          <span aria-hidden="true" className="hidden h-6 w-px bg-ink/15 sm:block" />

          <Link
            href="/dashboard"
            className="hidden rounded-full border border-forest/35 px-5 py-2.5 text-[0.9375rem] font-bold text-forest transition-colors hover:border-forest sm:inline-flex"
          >
            Log in
          </Link>
          <Link
            href="/join"
            className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-forest px-4 py-2.5 text-[0.875rem] font-bold text-paper transition-colors hover:bg-forest-deep sm:px-5 sm:text-[0.9375rem]"
          >
            Get Started
            <span aria-hidden="true" className="hidden sm:inline">
              →
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 lg:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              {open ? (
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.7" />
              ) : (
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Main" className="border-t border-ink/10 bg-paper lg:hidden">
          <ul className="mx-auto w-full max-w-[86rem] px-5 py-3 sm:px-8">
            {[
              { href: "/", label: "Home" },
              { href: "/opportunities", label: "Earn" },
              { href: "/how-it-works", label: "How it works" },
              { href: "/about", label: "About" },
              { href: "/faqs", label: "FAQ" },
              { href: "/dashboard", label: "Log in" },
            ].map((item) => (
              <li key={item.label} className="border-b border-ink/8 last:border-0">
                <Link href={item.href} className="block py-3.5 text-lead font-bold">
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <Link
                href="/join"
                className="block rounded-full bg-forest px-5 py-3 text-center font-bold text-paper"
              >
                Get Started
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
