# angkasatda — Supabase

The live site already runs against Supabase project
`avnnuxotsoqykoqlizbk`. Nothing needs connecting in the app; what is
missing is visibility into that database from here.

## Tables (6)

`participants` · `company_profiles` · `attendance` ·
`assessment_results` · `action_plans` · `reflections`

Recovered from the production bundle — see `../recovered/SITE-MAP.md`.

## Run the RLS audit first

`rls-audit.sql` is read-only and answers the one open security question
in this project: **is participant data actually protected?**

1. Supabase dashboard → SQL Editor → New query
2. Paste `rls-audit.sql`, Run
3. Read the results as below

### How to read it

**Query 1 returns rows** → those tables have RLS switched off entirely.
Anyone holding the anon key — which ships publicly in the browser bundle
— can read and write them. Treat participant PII as exposed and fix
before anything else.

**Query 4 reports `PUBLIC READ/WRITE`** → same conclusion for those
tables: the policy grants blanket access to unauthenticated visitors.

**Query 4 reports `any signed-in user sees everything`** → acceptable
for a trusted internal tool, not for participant records across
different cooperatives. Worth tightening so a participant sees only
their own rows.

**Nothing flagged** → good. The `sessionStorage` admin gate is still
cosmetic and should still be replaced with real auth, but the data
itself is not sitting open.

## Then back up the schema

Once the connector is available, or from the dashboard, export the
schema here as `schema.sql` — the way `MVP-CRM/supabase/schema.sql`
does. Right now the database structure exists in exactly one place: the
live project. There is no copy in version control.

## Then fix auth

See `../IMPROVEMENTS.md` P0. In short: Supabase Auth with a real account
for admin, email OTP for participants, and RLS policies keyed to the
resulting JWT rather than to nothing.
