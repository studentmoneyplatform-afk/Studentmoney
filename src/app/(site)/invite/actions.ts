"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export type InterestState = { status: "idle" | "ok" | "error"; message: string };

const MESSAGES: Record<string, InterestState> = {
  ok: {
    status: "ok",
    message: "Thank you. We have passed your details on and someone will reach out.",
  },
  duplicate: {
    status: "ok",
    message: "You are already on this list. Nothing was added twice.",
  },
  self: {
    status: "error",
    message: "That is the contact on the account that shared this link.",
  },
  closed: {
    status: "error",
    message: "This opportunity has closed. Nothing was saved.",
  },
  unknown_code: {
    status: "error",
    message: "This link is no longer valid. Nothing was saved.",
  },
  too_many: {
    status: "error",
    message: "This link has taken a lot of names today. Try again tomorrow.",
  },
  invalid: {
    status: "error",
    message: "Check the name and the phone number or email, then try again.",
  },
};

/**
 * Registers somebody's interest in an opportunity against the link that
 * brought them, without an account.
 *
 * It writes a claim, not a reward: the row lands at stage 'registered' and a
 * person still decides whether it is approved. The database does the checking
 * because the rules -- whose link, already listed, the referrer's own number
 * -- all need rows this visitor is not allowed to read.
 */
export async function registerInterest(
  _prev: InterestState,
  formData: FormData,
): Promise<InterestState> {
  const code = String(formData.get("code") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim();

  if (label.length < 2) {
    return { status: "error", message: "Please enter your name." };
  }
  if (contact.length < 6) {
    return { status: "error", message: "Please enter a phone number or an email." };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return { status: "error", message: "Not connected yet. Nothing was saved." };
  }

  const { data, error } = await supabase.rpc("register_interest", {
    p_code: code,
    p_label: label,
    p_contact: contact,
  });

  if (error) {
    return { status: "error", message: "We could not save that. Try again shortly." };
  }

  return MESSAGES[String(data)] ?? MESSAGES.invalid;
}
