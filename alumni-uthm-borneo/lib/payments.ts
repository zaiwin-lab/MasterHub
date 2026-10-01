import 'server-only';
import { randomBytes } from 'node:crypto';
import { db, normalise, type ContributionRow } from './db';
import { sendReceiptEmail } from './email';
import { siteUrl, toyyibpayConfig } from './env';
import { renderReceipt } from './receipt';
import { displayName, type ContributionInput } from './rules';
import { createBill, evaluateTransactions, getBillTransactions } from './toyyibpay';

export function receiptNumber(row: Pick<ContributionRow, 'contribution_id'>): string {
  return `R-${row.contribution_id}`;
}

export function receiptPath(row: Pick<ContributionRow, 'access_token'>): string {
  return `/api/receipt/${row.access_token}`;
}

/**
 * Step 1: record the contribution, then open a ToyyibPay bill for it.
 * Returns the ToyyibPay URL the payer is redirected to.
 */
export async function startContribution(input: ContributionInput): Promise<{ contributionId: string; paymentUrl: string }> {
  const token = randomBytes(24).toString('base64url');
  const { data, error } = await db()
    .from('contributions')
    .insert({
      access_token: token,
      type: input.type,
      name: input.name.trim(),
      organisation_name: input.type === 'corporate' ? input.organisationName.trim() : null,
      email: input.email.trim().toLowerCase(),
      mobile: input.mobile.trim(),
      purpose: input.purpose,
      amount: input.amount,
      remark: input.remark.trim() || null,
      payment_status: 'PENDING',
    })
    .select('*')
    .single();
  if (error || !data) throw error ?? new Error('Insert failed');
  const row = normalise(data);

  const base = siteUrl();
  try {
    const { billCode, paymentUrl } = await createBill(toyyibpayConfig(), {
      contributionId: row.contribution_id,
      amount: row.amount,
      description: `${row.purpose} ${row.contribution_id}`,
      payerName: displayName(row),
      payerEmail: row.email,
      payerPhone: row.mobile,
      // Path-based token: ToyyibPay appends its own ?status_id=... query.
      returnUrl: `${base}/payment/return/${row.access_token}`,
      callbackUrl: `${base}/api/toyyibpay/callback`,
    });
    const { error: updateError } = await db()
      .from('contributions')
      .update({ toyyibpay_bill_code: billCode })
      .eq('id', row.id);
    if (updateError) throw updateError;
    return { contributionId: row.contribution_id, paymentUrl };
  } catch (err) {
    await db().from('contributions').update({ payment_status: 'FAILED' }).eq('id', row.id);
    throw err;
  }
}

/**
 * Step 2: ask ToyyibPay directly what happened to the bill.
 * Callback and return-URL parameters are never trusted on their own.
 * Exactly one caller wins the PENDING/FAILED → PAID transition and sends the receipt.
 */
export async function verifyContribution(row: ContributionRow): Promise<ContributionRow> {
  if (row.payment_status === 'PAID' || !row.toyyibpay_bill_code) return row;

  const txs = await getBillTransactions(toyyibpayConfig(), row.toyyibpay_bill_code);
  const verdict = evaluateTransactions(txs, { contributionId: row.contribution_id, amount: row.amount });

  if (verdict.status === 'PAID') {
    const { data, error } = await db()
      .from('contributions')
      .update({
        payment_status: 'PAID',
        paid_at: new Date().toISOString(),
        toyyibpay_transaction_id: verdict.transactionId || null,
        receipt_url: `${siteUrl()}${receiptPath(row)}`,
      })
      .eq('id', row.id)
      .neq('payment_status', 'PAID')
      .select('*');
    if (error) throw error;

    if (data && data.length === 1) {
      const paid = normalise(data[0]);
      await deliverReceipt(paid).catch((err) => console.error('[receipt-email]', paid.contribution_id, err));
      return paid;
    }
    // Another request finalised it first; return the stored state.
    const { data: current } = await db().from('contributions').select('*').eq('id', row.id).single();
    return current ? normalise(current) : row;
  }

  if (verdict.status === 'FAILED' && row.payment_status === 'PENDING') {
    await db().from('contributions').update({ payment_status: 'FAILED' }).eq('id', row.id).eq('payment_status', 'PENDING');
    return { ...row, payment_status: 'FAILED' };
  }

  return row;
}

export async function buildReceiptPdf(row: ContributionRow): Promise<Uint8Array> {
  if (row.payment_status !== 'PAID' || !row.paid_at) throw new Error('Receipt requested for an unpaid contribution');
  return renderReceipt({
    receiptNumber: receiptNumber(row),
    contributionId: row.contribution_id,
    date: new Date(row.paid_at),
    contributor: displayName(row),
    contactPerson: row.type === 'corporate' ? row.name : undefined,
    email: row.email,
    purpose: row.purpose,
    remark: row.remark,
    amount: row.amount,
    transactionRef: row.toyyibpay_transaction_id ?? '',
    status: 'PAID',
  });
}

/** Email the PDF receipt. Only ever called for PAID rows. */
export async function deliverReceipt(row: ContributionRow): Promise<void> {
  const pdf = await buildReceiptPdf(row);
  await sendReceiptEmail({
    to: row.email,
    toName: displayName(row),
    contributionId: row.contribution_id,
    amount: row.amount,
    purpose: row.purpose,
    remark: row.remark,
    pdf,
    pdfFilename: `${receiptNumber(row)}.pdf`,
  });
  await db().from('contributions').update({ receipt_emailed_at: new Date().toISOString() }).eq('id', row.id);
}
