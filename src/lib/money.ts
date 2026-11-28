/**
 * Money formatting for MirusEarn.
 *
 * Brand rule: naira beside every dollar. Never show a dollar figure alone.
 *
 * The rate is a posted figure, not a live feed, so that a reward quoted to a
 * student does not drift between the campaign card and the ledger. The cost
 * of that choice is staleness: the naira moves, and a rate left alone for
 * months misquotes every reward on the site just as badly as a wrong one
 * would. So the date it was set is recorded beside it, and the admin console
 * says when it is old enough to need another look.
 */

/** The posted rate. Change both of these together. */
const POSTED_NGN_PER_USD = 1350;
const POSTED_ON = "2026-11-28";

/** Past this, the admin console asks for the rate to be checked. */
export const NGN_RATE_STALE_AFTER_DAYS = 45;

export const NGN_PER_USD = Number(
  process.env.NEXT_PUBLIC_NGN_PER_USD || POSTED_NGN_PER_USD,
);

export const NGN_RATE_SET_ON =
  process.env.NEXT_PUBLIC_NGN_RATE_SET_ON || POSTED_ON;

/**
 * Computed per call rather than at module load: a statically rendered page
 * would otherwise freeze the age at build time and never go stale.
 */
export function ngnRateAgeDays(now: Date = new Date()): number {
  const set = new Date(`${NGN_RATE_SET_ON}T00:00:00Z`);
  if (Number.isNaN(set.getTime())) return Number.POSITIVE_INFINITY;
  return Math.floor((now.getTime() - set.getTime()) / 86_400_000);
}

export function ngnRateIsStale(now: Date = new Date()): boolean {
  return ngnRateAgeDays(now) > NGN_RATE_STALE_AFTER_DAYS;
}

/** Dollars, trimmed of a trailing .00 — "$25", "$17.50". */
export function formatUsd(amount: number): string {
  const whole = Number.isInteger(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Naira, rounded to whole naira — "₦33,750". */
export function formatNgn(usdAmount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(usdAmount * NGN_PER_USD);
}

export function formatPercent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}
