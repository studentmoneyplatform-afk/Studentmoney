-- StudentMoney · administration
--
-- Reviewing a referral is three writes that must not come apart: the stage
-- moves, the decision is logged, and the student is told. Doing that from
-- the client would leave a reward approved with no audit trail if the second
-- write failed, so each action is one function.
--
-- Every function re-checks is_admin() itself. They are security definer, so
-- without that check anyone could call them through PostgREST.

-- Admins need to write the trail and the notifications they trigger.
create policy audit_log_insert_admin on audit_log
  for insert with check (is_admin());

create policy notifications_insert_admin on notifications
  for insert with check (is_admin());

-- Staff may read every profile to run the platform; students still see only
-- their own row through the existing policy.
create policy profiles_select_admin on profiles
  for select using (is_admin());

create policy referral_events_select_admin on referral_events
  for select using (is_admin());

-- ───────────────────────────────────────────── review a referral ──────

create or replace function review_referral(
  p_referral_id uuid,
  p_decision referral_stage,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student uuid;
  v_opportunity text;
  v_previous referral_stage;
begin
  if not is_admin() then
    raise exception 'Only staff can review referrals' using errcode = '42501';
  end if;

  if p_decision not in ('approved', 'rejected', 'pending_verification') then
    raise exception 'A review can only approve, reject or send back for checking';
  end if;

  if p_decision = 'rejected' and coalesce(trim(p_reason), '') = '' then
    raise exception 'A rejection must carry a reason the student can read';
  end if;

  select re.student_id, re.stage, o.name
    into v_student, v_previous, v_opportunity
  from referral_events re
  join opportunities o on o.id = re.opportunity_id
  where re.id = p_referral_id;

  if not found then
    raise exception 'No such referral';
  end if;

  update referral_events
     set stage = p_decision,
         rejected_reason = case when p_decision = 'rejected' then p_reason else null end,
         reviewed_by = auth.uid(),
         reviewed_at = now()
   where id = p_referral_id;

  insert into audit_log (actor_id, action, entity, entity_id, detail)
  values (
    auth.uid(), 'referral.' || p_decision, 'referral_events', p_referral_id,
    jsonb_build_object('from', v_previous, 'to', p_decision, 'reason', p_reason)
  );

  insert into notifications (student_id, title, body, href)
  values (
    v_student,
    case p_decision
      when 'approved' then 'A referral was approved'
      when 'rejected' then 'A referral was not approved'
      else 'A referral is being checked'
    end,
    case p_decision
      when 'approved' then 'Your referral on ' || v_opportunity || ' counts. Your progress has moved.'
      when 'rejected' then 'Your referral on ' || v_opportunity || ' did not qualify: ' || coalesce(p_reason, '')
      else 'We are checking a referral you submitted on ' || v_opportunity || '.'
    end,
    '/dashboard/referrals'
  );
end;
$$;

-- ──────────────────────────────────────────── record a payment ──────

create or replace function record_payment(
  p_participation_id uuid,
  p_amount_usd numeric,
  p_rate_ngn_per_usd numeric default null,
  p_reference text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment uuid;
  v_student uuid;
  v_earned numeric(10, 2);
  v_paid numeric(10, 2);
begin
  if not is_admin() then
    raise exception 'Only staff can record payments' using errcode = '42501';
  end if;

  if p_amount_usd is null or p_amount_usd <= 0 then
    raise exception 'A payment must be a positive amount';
  end if;

  select p.student_id, coalesce(r.earned_usd, 0), coalesce(r.paid_usd, 0)
    into v_student, v_earned, v_paid
  from participations p
  left join opportunity_rewards r on r.participation_id = p.id
  where p.id = p_participation_id;

  if not found then
    raise exception 'No such participation';
  end if;

  -- The guard that matters: a student can never be paid more than the
  -- ledger says they earned.
  if v_paid + p_amount_usd > v_earned + 0.005 then
    raise exception 'That would pay % when only % has been earned',
      v_paid + p_amount_usd, v_earned;
  end if;

  insert into opportunity_payments
    (participation_id, amount_usd, rate_ngn_per_usd, amount_ngn, status, reference, recorded_by, paid_at)
  values (
    p_participation_id, p_amount_usd, p_rate_ngn_per_usd,
    case when p_rate_ngn_per_usd is not null then p_amount_usd * p_rate_ngn_per_usd end,
    'paid', p_reference, auth.uid(), now()
  )
  returning id into v_payment;

  insert into audit_log (actor_id, action, entity, entity_id, detail)
  values (
    auth.uid(), 'payment.recorded', 'opportunity_payments', v_payment,
    jsonb_build_object('amount_usd', p_amount_usd, 'reference', p_reference)
  );

  insert into notifications (student_id, title, body, href)
  values (
    v_student, 'A payment was recorded',
    'We have recorded a payment of $' || p_amount_usd || ' to you.',
    '/dashboard/earnings'
  );

  return v_payment;
end;
$$;

-- ─────────────────────────────────────── verify a student ──────

create or replace function set_student_verified(p_student_id uuid, p_verified boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'Only staff can verify students' using errcode = '42501';
  end if;

  update profiles
     set verified_at = case when p_verified then now() else null end
   where id = p_student_id;

  insert into audit_log (actor_id, action, entity, entity_id, detail)
  values (
    auth.uid(),
    case when p_verified then 'student.verified' else 'student.unverified' end,
    'profiles', p_student_id, '{}'::jsonb
  );

  if p_verified then
    insert into notifications (student_id, title, body, href)
    values (
      p_student_id, 'Your account is verified',
      'You can now join opportunities and have rewards attributed to you.',
      '/dashboard/opportunities'
    );
  end if;
end;
$$;
