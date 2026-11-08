-- StudentMoney · opportunities, referrals and rewards
--
-- The three live opportunities pay in genuinely different ways, so the reward
-- shape is a column rather than an assumption:
--   per_referral  flat amount each time a referral is approved
--   proportional  one pot released in proportion to progress toward a target
--   threshold     nothing until the target is met, then the whole amount
--
-- Everything that decides money lives here, not in the browser. A student can
-- create a referral event only by visiting a link; moving one to approved or
-- paid is staff work, enforced by policy rather than by hiding a button.

create type reward_kind as enum ('per_referral', 'proportional', 'threshold');
create type opportunity_status as enum ('draft', 'live', 'paused', 'closed');
create type referral_stage as enum (
  'clicked', 'registered', 'pending_verification', 'approved', 'rejected', 'paid'
);

create table opportunities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  partner text not null,
  summary text not null,
  what_you_do text not null,
  how_it_counts text,

  reward_kind reward_kind not null,
  -- per_referral and threshold use reward_usd; proportional uses pot_usd.
  reward_usd numeric(10, 2),
  pot_usd numeric(10, 2),
  target integer,
  unit text,

  status opportunity_status not null default 'draft',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),

  constraint reward_shape_is_complete check (
    (reward_kind = 'per_referral' and reward_usd is not null)
    or (reward_kind = 'proportional' and pot_usd is not null and target > 0 and unit is not null)
    or (reward_kind = 'threshold' and reward_usd is not null and target > 0 and unit is not null)
  )
);

create index opportunities_live_idx on opportunities (status, display_order);

-- A student opting into an opportunity.
create table participations (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references opportunities on delete cascade,
  student_id uuid not null references profiles on delete cascade,
  joined_at timestamptz not null default now(),
  unique (opportunity_id, student_id)
);

create index participations_student_idx on participations (student_id);

-- The tracking code. One per student per opportunity, and the thing every
-- referral event hangs off.
create table referral_links (
  id uuid primary key default gen_random_uuid(),
  participation_id uuid not null unique references participations on delete cascade,
  code text not null,
  created_at timestamptz not null default now()
);

create unique index referral_links_code_key on referral_links (lower(code));

-- Every referral, and where it has got to. One row per referred person per
-- link; the stage moves forward, and the history is in the audit log.
create table referral_events (
  id uuid primary key default gen_random_uuid(),
  referral_link_id uuid not null references referral_links on delete cascade,
  opportunity_id uuid not null references opportunities on delete restrict,
  student_id uuid not null references profiles on delete restrict,

  -- Protected identifier: who was referred, as little as we can store.
  referred_label text not null,
  referred_email text,
  referred_phone text,

  stage referral_stage not null default 'clicked',
  rejected_reason text,
  reviewed_by uuid references profiles,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index referral_events_student_idx on referral_events (student_id, created_at desc);
create index referral_events_stage_idx on referral_events (opportunity_id, stage);

-- The same person cannot be counted twice on one opportunity while an earlier
-- claim is still alive.
create unique index referral_events_no_duplicates
  on referral_events (opportunity_id, lower(coalesce(referred_email, referred_phone, referred_label)))
  where stage in ('registered', 'pending_verification', 'approved', 'paid');

-- A student cannot refer themself.
create or replace function reject_self_referral()
returns trigger
language plpgsql
as $$
declare
  v_email text;
  v_phone text;
begin
  select u.email, p.phone into v_email, v_phone
  from profiles p join auth.users u on u.id = p.id
  where p.id = new.student_id;

  if (new.referred_email is not null and lower(new.referred_email) = lower(coalesce(v_email, '')))
     or (new.referred_phone is not null and new.referred_phone = v_phone) then
    raise exception 'A referral cannot point at the referrer';
  end if;

  return new;
end;
$$;

create trigger referral_events_no_self
before insert or update on referral_events
for each row execute function reject_self_referral();

-- ─────────────────────────────────────────────── the reward ledger ──────
-- One row per participation holding the CURRENT position, recomputed from
-- approved referrals. Never incremented, so it cannot drift or double-pay.

create table opportunity_rewards (
  id uuid primary key default gen_random_uuid(),
  participation_id uuid not null unique references participations on delete cascade,
  student_id uuid not null references profiles on delete restrict,
  opportunity_id uuid not null references opportunities on delete restrict,

  approved_count integer not null default 0,
  pending_count integer not null default 0,
  target integer,

  earned_usd numeric(10, 2) not null default 0,
  paid_usd numeric(10, 2) not null default 0,
  updated_at timestamptz not null default now()
);

create index opportunity_rewards_student_idx on opportunity_rewards (student_id);

-- Earned is derived from approved referrals and the opportunity's reward
-- shape. This is the only place the three models are turned into money.
create or replace function recompute_opportunity_reward(p_participation_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  o record;
  v_student uuid;
  v_opportunity uuid;
  v_approved integer;
  v_pending integer;
  v_paid numeric(10, 2);
  v_earned numeric(10, 2);
begin
  select p.student_id, p.opportunity_id into v_student, v_opportunity
  from participations p where p.id = p_participation_id;

  if not found then
    return;
  end if;

  select * into o from opportunities where id = v_opportunity;

  select
    count(*) filter (where re.stage in ('approved', 'paid')),
    count(*) filter (where re.stage in ('registered', 'pending_verification'))
  into v_approved, v_pending
  from referral_events re
  join referral_links rl on rl.id = re.referral_link_id
  where rl.participation_id = p_participation_id;

  select coalesce(sum(amount_usd), 0) into v_paid
  from opportunity_payments
  where participation_id = p_participation_id and status = 'paid';

  v_earned := case o.reward_kind
    when 'per_referral' then round(o.reward_usd * v_approved, 2)
    when 'proportional' then
      round(o.pot_usd * least(greatest(v_approved::numeric / o.target, 0), 1), 2)
    when 'threshold' then
      case when v_approved >= o.target then o.reward_usd else 0 end
  end;

  insert into opportunity_rewards as r (
    participation_id, student_id, opportunity_id, approved_count, pending_count,
    target, earned_usd, paid_usd, updated_at
  )
  values (
    p_participation_id, v_student, v_opportunity, v_approved, v_pending,
    o.target, v_earned, v_paid, now()
  )
  on conflict (participation_id) do update set
    approved_count = excluded.approved_count,
    pending_count = excluded.pending_count,
    target = excluded.target,
    earned_usd = excluded.earned_usd,
    paid_usd = excluded.paid_usd,
    updated_at = now();
end;
$$;

-- Payments recorded against a participation. Staff-written only.
create table opportunity_payments (
  id uuid primary key default gen_random_uuid(),
  participation_id uuid not null references participations on delete cascade,
  amount_usd numeric(10, 2) not null check (amount_usd > 0),
  amount_ngn numeric(14, 2),
  rate_ngn_per_usd numeric(10, 2),
  status payout_status not null default 'requested',
  reference text,
  recorded_by uuid references profiles,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index opportunity_payments_participation_idx
  on opportunity_payments (participation_id, status);

create or replace function trg_recompute_from_referral()
returns trigger
language plpgsql
as $$
declare
  v_participation uuid;
begin
  select rl.participation_id into v_participation
  from referral_links rl
  where rl.id = coalesce(new.referral_link_id, old.referral_link_id);

  if v_participation is not null then
    perform recompute_opportunity_reward(v_participation);
  end if;
  return null;
end;
$$;

create trigger referral_events_recompute
after insert or update or delete on referral_events
for each row execute function trg_recompute_from_referral();

create or replace function trg_recompute_from_payment()
returns trigger
language plpgsql
as $$
begin
  perform recompute_opportunity_reward(coalesce(new.participation_id, old.participation_id));
  return null;
end;
$$;

create trigger opportunity_payments_recompute
after insert or update or delete on opportunity_payments
for each row execute function trg_recompute_from_payment();

-- ──────────────────────────────────────── notifications and audit ──────

create table notifications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles on delete cascade,
  title text not null,
  body text not null,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_student_idx on notifications (student_id, created_at desc);

-- Every change that touches money or status. Written by staff actions.
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles,
  action text not null,
  entity text not null,
  entity_id uuid,
  detail jsonb,
  created_at timestamptz not null default now()
);

create index audit_log_entity_idx on audit_log (entity, entity_id, created_at desc);
