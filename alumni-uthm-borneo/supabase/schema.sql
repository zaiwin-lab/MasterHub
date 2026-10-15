-- Alumni UTHM Borneo: contribution portal schema
-- Run once in Supabase → SQL Editor.

create extension if not exists pgcrypto;

create sequence if not exists contribution_seq start 1;

-- AUB-2026-000001
create or replace function next_contribution_id() returns text
language sql volatile
set search_path = public, pg_temp
as $$
  select 'AUB-' || to_char(now() at time zone 'Asia/Kuching', 'YYYY') || '-' ||
         lpad(nextval('contribution_seq')::text, 6, '0');
$$;

create table if not exists contributions (
  id                       uuid primary key default gen_random_uuid(),
  contribution_id          text not null unique default next_contribution_id(),
  -- Unguessable token used in the payment return URL and receipt link.
  access_token             text not null unique,
  type                     text not null check (type in ('individual', 'corporate')),
  name                     text not null,
  organisation_name        text,
  email                    text not null,
  mobile                   text not null,
  purpose                  text not null,
  amount                   numeric(12, 2) not null check (amount > 0),
  remark                   text,
  toyyibpay_bill_code      text unique,
  toyyibpay_transaction_id text,
  payment_status           text not null default 'PENDING'
                           check (payment_status in ('PENDING', 'PAID', 'FAILED')),
  created_at               timestamptz not null default now(),
  paid_at                  timestamptz,
  receipt_url              text,
  receipt_emailed_at       timestamptz
);

create index if not exists contributions_created_at_idx on contributions (created_at desc);
create index if not exists contributions_status_idx on contributions (payment_status);

-- Row Level Security on, with no policies: the table is reachable only by the
-- server using the service role key. The browser never talks to Supabase.
alter table contributions enable row level security;

-- Defence in depth: the public API roles get nothing, even if RLS were turned off.
revoke all on table contributions from anon, authenticated;
revoke all on sequence contribution_seq from anon, authenticated;
revoke execute on function next_contribution_id() from public, anon, authenticated;
grant execute on function next_contribution_id() to service_role;
grant usage on sequence contribution_seq to service_role;

-- ─── Manual payments: DuitNow QR / bank transfer to KOBIS Berhad ──────────
-- Payer uploads proof; an admin checks it against the bank statement and verifies.
alter table contributions
  add column if not exists payment_method text not null default 'duitnow_qr',
  add column if not exists proof_path text,
  add column if not exists proof_uploaded_at timestamptz,
  add column if not exists payment_reference text,
  add column if not exists verified_at timestamptz,
  add column if not exists rejection_reason text;

alter table contributions drop constraint if exists contributions_payment_status_check;
alter table contributions add constraint contributions_payment_status_check
  check (payment_status in ('PENDING', 'AWAITING_VERIFICATION', 'PAID', 'REJECTED', 'FAILED'));

-- Private bucket, no storage policies: only the server's service role can touch it.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('payment-proofs', 'payment-proofs', false, 4194304,
        array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
