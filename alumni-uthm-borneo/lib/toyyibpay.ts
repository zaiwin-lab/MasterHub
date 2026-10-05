// ToyyibPay API client. Docs: https://toyyibpay.com/apireference/
// Server-side only: callers pass config so this module stays testable.

export interface ToyyibpayConfig {
  baseUrl: string;
  secretKey: string;
  categoryCode: string;
  paymentChannel: string;
  chargeToCustomer: string;
  /** Offer DuitNow QR on the bill page. Needs DuitNow QR activated on the ToyyibPay account. */
  duitNowQr: boolean;
  /** '0' = QR fee on bill owner, '1' = QR fee on payer. */
  duitNowQrCharge: string;
}

export interface CreateBillParams {
  contributionId: string;
  amount: number; // RM
  description: string;
  payerName: string;
  payerEmail: string;
  payerPhone: string;
  returnUrl: string;
  callbackUrl: string;
}

export interface BillTransaction {
  billpaymentStatus?: string; // "1" success, "2" pending, "3" failed, "4" pending
  billpaymentAmount?: string; // "50.00"
  billpaymentInvoiceNo?: string; // ToyyibPay transaction reference
  billPaymentDate?: string;
  billExternalReferenceNo?: string;
  [key: string]: unknown;
}

export type TransactionVerdict =
  | { status: 'PAID'; transactionId: string; paidAmount: number }
  | { status: 'FAILED' }
  | { status: 'PENDING' };

/** ToyyibPay only accepts letters, numbers, spaces and underscores in bill name/description. */
export function toyyibText(text: string, max: number): string {
  return text
    .normalize('NFKD')
    .replace(/[^A-Za-z0-9 _]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
    .trim();
}

export function toCents(amount: number): string {
  return String(Math.round(amount * 100));
}

async function post(cfg: ToyyibpayConfig, path: string, fields: Record<string, string>): Promise<string> {
  const res = await fetch(`${cfg.baseUrl}/index.php/api/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields),
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`ToyyibPay ${path} HTTP ${res.status}: ${text.slice(0, 200)}`);
  return text;
}

export function parseCreateBillResponse(text: string): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`ToyyibPay createBill unexpected response: ${text.slice(0, 200)}`);
  }
  const first = Array.isArray(parsed) ? parsed[0] : parsed;
  const code = first && typeof first === 'object' ? (first as Record<string, unknown>).BillCode : undefined;
  if (typeof code !== 'string' || !/^[A-Za-z0-9]+$/.test(code)) {
    throw new Error(`ToyyibPay createBill failed: ${text.slice(0, 200)}`);
  }
  return code;
}

/** ToyyibPay rejects the whole bill when DuitNow QR is requested but not activated on the account. */
export function isDuitNowNotActivated(text: string): boolean {
  return /duitnow\s*qr\s*is\s*not\s*activated/i.test(text);
}

export async function createBill(cfg: ToyyibpayConfig, p: CreateBillParams): Promise<{ billCode: string; paymentUrl: string }> {
  const fields: Record<string, string> = {
    userSecretKey: cfg.secretKey,
    categoryCode: cfg.categoryCode,
    billName: toyyibText('Alumni UTHM Borneo', 30),
    billDescription: toyyibText(p.description, 100) || 'Contribution',
    billPriceSetting: '1',
    billPayorInfo: '1',
    billAmount: toCents(p.amount),
    billReturnUrl: p.returnUrl,
    billCallbackUrl: p.callbackUrl,
    billExternalReferenceNo: p.contributionId,
    billTo: p.payerName.slice(0, 100),
    billEmail: p.payerEmail,
    billPhone: p.payerPhone.replace(/[^0-9+]/g, ''),
    billSplitPayment: '0',
    billSplitPaymentArgs: '',
    billPaymentChannel: cfg.paymentChannel,
    billChargeToCustomer: cfg.chargeToCustomer,
    billExpiryDays: '3',
  };

  let text: string;
  if (cfg.duitNowQr) {
    text = await post(cfg, 'createBill', { ...fields, enableDuitNowQR: '1', chargeDuitNowQR: cfg.duitNowQrCharge });
    if (isDuitNowNotActivated(text)) {
      // Never block a contribution over QR: fall back to online banking only.
      console.warn('[toyyibpay] DuitNow QR is not activated on this account; bill created with FPX only');
      text = await post(cfg, 'createBill', fields);
    }
  } else {
    text = await post(cfg, 'createBill', fields);
  }
  const billCode = parseCreateBillResponse(text);
  return { billCode, paymentUrl: `${cfg.baseUrl}/${billCode}` };
}

export function parseTransactions(text: string): BillTransaction[] {
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed.filter((t) => t && typeof t === 'object') : [];
  } catch {
    // ToyyibPay answers "No data found!" in plain text when no attempt exists yet.
    return [];
  }
}

/**
 * Decide the bill's state from ToyyibPay's own records.
 * PAID only when a successful transaction exists for this contribution with the expected amount.
 */
export function evaluateTransactions(
  txs: BillTransaction[],
  expected: { contributionId: string; amount: number },
): TransactionVerdict {
  const success = txs.find((t) => {
    if (String(t.billpaymentStatus) !== '1') return false;
    if (t.billExternalReferenceNo && t.billExternalReferenceNo !== expected.contributionId) return false;
    const paid = Number(t.billpaymentAmount);
    return Number.isFinite(paid) && Math.abs(paid - expected.amount) < 0.005;
  });
  if (success) {
    return {
      status: 'PAID',
      transactionId: String(success.billpaymentInvoiceNo || ''),
      paidAmount: Number(success.billpaymentAmount),
    };
  }
  const pending = txs.some((t) => ['2', '4'].includes(String(t.billpaymentStatus)));
  if (pending) return { status: 'PENDING' };
  if (txs.some((t) => String(t.billpaymentStatus) === '3')) return { status: 'FAILED' };
  return { status: 'PENDING' };
}

export async function getBillTransactions(cfg: ToyyibpayConfig, billCode: string): Promise<BillTransaction[]> {
  const text = await post(cfg, 'getBillTransactions', { billCode });
  return parseTransactions(text);
}
