-- StudentMoney · core schema
--
-- The ledger is the heart of this system: a student's reward is always
-- recomputed from cleared client payments, never incremented by hand, so a
-- reward can never be paid twice and a reversal always follows the money.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- enums ----

create type campaign_kind as enum ('referral', 'video');
create type campaign_status as enum ('draft', 'live', 'paused', 'closed');
create type lead_status as enum ('submitted', 'in_review', 'qualified', 'rejected', 'duplicate');
create type project_status as enum ('agreed', 'in_progress', 'delivered', 'cancelled');
create type payment_status as enum ('pending', 'cleared', 'refunded', 'charged_back');
create type payout_status as enum ('requested', 'processing', 'paid', 'failed');
create type submission_status as enum ('submitted', 'approved', 'rejected');

-- ------------------------------------------------------------- profiles ----

-- One row per student, keyed to the auth user. Identity verification gates
-- attribution: an unverified student can browse, but cannot be paid.
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null,
  phone text not null,
  university text,
  verified_at timestamptz,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index profiles_phone_key on profiles (phone);

-- ------------------------------------------------------------ providers ----

-- The businesses that actually deliver the work and report client payments.
create table providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_email text not null,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------ campaigns ----

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references providers on delete restrict,
  kind campaign_kind not null,
  status campaign_status not null default 'draft',
  title text not null,
  summary text not null,

  -- Every campaign must answer these before it can go live.
  qualifying_rule text not null,
  funded_by text not null,
  reward_usd numeric(10, 2) not null check (reward_usd > 0),
  payout_terms text not null,

  opens_at timestamptz,
  closes_at timestamptz,
  created_at timestamptz not null default now(),

  constraint live_campaigns_are_fully_specified check (
    status <> 'live'
    or (length(qualifying_rule) > 0 and length(funded_by) > 0 and length(payout_terms) > 0)
  )
);

create index campaigns_status_idx on campaigns (status, kind);

-- ------------------------------------------------------ referral codes ----

-- One code per student per campaign. This is what attribution hangs on.
create table referral_codes (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns on delete cascade,
  student_id uuid not null references profiles on delete cascade,
  code text not null,
  created_at timestamptz not null default now(),
  unique (campaign_id, student_id)
);

create unique index referral_codes_code_key on referral_codes (lower(code));

-- ----------------------------------------------------------------- leads ----

create table leads (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns on delete restrict,
  student_id uuid not null references profiles on delete restrict,
  referral_code_id uuid references referral_codes on delete set null,

  business_name text not null,
  contact_name text not null,
  contact_phone text not null,
  contact_email text,
  need text not null,

  status lead_status not null default 'submitted',
  rejected_reason text,
  reviewed_by uuid references profiles,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- The duplicate control: the same business cannot be claimed twice on one
-- campaign while an earlier claim is still alive.
create unique index leads_one_live_claim_per_business
  on leads (campaign_id, lower(business_name))
  where status in ('submitted', 'in_review', 'qualified');

create index leads_student_idx on leads (student_id, created_at desc);

-- -------------------------------------------------------------- projects ----

-- A qualifying project: the agreed price is the denominator of every reward.
create table projects (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null unique references leads on delete restrict,
  provider_id uuid not null references providers on delete restrict,
  price_usd numeric(12, 2) not null check (price_usd > 0),
  status project_status not null default 'agreed',
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------- payments ----

create table project_payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  amount_usd numeric(12, 2) not null check (amount_usd > 0),
  status payment_status not null default 'pending',
  reference text,
  cleared_at timestamptz,
  created_at timestamptz not null default now()
);

create index project_payments_project_idx on project_payments (project_id, status);

-- ---------------------------------------------------------------- ledger ----

-- The reward split, as a setting rather than a magic number, so the whole
-- ledger moves together if the policy ever changes.
create table reward_policy (
  id boolean primary key default true check (id),
  withdrawable_share numeric(5, 4) not null default 0.80
    check (withdrawable_share > 0 and withdrawable_share <= 1)
);

insert into reward_policy (id) values (true) on conflict do nothing;

-- One row per project per student: the CURRENT earned total, not a running
-- tally of credits. Recomputed from cleared payments, so it cannot drift.
create table reward_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  student_id uuid not null references profiles on delete restrict,
  campaign_id uuid not null references campaigns on delete restrict,

  reward_usd numeric(10, 2) not null,
  cleared_usd numeric(12, 2) not null default 0,
  price_usd numeric(12, 2) not null,

  earned_usd numeric(10, 2) not null default 0,
  cash_usd numeric(10, 2) not null default 0,
  grow_usd numeric(10, 2) not null default 0,

  updated_at timestamptz not null default now(),
  unique (project_id, student_id)
);

create index reward_entries_student_idx on reward_entries (student_id);

-- Recompute a project's reward from cleared payments alone.
-- earned = reward x (cleared / price), clamped to the reward.
create or replace function recompute_project_reward(p_project_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_price numeric(12, 2);
  v_cleared numeric(12, 2);
  v_reward numeric(10, 2);
  v_student uuid;
  v_campaign uuid;
  v_share numeric(5, 4);
  v_earned numeric(10, 2);
begin
  select p.price_usd, l.student_id, l.campaign_id, c.reward_usd
    into v_price, v_student, v_campaign, v_reward
  from projects p
  join leads l on l.id = p.lead_id
  join campaigns c on c.id = l.campaign_id
  where p.id = p_project_id;

  if not found then
    return;
  end if;

  select coalesce(sum(amount_usd), 0) into v_cleared
  from project_payments
  where project_id = p_project_id and status = 'cleared';

  select withdrawable_share into v_share from reward_policy where id;

  v_earned := round(v_reward * least(greatest(v_cleared / v_price, 0), 1), 2);

  insert into reward_entries as re (
    project_id, student_id, campaign_id, reward_usd, cleared_usd, price_usd,
    earned_usd, cash_usd, grow_usd, updated_at
  )
  values (
    p_project_id, v_student, v_campaign, v_reward, v_cleared, v_price,
    v_earned, round(v_earned * v_share, 2), round(v_earned * (1 - v_share), 2), now()
  )
  on conflict (project_id, student_id) do update set
    reward_usd = excluded.reward_usd,
    cleared_usd = excluded.cleared_usd,
    price_usd = excluded.price_usd,
    earned_usd = excluded.earned_usd,
    cash_usd = excluded.cash_usd,
    grow_usd = excluded.grow_usd,
    updated_at = now();
end;
$$;

create or replace function trg_recompute_reward()
returns trigger
language plpgsql
as $$
begin
  perform recompute_project_reward(coalesce(new.project_id, old.project_id));
  return null;
end;
$$;

create trigger project_payments_recompute
after insert or update or delete on project_payments
for each row execute function trg_recompute_reward();

-- --------------------------------------------------------------- payouts ----

create table payouts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles on delete restrict,
  amount_usd numeric(10, 2) not null check (amount_usd > 0),
  amount_ngn numeric(14, 2) not null,
  rate_ngn_per_usd numeric(10, 2) not null,
  status payout_status not null default 'requested',
  bank_reference text,
  requested_at timestamptz not null default now(),
  paid_at timestamptz
);

create index payouts_student_idx on payouts (student_id, requested_at desc);

-- ---------------------------------------------------- video submissions ----

create table video_submissions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns on delete restrict,
  student_id uuid not null references profiles on delete restrict,
  asset_url text not null,
  posted_url text,
  status submission_status not null default 'submitted',
  rejected_reason text,
  reviewed_by uuid references profiles,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------- signups ----

-- Pre-launch interest from the marketing site. Deliberately separate from
-- profiles: nobody is a student on the platform until they are verified.
create table signups (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  university text,
  audience text not null default 'student' check (audience in ('student', 'business')),
  note text,
  source text,
  created_at timestamptz not null default now()
);

create unique index signups_phone_key on signups (phone, audience);
