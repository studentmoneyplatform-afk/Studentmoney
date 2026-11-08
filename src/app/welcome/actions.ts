"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type ProfileState = { status: "idle" | "error"; message: string };

const NIGERIAN_PHONE = /^(\+?234|0)[789]\d{9}$/;

/**
 * Finishes joining: turns a Google account into a StudentMoney profile.
 * Google gives us a name and an email but never a phone number, and
 * campaigns arrive on WhatsApp, so the number is collected here.
 */
export async function completeProfile(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const university = String(formData.get("university") ?? "").trim();

  if (fullName.length < 2) {
    return { status: "error", message: "Please enter your full name." };
  }

  const phone = phoneRaw.replace(/[\s-]/g, "");
  if (!NIGERIAN_PHONE.test(phone)) {
    return {
      status: "error",
      message: "Enter a Nigerian number that works on WhatsApp, like 08012345678.",
    };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return { status: "error", message: "Sign-in is not connected yet." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "Your session expired. Sign in again." };
  }

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    full_name: fullName,
    phone,
    university: university || null,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        status: "error",
        message: "That number is already registered to another account.",
      };
    }
    return { status: "error", message: "We could not save that. Try again." };
  }

  redirect("/dashboard");
}
