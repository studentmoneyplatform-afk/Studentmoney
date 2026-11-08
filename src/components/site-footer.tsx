import Link from "next/link";
import { Logo } from "@/components/logo";
import { FinePrint } from "@/components/ui";

const COLUMNS = [
  {
    heading: "Earn",
    links: [
      { href: "/opportunities", label: "Explore opportunities" },
      { href: "/opportunities/software-referrals", label: "Software referrals" },
      { href: "/opportunities/dare-company-global", label: "DARE Company Global" },
      { href: "/opportunities/tobi-music-academy", label: "Tobi Music Academy" },
    ],
  },
  {
    heading: "Understand it",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/about", label: "About" },
      { href: "/faqs", label: "FAQs" },
      { href: "/join", label: "Join free" },
    ],
  },
  {
    heading: "More",
    links: [
      { href: "/marketplace", label: "Marketplace" },
      { href: "/for-businesses", label: "For businesses" },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export function SiteFooter({ logo }: { logo?: { src?: string; reversedSrc?: string } }) {
  return (
    <footer className="bg-forest text-[color:var(--on-dark-1)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo tone="reversed" size={30} src={logo?.src} reversedSrc={logo?.reversedSrc} />
            <p className="mt-4 max-w-xs text-[0.9375rem] text-[color:var(--on-dark-1)]/80">
              Learn. Connect. Create. Earn.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h2 className="eyebrow text-[color:var(--on-dark-1)]/60">{col.heading}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.9375rem] text-[color:var(--on-dark-1)]/90 underline-offset-4 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[color:var(--hair-reversed)] pt-6">
          <FinePrint tone="reversed">
            Rewards are paid as qualifying client payments clear. Amounts shown are
            campaign maximums, not guaranteed income, and every campaign publishes the
            rules that apply to it. Naira figures are indicative and follow the rate
            posted on this site.
          </FinePrint>
          <FinePrint tone="reversed">
            © {new Date().getFullYear()} StudentMoney.
          </FinePrint>
        </div>
      </div>
    </footer>
  );
}
