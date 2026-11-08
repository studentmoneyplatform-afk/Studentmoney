"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/referrals", label: "Review queue" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/opportunities", label: "Opportunities" },
  { href: "/admin/audit", label: "Audit log" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin">
      <ul className="-mb-px flex gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const active =
            tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href);
          return (
            <li key={tab.href} className="shrink-0">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`inline-block whitespace-nowrap border-b-2 px-4 py-3 text-caption font-bold transition-colors ${
                  active
                    ? "border-money-soft text-[color:var(--on-dark-1)]"
                    : "border-transparent text-[color:var(--on-dark-3)] hover:text-[color:var(--on-dark-1)]"
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
