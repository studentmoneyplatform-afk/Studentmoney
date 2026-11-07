# StudentMoney

Learn. Connect. Create. Earn.

A student earning, referral and opportunity platform for Nigerian university
students. This repository holds the public website and the Supabase schema
behind it.

## Running it

```bash
npm install
cp .env.example .env.local   # then fill in the Supabase values
npm run dev
```

## Environment

| Variable | What it is |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key, safe in the browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only. Never import this into a client component. |
| `NEXT_PUBLIC_NGN_PER_USD` | The posted naira rate. Every dollar figure converts with it. |

Without the Supabase values the site still renders; the join form reports that
signups are not connected rather than pretending a submission was saved.

## The database

`supabase/migrations` holds the schema. Apply it in order:

1. `0001_core.sql` — tables, the reward ledger and `recompute_project_reward()`
2. `0002_rls.sql` — row level security

The ledger is never incremented by hand. `recompute_project_reward()` derives a
student's earned total from cleared payments alone, so a reward cannot be paid
twice and a refund reverses the part of the reward it funded. Nothing that
moves money is writable from the browser.

## Brand

Brand Pack v1, "The Ledger". All tokens live in `src/app/globals.css`; no
component hardcodes a hex value.

- **Forest** `#0E4B37` primary · **Cream** `#F1E9DA` ground · **Ink** `#16130F`
- **Hibiscus** `#B82A55` marks money earned or the Grow share, and nothing
  else. Never a background, a button or decoration. That rule is what makes it
  recognisable.
- Fraunces for headlines and every money figure, Plus Jakarta Sans for body
  and UI.
- Naira beside every dollar. The `<Money>` component enforces it.

## Writing rules

Lead with the number and the action. Say who pays and when. Never write
"guaranteed income", "easy money", "passive income", or an earning target
without the rules that apply to it.
