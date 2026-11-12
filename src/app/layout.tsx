import type { Metadata } from "next";
import { Caveat, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

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
    "Stormm helps students, graduates and freelancers turn their network into real money through simple referrals. Three opportunities, each with its own reward and its own rules.",
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
  return (
    // The font variables live on <html> so that the --font-display and
    // --font-sans tokens, which Tailwind declares at :root, can resolve them.
    // data-scroll-behavior keeps Next honouring the smooth scrolling set in
    // globals.css, which the legal pages' section index relies on.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${caveat.variable} ${jakarta.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
