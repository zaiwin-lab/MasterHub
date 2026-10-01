import type { Metadata } from 'next';
import { isAdmin } from '@/lib/admin-auth';
import { db, normalise } from '@/lib/db';
import { AdminTable, type AdminRow } from './AdminTable';
import { LoginForm } from './LoginForm';
import './admin.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin · Alumni UTHM Borneo', robots: { index: false, follow: false } };

const COLUMNS =
  'id, contribution_id, type, name, organisation_name, email, mobile, purpose, amount, remark, toyyibpay_bill_code, toyyibpay_transaction_id, payment_status, created_at, paid_at, receipt_url, receipt_emailed_at';

export default async function AdminPage() {
  if (!process.env.ADMIN_PASSWORD || (process.env.ADMIN_SESSION_SECRET ?? '').length < 32) {
    return (
      <main className="admin">
        <p className="admin-error">
          Admin is not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET (32+ characters) in the environment.
        </p>
      </main>
    );
  }
  if (!(await isAdmin())) return <LoginForm />;

  const { data, error } = await db()
    .from('contributions')
    .select(COLUMNS)
    .order('created_at', { ascending: false })
    .limit(5000);

  if (error) {
    return (
      <main className="admin">
        <p className="admin-error">Could not load contributions: {error.message}</p>
      </main>
    );
  }
  const rows = (data ?? []).map((r) => normalise(r) as unknown as AdminRow);
  return <AdminTable initialRows={rows} />;
}
