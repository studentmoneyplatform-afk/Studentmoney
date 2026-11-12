-- ============================================================ referral engine
-- Turning a shared link into an attributed referral.
--
-- Two functions, because the two halves have different readers. Resolving a
-- code is done by a stranger who just clicked a link and must learn only
-- which opportunity it points at. Capturing a referral is done by that same
-- person once they have an account, and writes a row that belongs to someone
-- else entirely -- which row level security correctly forbids, so it goes
-- through a definer function with its own rules instead of a wider policy.

-- ---------------------------------------------------------------- resolving
-- A visitor following /r/<code> is not the link's owner, and referral_links
-- is owner-only. This returns the destination and nothing about who owns it:
-- no student id, no name, no counts.
create or replace function resolve_referral_code(p_code text)
returns table (opportunity_slug text, opportunity_name text)
language sql
security definer
set search_path = public
stable
as $$
  select o.slug, o.name
  from referral_links rl
  join participations p on p.id = rl.participation_id
  join opportunities o on o.id = p.opportunity_id
  where lower(rl.code) = lower(p_code)
    and o.status = 'live'
  limit 1;
$$;

revoke all on function resolve_referral_code(text) from public;
grant execute on function resolve_referral_code(text) to anon, authenticated;

-- ---------------------------------------------------------------- capturing
-- Called once, when the referred person finishes joining. A click on its own
-- is not a referral and earns nothing, so nothing is written until there is a
-- real account behind it.
--
-- Returns the new referral id, or null when the referral is not allowed. Null
-- rather than an exception: a bad or stale code must never stop somebody
-- completing their own sign-up.
create or replace function capture_referral(
  p_code text,
  p_label text,
  p_email text,
  p_phone text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_link referral_links%rowtype;
  v_participation participations%rowtype;
  v_new_id uuid;
begin
  if p_code is null or btrim(p_code) = '' then
    return null;
  end if;

  select * into v_link from referral_links where lower(code) = lower(p_code);
  if not found then
    return null;
  end if;

  select * into v_participation from participations where id = v_link.participation_id;
  if not found then
    return null;
  end if;

  -- Nobody refers themselves. The trigger on referral_events checks the email
  -- and phone as well; this catches the case where the same account follows
  -- its own link, which the trigger cannot see.
  if v_participation.student_id = auth.uid() then
    return null;
  end if;

  -- One referral per person per link, however many times they click it.
  if exists (
    select 1
    from referral_events e
    where e.referral_link_id = v_link.id
      and (
        (p_email is not null and e.referred_email is not null
          and lower(e.referred_email) = lower(p_email))
        or (p_phone is not null and e.referred_phone is not null
          and e.referred_phone = p_phone)
      )
  ) then
    return null;
  end if;

  insert into referral_events (
    referral_link_id,
    opportunity_id,
    student_id,
    referred_label,
    referred_email,
    referred_phone,
    stage
  ) values (
    v_link.id,
    v_participation.opportunity_id,
    v_participation.student_id,
    p_label,
    p_email,
    p_phone,
    'registered'
  )
  returning id into v_new_id;

  return v_new_id;
exception
  -- The self-referral trigger raises. Someone completing their own sign-up
  -- must still end up with an account, so the referral is dropped quietly and
  -- the caller carries on.
  when others then
    return null;
end;
$$;

revoke all on function capture_referral(text, text, text, text) from public;
grant execute on function capture_referral(text, text, text, text) to authenticated;
