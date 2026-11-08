-- StudentMoney · row level security for opportunities
--
-- A student sees live opportunities, their own participation, their own
-- referrals and their own rewards. Nothing that decides money is writable
-- from the browser: approving a referral and recording a payment are staff
-- actions, and the ledger is written only by the recompute function.

alter table opportunities enable row level security;
alter table participations enable row level security;
alter table referral_links enable row level security;
alter table referral_events enable row level security;
alter table opportunity_rewards enable row level security;
alter table opportunity_payments enable row level security;
alter table notifications enable row level security;
alter table audit_log enable row level security;

create policy opportunities_select_live on opportunities
  for select using (status = 'live' or is_admin());

create policy opportunities_write_admin on opportunities
  for all using (is_admin()) with check (is_admin());

-- A verified student may join a live opportunity, for themself only.
create policy participations_select_own on participations
  for select using (student_id = auth.uid() or is_admin());

create policy participations_insert_own on participations
  for insert with check (
    student_id = auth.uid()
    and exists (select 1 from profiles p where p.id = auth.uid() and p.verified_at is not null)
    and exists (select 1 from opportunities o where o.id = opportunity_id and o.status = 'live')
  );

create policy referral_links_select_own on referral_links
  for select using (
    is_admin()
    or exists (
      select 1 from participations p
      where p.id = referral_links.participation_id and p.student_id = auth.uid()
    )
  );

-- Referrals are readable by their owner. Students never move a stage: the
-- link capture and every later transition are server-side work.
create policy referral_events_select_own on referral_events
  for select using (student_id = auth.uid() or is_admin());

create policy referral_events_update_admin on referral_events
  for update using (is_admin()) with check (is_admin());

create policy opportunity_rewards_select_own on opportunity_rewards
  for select using (student_id = auth.uid() or is_admin());

create policy opportunity_payments_select_own on opportunity_payments
  for select using (
    is_admin()
    or exists (
      select 1 from participations p
      where p.id = opportunity_payments.participation_id and p.student_id = auth.uid()
    )
  );

create policy opportunity_payments_write_admin on opportunity_payments
  for all using (is_admin()) with check (is_admin());

create policy notifications_select_own on notifications
  for select using (student_id = auth.uid() or is_admin());

create policy notifications_update_own on notifications
  for update using (student_id = auth.uid()) with check (student_id = auth.uid());

create policy audit_log_select_admin on audit_log
  for select using (is_admin());
