import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { REFERRAL_COOKIE, REFERRAL_COOKIE_MAX_AGE } from "@/lib/referral";

/**
 * The link a student shares.
 *
 * It records nothing on its own: a click is not a referral and earns nobody
 * anything, so there is no row to write yet and no reason to log who clicked.
 * It remembers the code in a cookie and sends the visitor to the opportunity,
 * and the referral is only created once that person finishes joining.
 *
 * A dead or mistyped code is not an error for the visitor to deal with. They
 * came to look at an opportunity, so they are shown the list instead.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const fallback = NextResponse.redirect(new URL("/opportunities", request.url));

  const supabase = await getSupabaseServerClient();
  if (!supabase) return fallback;

  const { data, error } = await supabase.rpc("resolve_referral_code", { p_code: code });
  const match = Array.isArray(data) ? data[0] : null;
  if (error || !match?.opportunity_slug) return fallback;

  const response = NextResponse.redirect(
    new URL(`/opportunities/${match.opportunity_slug}`, request.url),
  );

  response.cookies.set({
    name: REFERRAL_COOKIE,
    value: code,
    maxAge: REFERRAL_COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
