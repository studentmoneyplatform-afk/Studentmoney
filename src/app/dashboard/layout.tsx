import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";
import { Eyebrow } from "@/components/ui";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Guards every dashboard route in one place: signed in, and onboarded.
 * A student with no profile row has not finished joining, so they go to
 * /welcome rather than seeing an empty ledger.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/join");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/join");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, verified_at")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/welcome");

  const firstName = profile.full_name.split(" ")[0];

  return (
    <div data-page="rewards" className="min-h-screen bg-paper-2">
      <div className="border-b border-[color:var(--hair)] bg-paper">
        <div className="mx-auto w-full max-w-6xl px-5 pt-10 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <Eyebrow>Your dashboard</Eyebrow>
              <h1 className="font-display mt-3 text-[2rem] leading-tight sm:text-h2">
                Welcome back, {firstName}.
              </h1>
            </div>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-full border border-[color:var(--hair-strong)] px-4 py-2 text-caption font-bold transition-colors hover:border-[color:var(--ink-1)]"
              >
                Sign out
              </button>
            </form>
          </div>

          {!profile.verified_at && (
            <div className="mt-7 rounded-[var(--radius-lg)] border-2 border-warning/50 bg-warning/5 px-5 py-4">
              <p className="font-bold">Verification pending</p>
              <p className="mt-1 text-[color:var(--ink-2)]">
                You can browse opportunities now. Before a reward can be attributed to
                you we verify who you are, because attribution has to belong to a real
                person. We will message you on WhatsApp when that is done.
              </p>
            </div>
          )}

          <div className="mt-8">
            <DashboardNav />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-12">{children}</div>
    </div>
  );
}
