-- =====================================================================
--  ProgramOS Lite — schema as it exists in production
--
--  Project: avnnuxotsoqykoqlizbk ("KBT EventOS", ap-northeast-2)
--  Captured: 17 Sep 2026
--
--  Reconstructed from the live database via the Supabase MCP connector.
--  This is a BACKUP / reference: until now the structure existed only in
--  the live project, with no copy in version control.
--
--  NOTE: the RLS policies at the bottom are what production currently
--  has. They are NOT a recommendation — see the warning there.
-- =====================================================================

-- Participants --------------------------------------------------------
-- Note: id is text, not uuid — the app generates its own identifiers.
create table if not exists public.participants (
  id         text primary key,
  event_slug text not null,
  mobile     text,
  data       jsonb not null,
  created_at timestamptz not null default now()
);

-- Cooperative / company profile, one per participant ------------------
create table if not exists public.company_profiles (
  participant_id text primary key references public.participants (id),
  data           jsonb not null,
  updated_at     timestamptz not null default now()
);

-- AI Readiness Snapshot result, one per participant -------------------
create table if not exists public.assessment_results (
  participant_id text primary key references public.participants (id),
  total_score    integer,
  data           jsonb not null,
  completed_at   timestamptz not null default now()
);

-- 90-day action plan, one per participant -----------------------------
create table if not exists public.action_plans (
  participant_id text primary key references public.participants (id),
  data           jsonb not null,
  submitted_at   timestamptz not null default now()
);

-- Journey reflections, many per participant ---------------------------
create table if not exists public.reflections (
  id             text primary key,
  participant_id text references public.participants (id),
  day_number     integer,
  data           jsonb not null,
  submitted_at   timestamptz not null default now()
);

-- Session attendance / QR check-in ------------------------------------
create table if not exists public.attendance (
  id             text primary key,
  participant_id text references public.participants (id),
  session        text not null,
  data           jsonb not null,
  marked_at      timestamptz not null default now()
);


-- =====================================================================
--  Row Level Security — CURRENT PRODUCTION STATE
--
--  ⚠️  These policies grant the `anon` role unrestricted read AND write
--      on every table. The anon key ships publicly in the browser
--      bundle, so in practice every table below is world-readable and
--      world-writable. RLS is enabled, but the policy makes it a no-op.
--
--      Recorded here because it is what production has, not because it
--      is correct. Do not treat this file as the target state.
--
--      Replacing these requires implementing auth first — the app has
--      no Supabase Auth session, so tightening the policies on their
--      own would take the live site down. See ../IMPROVEMENTS.md P0.
-- =====================================================================

alter table public.participants       enable row level security;
alter table public.company_profiles   enable row level security;
alter table public.assessment_results enable row level security;
alter table public.action_plans       enable row level security;
alter table public.reflections        enable row level security;
alter table public.attendance         enable row level security;

-- The policy every one of the six tables currently carries:
--
--   create policy "anon_all" on public.<table>
--     for all to anon
--     using (true) with check (true);


-- =====================================================================
--  Also present in this project
--
--  The same database also holds the KOBIS Connect / MVP-CRM tables —
--  companies, contacts, tasks, activity — under a "team access" policy
--  scoped `to authenticated`. Their schema lives in
--  MVP-CRM/supabase/schema.sql. All four are currently empty.
-- =====================================================================
