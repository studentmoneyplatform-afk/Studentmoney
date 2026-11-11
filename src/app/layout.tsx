import type { Metadata } from "next";
import { Caveat, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getBrandLogo } from "@/lib/brand";

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});


const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stormm.ng"),
  title: {
    default: "Stormm — Earn. Refer. Grow.",
    template: "%s · Stormm",
  },
  description:
    "Stormm helps students turn their network into real money through simple referrals. Three opportunities, each with its own reward and its own rules.",
  openGraph: {
    title: "Stormm — Earn. Refer. Grow.",
    description:
      "Turn your network into real money through simple referrals.",
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
    <html lang="en" className={`${caveat.variable} ${jakarta.variable}`}>
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
