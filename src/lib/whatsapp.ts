/**
 * Click-to-chat links to the person who runs MirusEarn.
 *
 * There is no WhatsApp API here on purpose: wa.me needs no provider account,
 * no Meta template approval and costs nothing per message. The trade-off is
 * that the member starts every conversation — we can only hand them a filled
 * message at the right moment, we cannot push one to them.
 *
 * Set NEXT_PUBLIC_WHATSAPP_NUMBER to the owner's number. Until it is set,
 * every button below renders nothing rather than a link that goes nowhere.
 */

/** Nigerian numbers are stored as 0801…; wa.me wants 234801… with no symbols. */
export function toWaNumber(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("234")) return digits.length === 13 ? digits : null;
  if (digits.startsWith("0")) return digits.length === 11 ? `234${digits.slice(1)}` : null;
  if (digits.length === 10) return `234${digits}`;
  return null;
}

/**
 * The number people reach MirusEarn on. It lives in code rather than in an
 * env var because it is public either way - every visitor can read it out of
 * the wa.me link - and a deploy should not depend on remembering to set it.
 * NEXT_PUBLIC_WHATSAPP_NUMBER still overrides it if the number ever changes.
 */
const OWNER_NUMBER = "+234 905 639 1650";

export const OWNER_WHATSAPP = toWaNumber(
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || OWNER_NUMBER,
);

/** A wa.me link, or null when no number is configured. */
export function waLink(message: string): string | null {
  if (!OWNER_WHATSAPP) return null;
  return `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

/**
 * The messages themselves. They are written so the owner can act on one
 * without asking a follow-up question: who it is, which opportunity, and the
 * code that identifies the referral.
 */
export const WA = {
  confirmSignup: (name?: string | null) =>
    `Hi MirusEarn. I have just created my account${name ? ` as ${name}` : ""} and I am confirming this is my WhatsApp number.`,

  referralApproved: (code: string, opportunity: string) =>
    `Hi MirusEarn. My referral for ${opportunity} shows as approved. My code is ${code}.`,

  rewardReleased: (code: string, opportunity: string, amount: string) =>
    `Hi MirusEarn. My ${opportunity} reward shows as released (${amount}). My code is ${code}. Please confirm the payout.`,

  linkUsed: (code: string, opportunity: string) =>
    `Hi MirusEarn. Someone has just registered through my ${opportunity} link. My code is ${code}.`,

  help: () => `Hi MirusEarn. I need help with my account.`,

  verification: (name?: string | null) =>
    `Hi MirusEarn. I am${name ? ` ${name},` : ""} waiting on verification and would like to complete it.`,
} as const;
