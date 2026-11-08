"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/opportunities", label: "My opportunities" },
  { href: "/dashboard/referrals", label: "My referrals" },
  { href: "/dashboard/earnings", label: "My earnings" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard" className="border-b border-[color:var(--hair)]">
      {/* Scrolls horizontally on a phone rather than wrapping into a stack. */}
      <ul className="-mb-px flex gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const active =
            tab.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(tab.href);
          return (
            <li key={tab.href} className="shrink-0">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`inline-block whitespace-nowrap border-b-2 px-4 py-3 text-caption font-bold transition-colors ${
                  active
                    ? "border-forest text-forest"
                    : "border-transparent text-[color:var(--ink-3)] hover:text-ink"
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
