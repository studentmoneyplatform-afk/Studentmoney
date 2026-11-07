"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export type SignupState = {
  status: "idle" | "ok" | "error";
  message: string;
};

const NIGERIAN_PHONE = /^(\+?234|0)[789]\d{9}$/;

/**
 * Records interest from the marketing site. Writes to `signups`, which is
 * deliberately not `profiles`: nobody becomes a student on the platform
 * until they have been verified.
 */
export async function submitSignup(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const university = String(formData.get("university") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const audience = formData.get("audience") === "business" ? "business" : "student";

  if (fullName.length < 2) {
    return { status: "error", message: "Please enter your full name." };
  }

  const phone = phoneRaw.replace(/[\s-]/g, "");
  if (!NIGERIAN_PHONE.test(phone)) {
    return {
      status: "error",
      message: "Enter a Nigerian phone number that works on WhatsApp, like 08012345678.",
    };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return {
      status: "error",
      message:
        "Signups are not connected yet. Nothing was saved — please try again shortly.",
    };
  }

  const { error } = await supabase.from("signups").insert({
    full_name: fullName,
    phone,
    email: email || null,
    university: university || null,
    note: note || null,
    audience,
    source: "website",
  });

  if (error) {
    // 23505 is a unique violation: this phone already joined as this audience.
    if (error.code === "23505") {
      return {
        status: "ok",
        message: "You are already on the list. Look out for a WhatsApp message from us.",
      };
    }
    return {
      status: "error",
      message: "We could not save that. Please try again in a moment.",
    };
  }

  return {
    status: "ok",
    message: "You are in. We will send your first campaign on WhatsApp.",
  };
}
