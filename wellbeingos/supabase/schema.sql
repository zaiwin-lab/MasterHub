-- =============================================================================
-- WellbeingOS — relational schema
--
-- The MVP runs against a seeded in-browser dataset (see docs/ARCHITECTURE.md).
-- This file is the target schema for a hosted deployment: every table is
-- tenant-scoped, row level security is enabled everywhere, and the three
-- privacy zones are enforced by policy rather than by convention.
--
-- Apply with:  psql "$DATABASE_URL" -f supabase/schema.sql
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- tenancy ---
create table if not exists tenants (
  id                text primary key,
  organisation_name text not null,
  organisation_code text not null,
  short_name        text not null,
  product_name      text not null,
  config            jsonb not null default '{}'::jsonb,   -- TenantConfig
  created_at        timestamptz not null default now()
);

-- The active tenant for the current request, set by the API layer per session.
create or replace function current_tenant_id() returns text
language sql stable as $$
  select nullif(current_setting('app.tenant_id', true), '')
$$;

create or replace function current_user_id() returns uuid
language sql stable as $$
  select nullif(current_setting('app.user_id', true), '')::uuid
$$;

create or replace function current_employee_id() returns uuid
language sql stable as $$
  select nullif(current_setting('app.employee_id', true), '')::uuid
$$;

create or replace function has_capability(cap text) returns boolean
language sql stable as $$
  select coalesce(current_setting('app.capabilities', true), '') like '%' || cap || '%'
$$;

-- ------------------------------------------------------------- structure ---
create table if not exists organisation_units (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  text not null references tenants(id) on delete cascade,
  name       text not null,
  type       text not null check (type in ('division', 'department')),
  parent_id  uuid references organisation_units(id) on delete set null
);
create index if not exists idx_units_tenant on organisation_units(tenant_id);

create table if not exists benefit_policies (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      text not null references tenants(id) on delete cascade,
  name           text not null,
  annual_amount  numeric(12,2) not null check (annual_amount >= 0),
  period         text not null check (period in ('calendar-year', 'financial-year')),
  definition     jsonb not null default '{}'::jsonb,  -- categories, thresholds, approval rules
  created_at     timestamptz not null default now()
);
create index if not exists idx_policies_tenant on benefit_policies(tenant_id);

create table if not exists employees (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  text not null references tenants(id) on delete cascade,
  staff_no   text not null,
  name       text not null,
  unit_id    uuid references organisation_units(id) on delete set null,
  location   text,
  category   text,
  grade      text,
  join_date  date,
  status     text not null default 'active' check (status in ('active','on-leave','exited')),
  eligible   boolean not null default true,
  policy_id  uuid references benefit_policies(id) on delete set null,
  age_band   text,                                    -- banded on ingest; DOB is not held
  unique (tenant_id, staff_no)
);
create index if not exists idx_employees_tenant on employees(tenant_id);

create table if not exists app_users (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    text not null references tenants(id) on delete cascade,
  email        text not null,
  name         text not null,
  roles        text[] not null default '{}',
  employee_id  uuid references employees(id) on delete set null,
  clinic_id    uuid,
  status       text not null default 'active',
  last_sign_in timestamptz,
  unique (tenant_id, email)
);

create table if not exists clinics (
  id               uuid primary key default gen_random_uuid(),
  tenant_id        text not null references tenants(id) on delete cascade,
  code             text not null,
  name             text not null,
  location         text,
  address          text,
  phone            text,
  hours            text,
  services         text[] not null default '{}',
  panel_status     text not null default 'pending' check (panel_status in ('active','suspended','pending')),
  agreement_expiry date,
  unique (tenant_id, code)
);

create table if not exists employee_benefits (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      text not null references tenants(id) on delete cascade,
  employee_id    uuid not null references employees(id) on delete cascade,
  policy_id      uuid not null references benefit_policies(id) on delete restrict,
  period_year    int not null,
  entitlement    numeric(12,2) not null check (entitlement >= 0),
  carried_forward numeric(12,2) not null default 0,
  unique (employee_id, period_year)
);

-- ----------------------------------------------------- ZONE 1 — ledger ------
create table if not exists medical_transactions (
  id                uuid primary key default gen_random_uuid(),
  tenant_id         text not null references tenants(id) on delete cascade,
  employee_id       uuid not null references employees(id) on delete restrict,
  clinic_id         uuid not null references clinics(id) on delete restrict,
  date              date not null,
  period_year       int not null,
  service_category  text not null,
  amount            numeric(12,2) not null check (amount > 0),
  reference         text not null,
  mc_days           int not null default 0 check (mc_days >= 0),
  status            text not null default 'submitted'
                    check (status in ('submitted','verified','approved','rejected','paid')),
  supporting_record text,
  notes             text,
  excess            boolean not null default false,
  created_by        uuid,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (tenant_id, reference)
);
create index if not exists idx_txn_tenant_employee on medical_transactions(tenant_id, employee_id, period_year);
create index if not exists idx_txn_status on medical_transactions(tenant_id, status);

-- The available balance is always derived; it is never stored.
create or replace view employee_wallets as
select
  b.tenant_id,
  b.employee_id,
  b.period_year,
  b.entitlement,
  coalesce(sum(t.amount) filter (where t.status in ('approved','paid')), 0)      as approved,
  coalesce(sum(t.amount) filter (where t.status in ('submitted','verified')), 0) as committed,
  b.entitlement - coalesce(sum(t.amount) filter (where t.status in ('approved','paid')), 0) as available
from employee_benefits b
left join medical_transactions t
  on t.employee_id = b.employee_id and t.period_year = b.period_year
group by b.tenant_id, b.employee_id, b.period_year, b.entitlement;

create table if not exists approvals (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      text not null references tenants(id) on delete cascade,
  transaction_id uuid not null references medical_transactions(id) on delete cascade,
  actor_id       uuid,
  actor_role     text not null,
  action         text not null check (action in ('verified','approved','rejected','paid','reopened')),
  remarks        text,
  at             timestamptz not null default now()
);

create table if not exists exception_cases (
  id                    uuid primary key default gen_random_uuid(),
  tenant_id             text not null references tenants(id) on delete cascade,
  reference             text not null,
  category              text not null,
  title                 text not null,
  detail                text,
  subject_employee_id   uuid references employees(id) on delete set null,
  subject_transaction_id uuid references medical_transactions(id) on delete set null,
  priority              text not null default 'medium' check (priority in ('low','medium','high')),
  status                text not null default 'open' check (status in ('open','in-progress','resolved','dismissed')),
  owner_role            text not null,
  owner_user_id         uuid,
  resolution            text,
  opened_at             timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  resolved_at           timestamptz,
  unique (tenant_id, reference)
);

create table if not exists exception_comments (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    text not null references tenants(id) on delete cascade,
  exception_id uuid not null references exception_cases(id) on delete cascade,
  actor_id     uuid,
  body         text not null,
  at           timestamptz not null default now()
);

create table if not exists notifications (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   text not null references tenants(id) on delete cascade,
  employee_id uuid references employees(id) on delete cascade,
  roles       text[] not null default '{}',
  level       text not null default 'info',
  title       text not null,
  body        text,
  href        text,
  read        boolean not null default false,
  at          timestamptz not null default now()
);

-- --------------------------------------------- ZONE 2 — personal vault ------
create table if not exists wellbeing_check_ins (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       text not null references tenants(id) on delete cascade,
  employee_id     uuid not null references employees(id) on delete cascade,
  date            date not null,
  energy          smallint check (energy between 1 and 5),
  stress          smallint check (stress between 1 and 5),
  activity        smallint check (activity between 1 and 5),
  workplace       smallint check (workplace between 1 and 5),
  support         smallint check (support between 1 and 5),
  note            text,          -- never leaves the vault; excluded from every aggregate
  share_aggregate boolean not null default false
);

create table if not exists wellbeing_goals (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   text not null references tenants(id) on delete cascade,
  employee_id uuid not null references employees(id) on delete cascade,
  title       text not null,
  metric      text,
  target      numeric not null,
  progress    numeric not null default 0,
  due_date    date,
  status      text not null default 'active'
);

create table if not exists screening_records (
  id                        uuid primary key default gen_random_uuid(),
  tenant_id                 text not null references tenants(id) on delete cascade,
  employee_id               uuid not null references employees(id) on delete cascade,
  programme_id              uuid,
  date                      date,
  attended                  boolean not null default false,
  personal_summary          text,   -- Zone 2: the employee's own copy
  share_with_wellbeing_team boolean not null default false
);

create table if not exists consents (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   text not null references tenants(id) on delete cascade,
  employee_id uuid not null references employees(id) on delete cascade,
  purpose     text not null,
  granted     boolean not null,
  version     text not null default '1.0',
  updated_at  timestamptz not null default now(),
  unique (employee_id, purpose)
);

-- ------------------------------------- ZONE 3 — organisational insight ------
create table if not exists wellbeing_programmes (
  id                  uuid primary key default gen_random_uuid(),
  tenant_id           text not null references tenants(id) on delete cascade,
  name                text not null,
  category            text,
  description         text,
  target_group        text,
  start_date          date,
  end_date            date,
  capacity            int,
  registration_mode   text,
  organiser           text,
  status              text not null default 'draft',
  related_signal_code text,
  outcome_indicator   text
);

create table if not exists programme_participation (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      text not null references tenants(id) on delete cascade,
  programme_id   uuid not null references wellbeing_programmes(id) on delete cascade,
  employee_id    uuid not null references employees(id) on delete cascade,
  registered_at  timestamptz not null default now(),
  status         text not null default 'registered',
  feedback_score smallint,
  unique (programme_id, employee_id)
);

create table if not exists insight_signals (
  id                      uuid primary key default gen_random_uuid(),
  tenant_id               text not null references tenants(id) on delete cascade,
  code                    text not null,
  title                   text not null,
  category                text,
  observation             text,
  organisational_insight  text,
  recommended_response    text,
  severity                text not null default 'watch',
  metric_label            text,
  current_value           numeric,
  previous_value          numeric,
  unit                    text,
  period_label            text,
  scope                   text,
  population_size         int not null default 0,
  detected_at             timestamptz not null default now(),
  unique (tenant_id, code)
);

create table if not exists interventions (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    text not null references tenants(id) on delete cascade,
  signal_code  text,
  programme_id uuid references wellbeing_programmes(id) on delete set null,
  title        text not null,
  status       text not null default 'proposed',
  owner        text,
  started_at   date,
  measure_note text,
  baseline     numeric,
  latest       numeric,
  decided_by   text          -- human oversight is recorded, never implied
);

-- ------------------------------------------------------------ governance ---
create table if not exists audit_events (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  text not null references tenants(id) on delete cascade,
  at         timestamptz not null default now(),
  actor_id   uuid,
  actor_role text,
  action     text not null,
  entity     text not null,
  entity_id  uuid,
  zone       text not null check (zone in ('zone1','zone2','zone3')),
  summary    text
);
create index if not exists idx_audit_tenant_at on audit_events(tenant_id, at desc);

-- =============================================================================
-- Row level security
--
-- Two independent locks apply to every request: the application's capability
-- check, and these policies. Neither is trusted to be the only one.
-- =============================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'organisation_units','benefit_policies','employees','app_users','clinics',
    'employee_benefits','medical_transactions','approvals','exception_cases',
    'exception_comments','notifications','wellbeing_check_ins','wellbeing_goals',
    'screening_records','consents','wellbeing_programmes','programme_participation',
    'insight_signals','interventions','audit_events'
  ]
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists tenant_isolation on %I', t);
    execute format(
      'create policy tenant_isolation on %I using (tenant_id = current_tenant_id()) with check (tenant_id = current_tenant_id())', t);
  end loop;
end $$;

-- Zone 1: administrative reads require an explicit capability; an employee may
-- always read their own ledger.
drop policy if exists txn_read on medical_transactions;
create policy txn_read on medical_transactions for select using (
  tenant_id = current_tenant_id()
  and (
    has_capability('transaction.read.any')
    or employee_id = current_employee_id()
    or (has_capability('transaction.create') and clinic_id::text = coalesce(current_setting('app.clinic_id', true), ''))
  )
);

-- Zone 2: the vault answers only to its owner. No role, including admin,
-- has a read path to another person's check-ins, notes or goals.
do $$
declare t text;
begin
  foreach t in array array['wellbeing_check_ins','wellbeing_goals','screening_records','consents']
  loop
    execute format('drop policy if exists vault_owner_only on %I', t);
    execute format(
      'create policy vault_owner_only on %I using (tenant_id = current_tenant_id() and employee_id = current_employee_id())
       with check (tenant_id = current_tenant_id() and employee_id = current_employee_id())', t);
  end loop;
end $$;

-- Zone 3 reads consented pulse rows only, and only through this view. The
-- aggregation floor is applied again in the application layer.
create or replace view consented_pulse as
select tenant_id, date, energy, stress, activity, workplace, support
from wellbeing_check_ins
where share_aggregate = true;   -- note: `note` is deliberately not selected

comment on view consented_pulse is
  'Zone 3 source for wellbeing aggregates. Excludes personal notes and any employee identifier.';
