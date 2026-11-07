"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";

const NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/rewards", label: "Rewards" },
  { href: "/for-businesses", label: "For businesses" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-rule)] bg-cream/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Logo size={30} />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-[0.9375rem] font-bold transition-colors ${
                  active ? "text-forest underline underline-offset-8" : "text-ink hover:text-forest"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/join"
            className="hidden rounded-full bg-forest px-5 py-2.5 text-[0.9375rem] font-bold text-cream transition-colors hover:bg-forest-deep sm:inline-flex"
          >
            Join
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex items-center justify-center rounded-full border-2 border-forest px-4 py-2 text-[0.9375rem] font-bold text-forest lg:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-[color:var(--color-rule)] bg-cream lg:hidden"
        >
          <ul className="mx-auto w-full max-w-6xl px-4 py-2 sm:px-6">
            {NAV.concat({ href: "/join", label: "Join StudentMoney" }).map((item) => (
              <li key={item.href} className="border-b border-[color:var(--color-rule)] last:border-0">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 text-body-lg font-bold text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
