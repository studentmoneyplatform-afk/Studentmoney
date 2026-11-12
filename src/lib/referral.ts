/**
 * Where a referral code lives between the click and the sign-up.
 *
 * It is http-only so no script on the page can read or forge it, and lax so
 * it survives the trip out to Google and back during sign-in. Thirty days is
 * long enough for somebody to think about it over a weekend and short enough
 * that a stale code does not follow a browser around for a year.
 */
export const REFERRAL_COOKIE = "stormm_ref";
export const REFERRAL_COOKIE_MAX_AGE = 30 * 24 * 60 * 60;
