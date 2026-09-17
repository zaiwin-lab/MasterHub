-- =====================================================================
--  ProgramOS Lite — Row Level Security audit
--
--  Run in: Supabase dashboard -> SQL Editor -> New query -> Run
--  Project: avnnuxotsoqykoqlizbk
--
--  Read-only. Nothing here changes data, tables or policies.
--
--  Why this matters: the app reads and writes all six tables with no
--  authenticated session, using the public anon key that ships in the
--  browser bundle. RLS is therefore the only thing standing between
--  participant records and the open internet — the admin panel's
--  sessionStorage gate is cosmetic and enforces nothing.
-- =====================================================================


-- 1 ── Is RLS switched on at all? ------------------------------------
--    Any row returned by this query is a table with NO protection.
--    Expect zero rows. Anything listed here is readable and writable
--    by anyone holding the anon key.

select tablename as table_with_rls_disabled
from pg_tables
where schemaname = 'public'
  and not rowsecurity
order by tablename;


-- 2 ── RLS status for every table ------------------------------------

select
  tablename,
  case when rowsecurity then 'enabled' else 'DISABLED' end as rls
from pg_tables
where schemaname = 'public'
order by tablename;


-- 3 ── Every policy, in full -----------------------------------------
--    The columns that matter:
--      roles      — 'anon' means unauthenticated visitors. 'authenticated'
--                   means a signed-in Supabase Auth user.
--      cmd        — which operation the policy covers (ALL/SELECT/INSERT/…)
--      qual       — the USING clause: which existing rows it exposes
--      with_check — the WITH CHECK clause: which new rows it accepts
--
--    A policy with roles containing 'anon' AND qual of 'true' exposes
--    that whole table to the public internet.

select
  tablename,
  policyname,
  case when permissive = 'PERMISSIVE' then 'permissive' else 'restrictive' end as kind,
  roles,
  cmd,
  qual       as using_clause,
  with_check as with_check_clause
from pg_policies
where schemaname = 'public'
order by tablename, policyname;


-- 4 ── The blunt verdict ---------------------------------------------
--    Flags policies that grant blanket access. Anything reported as
--    'PUBLIC READ/WRITE' should be treated as exposed data.

select
  tablename,
  policyname,
  roles,
  cmd,
  case
    when 'anon' = any (roles) and coalesce(qual, 'true') = 'true'
      then 'PUBLIC READ/WRITE — anyone with the anon key'
    when 'anon' = any (roles)
      then 'anon access, but conditional — read the using clause'
    when 'authenticated' = any (roles) and coalesce(qual, 'true') = 'true'
      then 'any signed-in user sees everything'
    else 'conditional — read the using clause'
  end as assessment
from pg_policies
where schemaname = 'public'
order by
  case
    when 'anon' = any (roles) and coalesce(qual, 'true') = 'true' then 1
    when 'anon' = any (roles) then 2
    else 3
  end,
  tablename;


-- 5 ── Table-level grants --------------------------------------------
--    RLS only applies once the role has a grant at all. A table with no
--    grant to anon is unreachable regardless of policy.

select
  table_name,
  grantee,
  string_agg(privilege_type, ', ' order by privilege_type) as privileges
from information_schema.role_table_grants
where table_schema = 'public'
  and grantee in ('anon', 'authenticated')
group by table_name, grantee
order by table_name, grantee;


-- 6 ── Row counts, for a sense of exposure ---------------------------
--    How much real participant data is behind whatever the above found.

select 'participants'       as tbl, count(*) from public.participants
union all select 'company_profiles',   count(*) from public.company_profiles
union all select 'attendance',         count(*) from public.attendance
union all select 'assessment_results', count(*) from public.assessment_results
union all select 'action_plans',       count(*) from public.action_plans
union all select 'reflections',        count(*) from public.reflections
order by tbl;
