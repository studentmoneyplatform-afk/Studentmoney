import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Everything except static assets, image files and the auth routes.
    //
    // /auth is excluded deliberately. Refreshing the session here rotates
    // the auth cookies, which wiped the PKCE code verifier before
    // /auth/callback could exchange it — sign-in then failed with "both
    // auth code and code verifier should be non-empty". The callback
    // establishes the session itself, so it needs no refresh beforehand.
    "/((?!_next/static|_next/image|favicon.ico|auth/|brand/|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
