import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { AdminNav } from "@/components/admin-nav";
import { Eyebrow } from "@/components/ui";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * The single server-side gate for every admin route.
 *
 * A non-admin gets a 404 rather than a redirect: there is no reason to
 * confirm to a stranger that an admin console exists here. The database
 * functions check the role again regardless, so this is defence in depth
 * rather than the only guard.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/join");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) notFound();

  return (
    <div data-page="rewards" className="min-h-screen bg-paper-2">
      <div className="border-b border-[color:var(--hair)] bg-forest text-[color:var(--on-dark-1)]">
        <div className="mx-auto w-full max-w-7xl px-5 pt-8 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow tone="reversed">Staff console</Eyebrow>
              <h1 className="font-display mt-2 text-[1.75rem]">StudentMoney admin</h1>
            </div>
            <div className="flex items-center gap-3 pb-1">
              <Link href="/dashboard" className="text-caption font-bold text-[color:var(--on-dark-2)] hover:text-[color:var(--on-dark-1)]">
                My dashboard
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-full border border-[color:var(--hair-reversed)] px-4 py-2 text-caption font-bold"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
          <div className="mt-7">
            <AdminNav />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8">{children}</div>
    </div>
  );
}
