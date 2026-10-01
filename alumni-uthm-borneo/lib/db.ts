import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from './env';
import type { ContributionType, PaymentStatus } from './rules';

export interface ContributionRow {
  id: string;
  contribution_id: string;
  access_token: string;
  type: ContributionType;
  name: string;
  organisation_name: string | null;
  email: string;
  mobile: string;
  purpose: string;
  amount: number;
  remark: string | null;
  toyyibpay_bill_code: string | null;
  toyyibpay_transaction_id: string | null;
  payment_status: PaymentStatus;
  created_at: string;
  paid_at: string | null;
  receipt_url: string | null;
  receipt_emailed_at: string | null;
}

let client: SupabaseClient | null = null;

export function db(): SupabaseClient {
  if (!client) {
    const { url, serviceKey } = supabaseConfig();
    client = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return client;
}

/** Supabase returns numeric columns as strings; normalise once here. */
export function normalise(row: Record<string, unknown>): ContributionRow {
  return { ...(row as unknown as ContributionRow), amount: Number(row.amount) };
}

export async function findByToken(token: string): Promise<ContributionRow | null> {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) return null;
  const { data, error } = await db().from('contributions').select('*').eq('access_token', token).maybeSingle();
  if (error) throw error;
  return data ? normalise(data) : null;
}
