import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Guards every dashboard route in one place: signed in, and onboarded.
 * Someone with no profile row has not finished joining, so they go to
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

  // The dot on the bell. Row level security scopes this to the signed-in
  // account, and it stands for work sitting with us rather than with them,
  // so it clears on its own once those referrals are decided.
  const { count: awaitingVerification } = await supabase
    .from("referral_events")
    .select("id", { count: "exact", head: true })
    .eq("stage", "pending_verification");

  return (
    <DashboardShell
      fullName={profile.full_name}
      standing={profile.verified_at ? "Verified member" : "Verification pending"}
      attention={(awaitingVerification ?? 0) > 0}
    >
      {!profile.verified_at && (
        <div className="mb-7 rounded-[var(--radius-lg)] border-2 border-warning/50 bg-warning/5 px-5 py-4">
          <p className="font-bold">Verification pending</p>
          <p className="mt-1 text-[color:var(--ink-2)]">
            You can browse opportunities now. Before a reward can be attributed to you
            we verify who you are, because attribution has to belong to a real person.
            We will message you on WhatsApp when that is done.
          </p>
        </div>
      )}
      {children}
    </DashboardShell>
  );
}
