/**
 * Nigerian mobile numbers, in one place.
 *
 * This rule decides who can join and which number a reward is attributed to,
 * and it was previously written out twice — in the join action and the
 * welcome action — where the two copies could drift apart without anything
 * failing loudly.
 */

/** 0801…, +234801… or 234801…, on the 7/8/9 mobile prefixes. */
export const NIGERIAN_PHONE = /^(\+?234|0)[789]\d{9}$/;

/** Strips the spaces and dashes people actually type before validating. */
export function normalisePhone(raw: string): string {
  return raw.replace(/[\s-]/g, "");
}

export function isNigerianPhone(raw: string): boolean {
  return NIGERIAN_PHONE.test(normalisePhone(raw));
}
