import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getBrandLogo } from "@/lib/brand";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://studentmoney.ng"),
  title: {
    default: "StudentMoney — Learn. Connect. Create. Earn.",
    template: "%s · StudentMoney",
  },
  description:
    "Nine ways for Nigerian students to earn before graduation — referrals, freelance gigs, content, tutoring and more. Every opportunity says who pays, how much, and when.",
  openGraph: {
    title: "StudentMoney — Learn. Connect. Create. Earn.",
    description:
      "Nine ways for Nigerian students to earn before graduation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const logo = getBrandLogo();

  return (
    // The font variables live on <html> so that the --font-display and
    // --font-sans tokens, which Tailwind declares at :root, can resolve them.
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-forest focus:px-5 focus:py-2 focus:text-[color:var(--on-dark-1)]"
        >
          Skip to content
        </a>
        <SiteHeader logo={logo} />
        <main id="main">{children}</main>
        <SiteFooter logo={logo} />
      </body>
    </html>
  );
}
