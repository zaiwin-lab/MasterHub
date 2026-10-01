'use client';

import { useMemo, useState } from 'react';
import { PURPOSES, displayName, formatRM2 } from '@/lib/rules';

export interface AdminRow {
  id: string;
  contribution_id: string;
  type: 'individual' | 'corporate';
  name: string;
  organisation_name: string | null;
  email: string;
  mobile: string;
  purpose: string;
  amount: number;
  remark: string | null;
  toyyibpay_bill_code: string | null;
  toyyibpay_transaction_id: string | null;
  payment_status: 'PENDING' | 'PAID' | 'FAILED';
  created_at: string;
  paid_at: string | null;
  receipt_url: string | null;
  receipt_emailed_at: string | null;
}

const dateFmt = new Intl.DateTimeFormat('en-MY', {
  timeZone: 'Asia/Kuching',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/** Neutralise spreadsheet formula injection and quote every cell. */
function csvCell(value: unknown): string {
  let s = value == null ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export function AdminTable({ initialRows }: { initialRows: AdminRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('PAID');
  const [type, setType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (status && r.payment_status !== status) return false;
      if (type && r.type !== type) return false;
      if (purpose && r.purpose !== purpose) return false;
      if (!needle) return true;
      return [r.contribution_id, r.name, r.organisation_name, r.email, r.mobile, r.remark, r.toyyibpay_transaction_id, r.toyyibpay_bill_code]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(needle));
    });
  }, [rows, q, status, type, purpose]);

  const paidTotal = filtered.filter((r) => r.payment_status === 'PAID').reduce((sum, r) => sum + r.amount, 0);

  function downloadCsv() {
    const header = ['Date', 'Contribution ID', 'Name / Organisation', 'Contact Person', 'Email', 'Mobile', 'Type', 'Purpose', 'Remark', 'Amount (RM)', 'ToyyibPay Reference', 'ToyyibPay Bill Code', 'Status', 'Paid At', 'Receipt Emailed At'];
    const lines = filtered.map((r) =>
      [
        dateFmt.format(new Date(r.created_at)),
        r.contribution_id,
        displayName(r),
        r.type === 'corporate' ? r.name : '',
        r.email,
        r.mobile,
        r.type,
        r.purpose,
        r.remark ?? '',
        r.amount.toFixed(2),
        r.toyyibpay_transaction_id ?? '',
        r.toyyibpay_bill_code ?? '',
        r.payment_status,
        r.paid_at ? dateFmt.format(new Date(r.paid_at)) : '',
        r.receipt_emailed_at ? dateFmt.format(new Date(r.receipt_emailed_at)) : '',
      ]
        .map(csvCell)
        .join(','),
    );
    const blob = new Blob(['﻿' + [header.map(csvCell).join(','), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `aub-contributions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function action(row: AdminRow, kind: 'resend' | 'recheck') {
    setBusyId(row.id);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/${kind}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: row.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Request failed');
      if (kind === 'recheck' && data.row) {
        const updated = { ...data.row, amount: Number(data.row.amount) } as AdminRow;
        setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, ...updated } : r)));
        setNotice({ kind: 'ok', text: `${row.contribution_id}: ToyyibPay status is ${data.status}.` });
      } else {
        setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, receipt_emailed_at: new Date().toISOString() } : r)));
        setNotice({ kind: 'ok', text: data.message || 'Receipt sent.' });
      }
    } catch (e) {
      setNotice({ kind: 'err', text: `${row.contribution_id}: ${(e as Error).message}` });
    }
    setBusyId(null);
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.reload();
  }

  return (
    <main className="admin">
      <header className="admin-head">
        <div>
          <div className="brand-name">ALUMNI UTHM BORNEO</div>
          <h1>Contributions</h1>
        </div>
        <button className="link-btn" onClick={logout}>
          Sign out
        </button>
      </header>

      <div className="admin-tools">
        <input className="input" type="search" placeholder="Search ID, name, email, remark, reference…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="">All statuses</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
        <select className="input" value={type} onChange={(e) => setType(e.target.value)} aria-label="Type">
          <option value="">All types</option>
          <option value="individual">Individual</option>
          <option value="corporate">Corporate</option>
        </select>
        <select className="input" value={purpose} onChange={(e) => setPurpose(e.target.value)} aria-label="Purpose">
          <option value="">All purposes</option>
          {PURPOSES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <button className="btn btn-outline" onClick={downloadCsv} disabled={filtered.length === 0}>
          Download CSV
        </button>
      </div>

      <p className="admin-summary">
        {filtered.length} record{filtered.length === 1 ? '' : 's'} · Paid total <strong>{formatRM2(paidTotal)}</strong>
      </p>
      {notice && (
        <p className={`admin-notice ${notice.kind}`} role="status">
          {notice.text}
        </p>
      )}

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Contribution ID</th>
              <th>Name / Organisation</th>
              <th>Email</th>
              <th>Type</th>
              <th>Purpose</th>
              <th>Remark</th>
              <th className="num">Amount</th>
              <th>ToyyibPay Ref</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="nowrap">{dateFmt.format(new Date(r.created_at))}</td>
                <td className="nowrap mono">{r.contribution_id}</td>
                <td>
                  {displayName(r)}
                  {r.type === 'corporate' && <div className="sub">{r.name}</div>}
                  <div className="sub">{r.mobile}</div>
                </td>
                <td>{r.email}</td>
                <td>{r.type === 'corporate' ? 'Corporate' : 'Individual'}</td>
                <td>{r.purpose}</td>
                <td className="remark">{r.remark}</td>
                <td className="num nowrap">{formatRM2(r.amount)}</td>
                <td className="mono">{r.toyyibpay_transaction_id || <span className="sub">{r.toyyibpay_bill_code}</span>}</td>
                <td>
                  <span className={`badge badge-${r.payment_status.toLowerCase()}`}>{r.payment_status}</span>
                  {r.payment_status === 'PAID' && !r.receipt_emailed_at && <div className="sub warn">Email not sent</div>}
                </td>
                <td className="nowrap">
                  {r.payment_status === 'PAID' ? (
                    <>
                      <button className="link-btn" disabled={busyId === r.id} onClick={() => action(r, 'resend')}>
                        {busyId === r.id ? 'Sending…' : 'Resend receipt'}
                      </button>
                      {r.receipt_url && (
                        <a className="link-btn" href={r.receipt_url}>
                          PDF
                        </a>
                      )}
                    </>
                  ) : r.toyyibpay_bill_code ? (
                    <button className="link-btn" disabled={busyId === r.id} onClick={() => action(r, 'recheck')}>
                      {busyId === r.id ? 'Checking…' : 'Re-check status'}
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="empty">
                  No contributions match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
