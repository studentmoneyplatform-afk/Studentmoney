-- ===================================================== joining, and the code
-- referral_links had a select policy and no insert policy, with row level
-- security on. A student could read a tracking code they had no way to
-- create, so joining always half-succeeded: the participation saved, the code
-- was refused, and the dashboard offered a referral link that did not exist.
--
-- Retrying could not help either. The second attempt hit the unique
-- constraint on participations, reported "already joined", and returned
-- before it ever reached the code again -- so anyone who joined during this
-- period is stuck with no code for good.
--
-- Rather than add an insert policy, joining becomes one function. The two
-- writes belong together, the code is generated where its uniqueness is
-- enforced so a collision can be retried, and a participation that is missing
-- its code gets one the next time the student asks. Students still cannot
-- insert into referral_links directly, which is the right answer: a tracking
-- code should only ever come from joining.

create or replace function generate_referral_code(p_len int)
returns text
language plpgsql
as $$
declare
  -- No 0/O and no 1/I: these are read aloud and typed on phones.
  k_alphabet constant text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  v_out text := '';
  v_i int;
begin
  for v_i in 1..p_len loop
    v_out := v_out || substr(k_alphabet, 1 + floor(random() * length(k_alphabet))::int, 1);
  end loop;
  return v_out;
end;
$$;

-- Returns a status rather than raising, so the caller can tell a refusal
-- ("you are not verified") from a fault without parsing error text.
create or replace function join_opportunity(p_slug text)
returns table (status text, code text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_opportunity_id uuid;
  v_participation_id uuid;
  v_existing_code text;
  v_code text;
  v_attempt int := 0;
  v_already boolean := false;
begin
  if v_user is null then
    return query select 'not_signed_in'::text, null::text;
    return;
  end if;

  -- The same conditions the participations insert policy states. They are
  -- repeated because a definer function runs past that policy, so this is
  -- where they have to hold.
  if not exists (
    select 1 from profiles p where p.id = v_user and p.verified_at is not null
  ) then
    return query select 'not_verified'::text, null::text;
    return;
  end if;

  select o.id into v_opportunity_id
  from opportunities o
  where o.slug = p_slug and o.status = 'live';

  if v_opportunity_id is null then
    return query select 'not_open'::text, null::text;
    return;
  end if;

  select p.id into v_participation_id
  from participations p
  where p.opportunity_id = v_opportunity_id and p.student_id = v_user;

  if v_participation_id is null then
    insert into participations (opportunity_id, student_id)
    values (v_opportunity_id, v_user)
    returning id into v_participation_id;
  else
    v_already := true;
  end if;

  -- An existing code is never reissued: it may already be in circulation.
  select rl.code into v_existing_code
  from referral_links rl
  where rl.participation_id = v_participation_id;

  if v_existing_code is not null then
    return query select (case when v_already then 'already' else 'ok' end)::text, v_existing_code;
    return;
  end if;

  -- Generated here, where the unique index is, so a collision is a retry
  -- rather than an error the student has to read.
  loop
    v_attempt := v_attempt + 1;
    v_code := left(upper(split_part(p_slug, '-', 1)), 4) || '-' || generate_referral_code(6);
    begin
      insert into referral_links (participation_id, code) values (v_participation_id, v_code);
      exit;
    exception
      when unique_violation then
        if v_attempt >= 10 then
          raise;
        end if;
    end;
  end loop;

  return query select (case when v_already then 'already' else 'ok' end)::text, v_code;
end;
$$;

revoke all on function join_opportunity(text) from public;
grant execute on function join_opportunity(text) to authenticated;
