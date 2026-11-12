import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getBrandLogo } from "@/lib/brand";

/**
 * The public site's chrome.
 *
 * It lives here rather than in the root layout so the signed-in areas can
 * stand on their own: the dashboard and the staff console carry their own
 * navigation, and the marketing header above them would be two navigations
 * arguing about where the reader is.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const logo = getBrandLogo();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-forest focus:px-5 focus:py-2 focus:text-[color:var(--on-dark-1)]"
      >
        Skip to content
      </a>
      <SiteHeader logo={logo} />
      <main id="main">{children}</main>
      <SiteFooter logo={logo} />
    </>
  );
}
