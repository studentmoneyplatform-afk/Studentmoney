-- StudentMoney · row level security
--
-- Default posture: a student sees their own rows and the campaigns that are
-- live. Nothing else is readable from the browser. Everything that moves
-- money (payments, reward entries, payout status) is written only by the
-- service role, never by a signed-in user.

alter table profiles enable row level security;
alter table providers enable row level security;
alter table campaigns enable row level security;
alter table referral_codes enable row level security;
alter table leads enable row level security;
alter table projects enable row level security;
alter table project_payments enable row level security;
alter table reward_policy enable row level security;
alter table reward_entries enable row level security;
alter table payouts enable row level security;
alter table video_submissions enable row level security;
alter table signups enable row level security;

-- Admin test, kept out of the policies themselves so it stays one definition.
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.is_admin from profiles p where p.id = auth.uid()),
    false
  );
$$;

-- profiles: your own row, plus admins.
create policy profiles_select_own on profiles
  for select using (id = auth.uid() or is_admin());

create policy profiles_insert_own on profiles
  for insert with check (id = auth.uid());

-- A student may edit their own details, but never verify or promote themself.
create policy profiles_update_own on profiles
  for update using (id = auth.uid())
  with check (
    id = auth.uid()
    and is_admin = (select p.is_admin from profiles p where p.id = auth.uid())
    and verified_at is not distinct from
        (select p.verified_at from profiles p where p.id = auth.uid())
  );

-- campaigns: only live ones are public.
create policy campaigns_select_live on campaigns
  for select using (status = 'live' or is_admin());

create policy providers_select_approved on providers
  for select using (approved_at is not null or is_admin());

-- referral codes: your own.
create policy referral_codes_select_own on referral_codes
  for select using (student_id = auth.uid() or is_admin());

-- leads: a verified student may submit their own, and read their own.
create policy leads_select_own on leads
  for select using (student_id = auth.uid() or is_admin());

create policy leads_insert_own on leads
  for insert with check (
    student_id = auth.uid()
    and exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.verified_at is not null
    )
    and exists (
      select 1 from campaigns c
      where c.id = campaign_id and c.status = 'live'
    )
  );

-- A student never moves a lead out of 'submitted'. Review is staff work.
create policy leads_update_admin on leads
  for update using (is_admin()) with check (is_admin());

-- projects, payments, ledger, policy: readable where they are yours,
-- writable by the service role only (no insert/update/delete policies).
create policy projects_select_own on projects
  for select using (
    is_admin()
    or exists (
      select 1 from leads l
      where l.id = projects.lead_id and l.student_id = auth.uid()
    )
  );

create policy project_payments_select_own on project_payments
  for select using (
    is_admin()
    or exists (
      select 1 from projects p
      join leads l on l.id = p.lead_id
      where p.id = project_payments.project_id and l.student_id = auth.uid()
    )
  );

create policy reward_entries_select_own on reward_entries
  for select using (student_id = auth.uid() or is_admin());

create policy reward_policy_select_all on reward_policy
  for select using (true);

-- payouts: you can see yours and request one; staff move the status.
create policy payouts_select_own on payouts
  for select using (student_id = auth.uid() or is_admin());

create policy payouts_insert_own on payouts
  for insert with check (
    student_id = auth.uid()
    and status = 'requested'
    and exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.verified_at is not null
    )
  );

create policy payouts_update_admin on payouts
  for update using (is_admin()) with check (is_admin());

-- video submissions: yours to create and read, staff to approve.
create policy video_submissions_select_own on video_submissions
  for select using (student_id = auth.uid() or is_admin());

create policy video_submissions_insert_own on video_submissions
  for insert with check (
    student_id = auth.uid()
    and status = 'submitted'
    and exists (
      select 1 from campaigns c
      where c.id = campaign_id and c.status = 'live' and c.kind = 'video'
    )
  );

create policy video_submissions_update_admin on video_submissions
  for update using (is_admin()) with check (is_admin());

-- signups: the public marketing form writes here and reads nothing back.
create policy signups_insert_public on signups
  for insert to anon, authenticated with check (true);

create policy signups_select_admin on signups
  for select using (is_admin());
