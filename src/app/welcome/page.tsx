import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { Card, Eyebrow, Lede, Section } from "@/components/ui";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Finish joining" };

export default async function WelcomePage() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/join");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/join");

  // Already onboarded: nothing to do here.
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile) redirect("/dashboard");

  const googleName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    "";

  return (
    <Section tone="forest">
      <div className="mx-auto max-w-xl">
        <Eyebrow tone="reversed">One more step</Eyebrow>
        <h1 className="font-display mt-5 text-[2.25rem] leading-[1.05] sm:text-[3rem]">
          Where should your campaigns arrive?
        </h1>
        <Lede className="mt-6 text-[color:var(--on-dark-1)]/90">
          Google told us who you are. It cannot tell us your WhatsApp number, and that
          is where the opportunities and your earning updates go.
        </Lede>

        <Card
          tone="forest"
          className="mt-10 border border-[color:var(--hair-reversed)]"
        >
          <ProfileForm defaultName={googleName} />
        </Card>
      </div>
    </Section>
  );
}
