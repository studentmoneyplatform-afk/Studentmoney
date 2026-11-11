/**
 * Money formatting for Stormm.
 *
 * Brand rule: naira beside every dollar. Never show a dollar figure alone.
 *
 * The rate is a single configured constant, not a live feed, so that a reward
 * quoted to a student does not drift between the campaign card and the ledger.
 * Set NEXT_PUBLIC_NGN_PER_USD and republish when the posted rate changes.
 */

const FALLBACK_NGN_PER_USD = 1550;

export const NGN_PER_USD = Number(
  process.env.NEXT_PUBLIC_NGN_PER_USD ?? FALLBACK_NGN_PER_USD,
);

/** True when no rate was configured and the fallback is standing in. */
export const NGN_RATE_IS_PLACEHOLDER = !process.env.NEXT_PUBLIC_NGN_PER_USD;

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

/** Naira, rounded to whole naira — "₦38,750". */
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
