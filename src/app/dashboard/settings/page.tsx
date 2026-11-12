import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Panel } from "@/components/dashboard-ui";
import { FinePrint } from "@/components/ui";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Settings" };

/**
 * The account as we hold it.
 *
 * These fields are shown rather than edited: the only profile write in the
 * codebase is the one that creates the row when someone joins, and wiring an
 * edit means a new action and a matching row level security policy. Until
 * that exists, the page says how to get a detail changed instead of offering
 * a form that would fail.
 */
export default async function SettingsPage() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/join");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/join");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, university, verified_at, created_at")
    .eq("id", user.id)
    .maybeSingle();

  const rows: { label: string; value: string }[] = [
    { label: "Name", value: profile?.full_name ?? "Not set" },
    { label: "Email", value: user.email ?? "Not set" },
    { label: "Phone", value: profile?.phone ?? "Not set" },
    { label: "School or organisation", value: profile?.university ?? "Not set" },
    {
      label: "Verification",
      value: profile?.verified_at ? "Verified" : "Pending",
    },
    {
      label: "Joined",
      value: profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "Unknown",
    },
  ];

  return (
    <div className="space-y-6">
      <Panel title="Your account">
        <dl className="divide-y divide-[color:var(--hair)]">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-wrap items-baseline justify-between gap-3 py-3.5">
              <dt className="text-[color:var(--ink-3)]">{row.label}</dt>
              <dd className="font-bold">{row.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5">
          <FinePrint>
            To change any of these, message us on WhatsApp from the number on your
            account. Details that decide who a reward belongs to are not edited without
            a person checking.
          </FinePrint>
        </div>
      </Panel>

      <Panel title="Signing out">
        <p className="text-[color:var(--ink-2)]">
          Signing out ends this session on this device only. Your referral links keep
          working and anything already attributed to you stays attributed.
        </p>
        <form action="/auth/signout" method="post" className="mt-5">
          <button
            type="submit"
            className="rounded-full border border-[color:var(--hair-strong)] px-5 py-2.5 font-bold transition-colors hover:border-[color:var(--ink-1)]"
          >
            Sign out
          </button>
        </form>
      </Panel>
    </div>
  );
}
