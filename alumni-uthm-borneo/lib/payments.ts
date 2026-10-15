import 'server-only';
import { randomBytes } from 'node:crypto';
import { db, normalise, PROOF_BUCKET, type ContributionRow } from './db';
import { emailEnabled, sendNoticeEmail, sendReceiptEmail } from './email';
import { siteUrl } from './env';
import { renderReceipt } from './receipt';
import { displayName, formatRM2, PROOF_TYPES, type ContributionInput, type ProofMime } from './rules';

export function receiptNumber(row: Pick<ContributionRow, 'contribution_id'>): string {
  return `R-${row.contribution_id}`;
}

export function receiptPath(row: Pick<ContributionRow, 'access_token'>): string {
  return `/api/receipt/${row.access_token}`;
}

export function payPath(row: Pick<ContributionRow, 'access_token'>): string {
  return `/pay/${row.access_token}`;
}

/** Proof can be (re)submitted until an admin verifies the payment. */
export function canSubmitProof(row: Pick<ContributionRow, 'payment_status'>): boolean {
  return ['PENDING', 'AWAITING_VERIFICATION', 'REJECTED'].includes(row.payment_status);
}

/** Step 1: record the contribution. The payer is then shown the QR / bank details. */
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
      payment_method: 'duitnow_qr',
    })
    .select('*')
    .single();
  if (error || !data) throw error ?? new Error('Insert failed');
  const row = normalise(data);
  return { contributionId: row.contribution_id, paymentUrl: payPath(row) };
}

/** Step 2: payer uploads proof. Stored privately; the row waits for an admin. */
export async function saveProof(row: ContributionRow, bytes: Uint8Array, mime: ProofMime): Promise<ContributionRow> {
  if (!canSubmitProof(row)) throw new Error('This contribution no longer accepts proof uploads');

  const path = `${row.contribution_id}/${Date.now()}.${PROOF_TYPES[mime]}`;
  const { error: uploadError } = await db()
    .storage.from(PROOF_BUCKET)
    .upload(path, bytes, { contentType: mime, upsert: false });
  if (uploadError) throw uploadError;

  const { data, error } = await db()
    .from('contributions')
    .update({
      proof_path: path,
      proof_uploaded_at: new Date().toISOString(),
      payment_status: 'AWAITING_VERIFICATION',
      rejection_reason: null,
    })
    .eq('id', row.id)
    .in('payment_status', ['PENDING', 'AWAITING_VERIFICATION', 'REJECTED'])
    .select('*');
  if (error) throw error;
  if (!data || data.length !== 1) throw new Error('This contribution no longer accepts proof uploads');
  const updated = normalise(data[0]);

  const notify = process.env.ADMIN_NOTIFY_EMAIL;
  if (notify && emailEnabled()) {
    await sendNoticeEmail(
      notify,
      `Proof of payment received – ${updated.contribution_id}`,
      [
        `${displayName(updated)} uploaded proof of payment.`,
        '',
        `Contribution ID: ${updated.contribution_id}`,
        `Amount: ${formatRM2(updated.amount)}`,
        `Purpose: ${updated.purpose}`,
        '',
        `Check it against the KOBIS Berhad bank statement, then verify or reject in the admin page:`,
        `${siteUrl()}/admin`,
      ].join('\n'),
    ).catch((err) => console.error('[proof-notify]', updated.contribution_id, err));
  }
  return updated;
}

export async function proofSignedUrl(row: ContributionRow): Promise<string | null> {
  if (!row.proof_path) return null;
  const { data, error } = await db().storage.from(PROOF_BUCKET).createSignedUrl(row.proof_path, 120);
  if (error) throw error;
  return data.signedUrl;
}

/**
 * Step 3 (admin): the money is confirmed on the bank statement. Mark PAID and email the receipt.
 * Only one request can win the transition, so a double click cannot send two receipts.
 */
export async function verifyPayment(
  row: ContributionRow,
  paymentReference: string,
): Promise<{ row: ContributionRow; emailed: boolean; emailError?: string }> {
  const now = new Date().toISOString();
  const { data, error } = await db()
    .from('contributions')
    .update({
      payment_status: 'PAID',
      paid_at: now,
      verified_at: now,
      payment_reference: paymentReference.trim() || null,
      rejection_reason: null,
      receipt_url: `${siteUrl()}${receiptPath(row)}`,
    })
    .eq('id', row.id)
    .in('payment_status', ['PENDING', 'AWAITING_VERIFICATION', 'REJECTED'])
    .select('*');
  if (error) throw error;
  if (!data || data.length !== 1) throw new Error('This contribution is already verified');
  const paid = normalise(data[0]);

  if (!emailEnabled()) return { row: paid, emailed: false, emailError: 'Email is not configured' };
  try {
    await deliverReceipt(paid);
    return { row: { ...paid, receipt_emailed_at: new Date().toISOString() }, emailed: true };
  } catch (err) {
    console.error('[receipt-email]', paid.contribution_id, err);
    return { row: paid, emailed: false, emailError: 'Receipt email could not be sent' };
  }
}

/** Step 3 (admin), the other way: payment not found or wrong amount. Payer can upload again. */
export async function rejectPayment(row: ContributionRow, reason: string): Promise<ContributionRow> {
  const { data, error } = await db()
    .from('contributions')
    .update({ payment_status: 'REJECTED', rejection_reason: reason.trim() })
    .eq('id', row.id)
    .in('payment_status', ['PENDING', 'AWAITING_VERIFICATION'])
    .select('*');
  if (error) throw error;
  if (!data || data.length !== 1) throw new Error('Only unverified contributions can be rejected');
  const rejected = normalise(data[0]);

  if (emailEnabled()) {
    await sendNoticeEmail(
      rejected.email,
      `We could not verify your payment – ${rejected.contribution_id}`,
      [
        'Salam & Greetings,',
        '',
        `We could not yet verify your payment of ${formatRM2(rejected.amount)} for ${rejected.contribution_id}.`,
        '',
        `Reason: ${rejected.rejection_reason}`,
        '',
        'You can upload a new proof of payment here:',
        `${siteUrl()}${payPath(rejected)}`,
        '',
        'Alumni UTHM Borneo',
        'Sarawak Chapter',
      ].join('\n'),
    ).catch((err) => console.error('[reject-notify]', rejected.contribution_id, err));
  }
  return rejected;
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
    paymentMethod: row.payment_method === 'toyyibpay' ? 'ToyyibPay (FPX)' : 'DuitNow QR / bank transfer',
    transactionRef: row.payment_reference ?? row.toyyibpay_transaction_id ?? '',
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
