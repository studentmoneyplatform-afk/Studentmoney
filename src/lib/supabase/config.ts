/**
 * Supabase configuration, read once so that every caller agrees on whether
 * the backend is wired up. Nothing here throws at import time: the site must
 * still render if the keys are missing, and the form must say so plainly
 * rather than pretending a signup was saved.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}
