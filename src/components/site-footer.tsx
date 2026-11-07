import Link from "next/link";
import { Logo } from "@/components/logo";
import { FinePrint } from "@/components/ui";

const COLUMNS = [
  {
    heading: "For students",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/opportunities", label: "Opportunities" },
      { href: "/rewards", label: "Rewards and payouts" },
      { href: "/join", label: "Join StudentMoney" },
    ],
  },
  {
    heading: "For businesses",
    links: [
      { href: "/for-businesses", label: "Run a campaign" },
      { href: "/for-businesses#providers", label: "Become a provider" },
    ],
  },
  {
    heading: "The rules",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-forest text-cream">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo tone="reversed" size={30} />
            <p className="mt-4 max-w-xs text-[0.9375rem] text-cream/80">
              Learn. Connect. Create. Earn.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h2 className="eyebrow text-cream/60">{col.heading}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.9375rem] text-cream/90 underline-offset-4 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[color:var(--color-rule-reversed)] pt-6">
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
