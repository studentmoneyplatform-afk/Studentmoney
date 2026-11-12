-- ================================================= being referred, no account
-- Until now the only way to become somebody's referral was to finish a Stormm
-- sign-up, because capture_referral was the one thing that wrote a referral.
-- That is the wrong shape for every opportunity we run: each of them refers a
-- customer to a partner -- software clients, music students -- and those
-- people want the partner's service, not a dashboard of their own.
--
-- This lets them say so without an account. It is callable by anon, which is
-- the point and also the risk, so it is written to be dull to abuse: it
-- returns a status and never anything about the referrer, it refuses repeats
-- and self-referrals, and it caps how fast one link can collect names.
--
-- None of that spends money. A row here is stage 'registered', which is a
-- claim; approval is a person's decision and remains untouched.

create or replace function register_interest(
  p_code text,
  p_label text,
  p_contact text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_link referral_links%rowtype;
  v_participation participations%rowtype;
  v_label text := btrim(coalesce(p_label, ''));
  v_contact text := btrim(coalesce(p_contact, ''));
  v_email text;
  v_phone text;
  v_owner_email text;
  v_owner_phone text;
  v_recent int;
begin
  if length(v_label) < 2 or length(v_contact) < 6 then
    return 'invalid';
  end if;

  select * into v_link from referral_links where lower(code) = lower(coalesce(p_code, ''));
  if not found then
    return 'unknown_code';
  end if;

  select * into v_participation from participations where id = v_link.participation_id;
  if not found then
    return 'unknown_code';
  end if;

  -- A closed opportunity takes no more names.
  if not exists (
    select 1 from opportunities o
    where o.id = v_participation.opportunity_id and o.status = 'live'
  ) then
    return 'closed';
  end if;

  -- One contact method, stored in whichever column it belongs to. Asking for
  -- both would mean holding more of somebody else's data than the referral
  -- needs.
  if position('@' in v_contact) > 1 then
    v_email := lower(v_contact);
  else
    v_phone := regexp_replace(v_contact, '[^0-9+]', '', 'g');
    if length(v_phone) < 10 then
      return 'invalid';
    end if;
  end if;

  -- Nobody refers themselves. The trigger on referral_events checks this too,
  -- but it raises, and a raise here would read as a fault rather than a
  -- refusal.
  select u.email, p.phone into v_owner_email, v_owner_phone
  from profiles p join auth.users u on u.id = p.id
  where p.id = v_participation.student_id;

  if (v_email is not null and v_email = lower(coalesce(v_owner_email, '')))
     or (v_phone is not null and v_phone = coalesce(v_owner_phone, '')) then
    return 'self';
  end if;

  if exists (
    select 1 from referral_events e
    where e.referral_link_id = v_link.id
      and (
        (v_email is not null and lower(e.referred_email) = v_email)
        or (v_phone is not null and e.referred_phone = v_phone)
      )
  ) then
    return 'duplicate';
  end if;

  -- A crude ceiling, not a rate limiter. Real throttling belongs at the edge
  -- where the IP is; this only stops one link quietly collecting thousands of
  -- names overnight before anyone looks.
  select count(*) into v_recent
  from referral_events e
  where e.referral_link_id = v_link.id
    and e.created_at > now() - interval '24 hours';

  if v_recent >= 50 then
    return 'too_many';
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
    v_label,
    v_email,
    v_phone,
    'registered'
  );

  return 'ok';
exception
  when others then
    return 'invalid';
end;
$$;

revoke all on function register_interest(text, text, text) from public;
grant execute on function register_interest(text, text, text) to anon, authenticated;
