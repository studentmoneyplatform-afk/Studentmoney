import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

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
    "Introduce a business to a project you believe in and earn as the client pays. Every opportunity shows what you do, who pays, and when you get paid.",
  openGraph: {
    title: "StudentMoney — Learn. Connect. Create. Earn.",
    description:
      "Introduce a business to a project you believe in and earn as the client pays.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variables live on <html> so that the --font-display and
    // --font-sans tokens, which Tailwind declares at :root, can resolve them.
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-forest focus:px-5 focus:py-2 focus:text-cream"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
