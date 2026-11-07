import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * Supabase client for server components and server actions. Uses the anon
 * key, so row level security applies exactly as it does in the browser —
 * nothing here can quietly bypass a policy.
 *
 * Returns null when the project is not configured yet, so callers handle the
 * unconfigured case explicitly instead of crashing the page.
 */
export async function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a server component, where cookies are read-only.
          // Session refresh happens in middleware instead.
        }
      },
    },
  });
}
