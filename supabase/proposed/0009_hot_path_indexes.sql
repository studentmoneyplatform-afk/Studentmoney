-- Index the two columns the reward recompute joins on.
--
-- Why: trg_recompute_from_referral fires AFTER INSERT OR UPDATE OR DELETE on
-- referral_events, FOR EACH ROW. Every one of those runs
-- recompute_opportunity_reward, which does:
--
--     from referral_events re
--     join referral_links rl on rl.id = re.referral_link_id
--     where rl.participation_id = p_participation_id
--
-- Postgres does not index foreign keys automatically, and neither
-- referral_events.referral_link_id nor referral_links.participation_id has an
-- index. Both sides of that join are sequential scans, inside a trigger that
-- runs on every referral event. It is unnoticeable at a few hundred rows and
-- becomes a write-latency problem well before a few hundred thousand.
--
-- Safe to apply: additive, no data change, no lock worth worrying about at
-- current size. CONCURRENTLY avoids taking a write lock at all, but cannot run
-- inside a transaction block - if the migration runner wraps statements, drop
-- the word CONCURRENTLY from both lines.

create index concurrently if not exists referral_events_link_idx
  on referral_events (referral_link_id);

create index concurrently if not exists referral_links_participation_idx
  on referral_links (participation_id);
