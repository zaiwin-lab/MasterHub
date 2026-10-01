-- Alumni UTHM Borneo: contribution portal schema
-- Run once in Supabase → SQL Editor.

create extension if not exists pgcrypto;

create sequence if not exists contribution_seq start 1;

-- AUB-2026-000001
create or replace function next_contribution_id() returns text
language sql volatile as $$
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
