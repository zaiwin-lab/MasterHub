-- ===========================================================================
-- KOBIS Website Growth Engine — Supabase setup
-- ---------------------------------------------------------------------------
-- HOW TO USE (one time, ~1 minute):
--   1. Open your Supabase project → "SQL Editor" → "New query".
--   2. Paste this whole file. Click "Run".
--   3. Done. Put your Project URL + anon key into config.js (see OWNER-RUNBOOK).
--
-- Each table stores rows as JSON documents (id + data). This means the app can
-- grow new fields without ever needing to touch the database again.
-- ===========================================================================

create table if not exists prospects      (id text primary key, data jsonb not null, updated_at timestamptz default now());
create table if not exists clients        (id text primary key, data jsonb not null, updated_at timestamptz default now());
create table if not exists orders         (id text primary key, data jsonb not null, updated_at timestamptz default now());
create table if not exists referrals      (id text primary key, data jsonb not null, updated_at timestamptz default now());
create table if not exists credit_wallets (id text primary key, data jsonb not null, updated_at timestamptz default now());
create table if not exists waitlist       (id text primary key, data jsonb not null, updated_at timestamptz default now());
create table if not exists team_members   (id text primary key, data jsonb not null, updated_at timestamptz default now());

-- ---------------------------------------------------------------------------
-- Security (Row Level Security).
--
-- LAUNCH MODE (below): the public anon key can read & write. This gets you
-- live immediately and is fine for early, low-volume use where only your team
-- has the links. When you grow, harden this by adding Supabase Auth and
-- restricting writes to logged-in staff (see the commented block at the end).
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['prospects','clients','orders','referrals','credit_wallets','waitlist','team_members']
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists kobis_anon_all on %I;', t);
    execute format($p$create policy kobis_anon_all on %I for all to anon using (true) with check (true);$p$, t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- LATER: hardened mode (optional). When you add staff login, replace the
-- policy above with: public can READ previews, only authenticated staff WRITE.
--
--   drop policy if exists kobis_anon_all on prospects;
--   create policy read_public  on prospects for select to anon using (true);
--   create policy write_staff  on prospects for all to authenticated using (true) with check (true);
--   -- (repeat per table, scoping reads to what the public truly needs)
-- ---------------------------------------------------------------------------
