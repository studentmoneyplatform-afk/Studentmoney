import type { ReactNode } from "react";

/**
 * The icon and tint for each opportunity, in one place so the hero's
 * floating cards and the cards on the opportunity pages cannot drift apart.
 *
 * Keyed by slug. An opportunity added later falls back to the first tint
 * rather than rendering nothing.
 */
export const OPPORTUNITY_ICONS: Record<string, { bg: string; icon: ReactNode }> = {
  "software-referrals": {
    bg: "bg-tint-code",
    icon: (
      <path
        d="M8 7.5 4 12l4 4.5M16 7.5 20 12l-4 4.5M13.5 5l-3 14"
        stroke="#15803d"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  "dare-company-global": {
    bg: "bg-tint-globe",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" stroke="#5b43c7" strokeWidth="1.8" />
        <path
          d="M4 12h16M12 4c2.2 2.3 2.2 13.7 0 16M12 4c-2.2 2.3-2.2 13.7 0 16"
          stroke="#5b43c7"
          strokeWidth="1.8"
        />
      </>
    ),
  },
  "tobi-music-academy": {
    bg: "bg-tint-music",
    icon: (
      <>
        <path d="M9 18V6.5l9-2v11" stroke="#c23b7a" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="6.8" cy="18" r="2.4" stroke="#c23b7a" strokeWidth="1.8" />
        <circle cx="15.8" cy="15.5" r="2.4" stroke="#c23b7a" strokeWidth="1.8" />
      </>
    ),
  },
};
