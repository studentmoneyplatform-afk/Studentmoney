"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Mark } from "@/components/logo";

/**
 * The signed-in chrome: a standing sidebar on a wide screen, a drawer on a
 * phone, and a top bar over both.
 *
 * Every destination here is a page that exists and does something. The design
 * this came from also listed a payouts screen; that one is real, but it says
 * plainly that withdrawals are not open yet, because the rest of the product
 * refuses to show a control that would do nothing.
 */

type NavItem = { href: string; label: string; icon: ReactNode; exact?: boolean };

const ICON = "h-[1.1rem] w-[1.1rem] shrink-0";

const NAV: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    exact: true,
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.5 9.5V20h13V9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.75 20v-5.5h4.5V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/opportunities",
    label: "Opportunities",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M13.5 3c4 1.2 6.4 4.4 7.5 9-4.6 1.1-7.8 3.5-9 7.5-2.6-1-4.4-2.8-5.4-5.4C10.1 10.8 12.5 7.6 13.5 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="14.5" cy="9.5" r="1.9" stroke="currentColor" strokeWidth="2" />
        <path d="M6.5 17.5 3 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/referrals",
    label: "My Referrals",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="2" />
        <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 5.6a3.2 3.2 0 0 1 0 6.3M17.5 14.9c2 .5 3.4 2.2 3.9 4.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/earnings",
    label: "Earnings",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3.5 8.5h13a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M3.5 8.5v-2a2 2 0 0 1 2-2h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="15" cy="14" r="1.4" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/dashboard/payouts",
    label: "Payouts",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="5.5" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="2" />
        <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
        <path d="M6.5 14.5h3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/help",
    label: "Help & Support",
    icon: (
      <svg className={ICON} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2-2.4 3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="17" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
];

const RAIL_KEY = "stormm.sidebar.collapsed";

function isActive(pathname: string, item: NavItem): boolean {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

export function DashboardShell({
  fullName,
  standing,
  attention,
  children,
}: {
  fullName: string;
  /** Shown under the name. Never a status the account has not earned. */
  standing: string;
  /**
   * Something is genuinely waiting on a decision that is not the student's.
   * There is no read-tracking in the schema, so this is never dressed up as
   * "unread" — it clears when the referrals it counts are resolved.
   */
  attention: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Remembered per browser. Wrapped because storage can be unavailable or
  // throw outright in a private window, and a sidebar is not worth an error.
  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(RAIL_KEY) === "1");
    } catch {
      /* leave it open */
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((was) => {
      const next = !was;
      try {
        window.localStorage.setItem(RAIL_KEY, next ? "1" : "0");
      } catch {
        /* the sidebar still works, it just will not be remembered */
      }
      return next;
    });
  }

  // Close the drawer on navigation, so tapping a link does not leave it
  // sitting over the page it just opened.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  return (
    <div data-page="rewards" className="min-h-screen bg-paper-2">
      <div
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity lg:hidden ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[15rem] flex-col bg-forest text-[color:var(--on-dark-1)] transition-[transform,width] duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] lg:translate-x-0 ${
          collapsed ? "lg:w-[5rem]" : ""
        } ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Fixed. The mark stays put while everything under it scrolls. */}
        <div className="flex shrink-0 items-center gap-2.5 border-b border-[color:var(--hair-reversed)] px-4 py-3.5">
          <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5">
            <Mark size={26} tone="reversed" />
            <span
              className={`font-display truncate text-[1.15rem] leading-none ${
                collapsed ? "lg:hidden" : ""
              }`}
            >
              Stormm
            </span>
          </Link>

          <button
            type="button"
            onClick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand the sidebar" : "Collapse the sidebar"}
            title={collapsed ? "Expand the sidebar" : "Collapse the sidebar"}
            className="ml-auto hidden shrink-0 rounded-lg p-1.5 text-[color:var(--on-dark-2)] transition-colors hover:bg-[color:var(--hair-reversed)] hover:text-[color:var(--on-dark-1)] lg:block"
          >
            <svg
              className={`h-[1.05rem] w-[1.05rem] transition-transform duration-300 ${
                collapsed ? "rotate-180" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path d="M14 7 9 12l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* The only part that scrolls. */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <nav aria-label="Dashboard" className="px-3 pt-3">
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const active = isActive(pathname, item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 rounded-[0.8rem] px-3 py-2.5 text-[0.8125rem] font-bold transition-colors ${
                      collapsed ? "lg:justify-center lg:px-0" : ""
                    } ${
                      active
                        ? "bg-green text-forest-deep"
                        : "text-[color:var(--on-dark-2)] hover:bg-[color:var(--hair-reversed)] hover:text-[color:var(--on-dark-1)]"
                    }`}
                  >
                    {item.icon}
                    <span className={`truncate ${collapsed ? "lg:hidden" : ""}`}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto px-3 pb-4 pt-6">
          <div
            className={`rounded-[1.1rem] border border-[color:var(--hair-reversed)] bg-forest-deep p-4 text-center ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            <GiftMark />
            <p className="font-display mt-2.5 text-[0.95rem] leading-tight">
              Refer more.
              <br />
              Earn more.
            </p>
            <p className="mt-1.5 text-micro leading-snug text-[color:var(--on-dark-2)]">
              Invite your friends and unlock bigger rewards.
            </p>
            <Link
              href="/dashboard/opportunities"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green px-3.5 py-1.5 text-micro font-bold text-forest-deep transition-transform hover:scale-[1.03]"
            >
              Share link
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <form action="/auth/signout" method="post" className="mt-3">
            <button
              type="submit"
              title={collapsed ? "Log out" : undefined}
              className={`flex w-full items-center gap-3 rounded-[0.8rem] px-3 py-2.5 text-[0.8125rem] font-bold text-[color:var(--on-dark-2)] transition-colors hover:bg-[color:var(--hair-reversed)] hover:text-[color:var(--on-dark-1)] ${
                collapsed ? "lg:justify-center lg:px-0" : ""
              }`}
            >
              <svg className={ICON} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M14 4.5h3.5a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M10 8.5 6.5 12l3.5 3.5M6.5 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className={collapsed ? "lg:hidden" : ""}>Log out</span>
            </button>
          </form>
        </div>
        </div>
      </aside>

      <div className={collapsed ? "lg:pl-[5rem]" : "lg:pl-[15rem]"}>
        <header className="sticky top-0 z-30 border-b border-[color:var(--hair)] bg-paper/90 backdrop-blur">
          <div className="flex items-center gap-4 px-5 py-3.5 sm:px-7">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-expanded={drawerOpen}
              aria-label="Open menu"
              className="rounded-full border border-[color:var(--hair-strong)] p-2 transition-colors hover:border-[color:var(--ink-1)] lg:hidden"
            >
              <svg className={ICON} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <form action="/dashboard/opportunities" className="hidden min-w-0 flex-1 sm:block">
              <label className="relative block max-w-md">
                <span className="sr-only">Search opportunities</span>
                <svg
                  className="pointer-events-none absolute left-4 top-1/2 h-[1.1rem] w-[1.1rem] -translate-y-1/2 text-[color:var(--ink-3)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
                  <path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  name="q"
                  placeholder="Search opportunities…"
                  className="w-full rounded-full border border-[color:var(--hair-strong)] bg-paper-2 py-2.5 pl-11 pr-4 text-[0.95rem] outline-none transition-colors focus:border-forest"
                />
              </label>
            </form>

            <div className="ml-auto flex items-center gap-3">
              <Link
                href="/dashboard/referrals"
                aria-label={
                  attention
                    ? "Referral activity, some referrals are still being verified"
                    : "Referral activity"
                }
                className="relative rounded-full border border-[color:var(--hair-strong)] p-2.5 transition-colors hover:border-[color:var(--ink-1)]"
              >
                <svg className={ICON} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 3.2.8 4.8 1.6 5.8.4.5 0 1.2-.6 1.2H5.5c-.7 0-1-.7-.6-1.2.8-1 1.6-2.6 1.6-5.8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M10 19.5a2.2 2.2 0 0 0 4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {attention && (
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[color:var(--color-error)] ring-2 ring-[color:var(--color-paper)]" />
                )}
              </Link>

              <UserMenu fullName={fullName} standing={standing} />
            </div>
          </div>
        </header>

        <main id="main" className="px-5 py-6 sm:px-7 sm:py-8">{children}</main>
      </div>
    </div>
  );
}

function UserMenu({ fullName, standing }: { fullName: string; standing: string }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "·";

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 rounded-full border border-[color:var(--hair-strong)] py-1.5 pl-1.5 pr-3 transition-colors hover:border-[color:var(--ink-1)]"
      >
        <span
          aria-hidden="true"
          className="grid h-9 w-9 place-items-center rounded-full bg-forest font-display text-[0.95rem] text-[color:var(--on-dark-1)]"
        >
          {initials}
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-[0.9rem] font-bold">{fullName}</span>
          <span className="block text-micro text-[color:var(--ink-3)]">{standing}</span>
        </span>
        <svg className="h-4 w-4 text-[color:var(--ink-3)]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] w-56 overflow-hidden rounded-[1rem] border border-[color:var(--hair-strong)] bg-paper shadow-[0_24px_60px_-30px_rgba(22,19,15,0.5)]"
        >
          <Link role="menuitem" href="/dashboard/settings" className="block px-4 py-3 text-[0.95rem] font-bold hover:bg-paper-2">
            Settings
          </Link>
          <Link role="menuitem" href="/dashboard/help" className="block px-4 py-3 text-[0.95rem] font-bold hover:bg-paper-2">
            Help &amp; support
          </Link>
          <form action="/auth/signout" method="post" className="border-t border-[color:var(--hair)]">
            <button role="menuitem" type="submit" className="w-full px-4 py-3 text-left text-[0.95rem] font-bold hover:bg-paper-2">
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function GiftMark() {
  return (
    <svg className="mx-auto h-8 w-8 text-green" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="9.5" width="17" height="10.5" rx="1.6" stroke="currentColor" strokeWidth="2" />
      <path d="M2.5 9.5h19M12 9.5V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 9.5S10.8 5 8.6 5a2.1 2.1 0 0 0 0 4.5M12 9.5S13.2 5 15.4 5a2.1 2.1 0 0 1 0 4.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
