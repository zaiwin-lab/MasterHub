/**
 * Full payment flow against an in-memory database and mocked ToyyibPay / email APIs.
 * Proves: receipts and emails only follow a ToyyibPay-verified success, exactly once.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

type Row = Record<string, unknown>;
const table: Row[] = [];
let seq = 0;

// Minimal stand-in for the Supabase query builder calls used by lib/payments.ts and the routes.
class Query {
  private filters: ((r: Row) => boolean)[] = [];
  private patch: Row | null = null;
  private insertRow: Row | null = null;
  private returning = false;
  private one: 'single' | 'maybe' | null = null;

  insert(row: Row) {
    seq += 1;
    this.insertRow = {
      id: `00000000-0000-4000-8000-${String(seq).padStart(12, '0')}`,
      contribution_id: `AUB-2026-${String(seq).padStart(6, '0')}`,
      created_at: new Date().toISOString(),
      toyyibpay_bill_code: null,
      toyyibpay_transaction_id: null,
      paid_at: null,
      receipt_url: null,
      receipt_emailed_at: null,
      ...row,
      amount: String(row.amount), // Supabase returns numeric as string
    };
    return this;
  }
  update(patch: Row) {
    this.patch = patch;
    return this;
  }
  select() {
    this.returning = true;
    return this;
  }
  eq(col: string, val: unknown) {
    this.filters.push((r) => r[col] === val);
    return this;
  }
  neq(col: string, val: unknown) {
    this.filters.push((r) => r[col] !== val);
    return this;
  }
  single() {
    this.one = 'single';
    return this;
  }
  maybeSingle() {
    this.one = 'maybe';
    return this;
  }
  private run(): unknown {
    if (this.insertRow) {
      table.push(this.insertRow);
      return { ...this.insertRow };
    }
    const hits = table.filter((r) => this.filters.every((f) => f(r)));
    if (this.patch) hits.forEach((r) => Object.assign(r, this.patch));
    const out = hits.map((r) => ({ ...r }));
    if (this.one) return out[0] ?? null;
    return this.returning || !this.patch ? out : null;
  }
  then<T1, T2>(ok?: (v: { data: unknown; error: null }) => T1, bad?: (e: unknown) => T2) {
    return Promise.resolve({ data: this.run(), error: null as null }).then(ok, bad);
  }
}

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ from: () => new Query() }),
}));

// ToyyibPay + email API mocks
let transactions: unknown[] = [];
const emails: { to: string; subject: string; hasPdf: boolean }[] = [];

const fetchMock = vi.fn(async (url: string | URL, init?: RequestInit) => {
  const u = String(url);
  if (u.endsWith('/index.php/api/createBill')) return new Response('[{"BillCode":"abc123xy"}]');
  if (u.endsWith('/index.php/api/getBillTransactions')) return new Response(JSON.stringify(transactions));
  if (u === 'https://api.resend.com/emails') {
    const body = JSON.parse(String(init?.body));
    emails.push({ to: body.to[0], subject: body.subject, hasPdf: body.attachments?.[0]?.content?.length > 100 });
    return new Response('{"id":"e1"}');
  }
  throw new Error(`Unexpected fetch ${u}`);
});

Object.assign(process.env, {
  NEXT_PUBLIC_SITE_URL: 'https://portal.test',
  SUPABASE_URL: 'https://x.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'service',
  TOYYIBPAY_BASE_URL: 'https://dev.toyyibpay.com',
  TOYYIBPAY_SECRET_KEY: 'secret',
  TOYYIBPAY_CATEGORY_CODE: 'cat',
  EMAIL_PROVIDER: 'resend',
  RESEND_API_KEY: 're_test',
  EMAIL_FROM_ADDRESS: 'receipts@portal.test',
});

const validBody = {
  type: 'individual',
  name: 'Aminah',
  organisationName: '',
  email: 'Aminah@Example.com',
  mobile: '0123456789',
  purpose: 'Alumni Programme',
  amount: 300,
  remark: 'Payment for Alumni programme – 3 pax',
  acknowledged: true,
};

async function startPayment(body: Record<string, unknown> = validBody) {
  const { POST } = await import('@/app/api/contributions/route');
  return POST(new Request('https://portal.test/api/contributions', { method: 'POST', body: JSON.stringify(body) }));
}

async function callback(billcode: string, status: string) {
  const { POST } = await import('@/app/api/toyyibpay/callback/route');
  const form = new URLSearchParams({ billcode, status, refno: 'TP999', order_id: 'AUB-2026-000001', amount: '30000' });
  return POST(
    new Request('https://portal.test/api/toyyibpay/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    }),
  );
}

async function receipt(token: string) {
  const { GET } = await import('@/app/api/receipt/[token]/route');
  return GET(new Request(`https://portal.test/api/receipt/${token}`), { params: Promise.resolve({ token }) });
}

beforeEach(() => {
  table.length = 0;
  emails.length = 0;
  transactions = [];
  seq = 0;
  fetchMock.mockClear();
  vi.stubGlobal('fetch', fetchMock);
});

describe('payment flow', () => {
  it('creates a PENDING contribution and returns the ToyyibPay URL', async () => {
    const res = await startPayment();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ contributionId: 'AUB-2026-000001', paymentUrl: 'https://dev.toyyibpay.com/abc123xy' });
    expect(table[0]).toMatchObject({
      payment_status: 'PENDING',
      toyyibpay_bill_code: 'abc123xy',
      email: 'aminah@example.com',
      remark: 'Payment for Alumni programme – 3 pax',
    });

    const createCall = fetchMock.mock.calls.find(([u]) => String(u).includes('createBill'))!;
    const sent = new URLSearchParams(String(createCall[1]!.body));
    expect(sent.get('billAmount')).toBe('30000');
    expect(sent.get('billExternalReferenceNo')).toBe('AUB-2026-000001');
    expect(sent.get('billReturnUrl')).toBe(`https://portal.test/payment/return/${table[0].access_token}`);
    expect(sent.get('billCallbackUrl')).toBe('https://portal.test/api/toyyibpay/callback');
  });

  it('rejects requests without email or acknowledgement, and never calls ToyyibPay', async () => {
    const res = await startPayment({ ...validBody, email: '', acknowledged: false });
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.fields.email).toBeDefined();
    expect(json.fields.acknowledged).toBeDefined();
    expect(table).toHaveLength(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('a forged "success" callback does not mark PAID when ToyyibPay has no successful transaction', async () => {
    await startPayment();
    transactions = [{ billpaymentStatus: '3', billpaymentAmount: '300.00' }];
    const res = await callback('abc123xy', '1'); // attacker claims success
    expect(res.status).toBe(200);
    expect(table[0].payment_status).toBe('FAILED');
    expect(emails).toHaveLength(0);
    expect((await receipt(String(table[0].access_token))).status).toBe(404);
  });

  it('a cancelled payment stays unpaid with no receipt', async () => {
    await startPayment();
    transactions = [];
    await callback('abc123xy', '3');
    expect(table[0].payment_status).toBe('PENDING');
    expect(emails).toHaveLength(0);
    expect((await receipt(String(table[0].access_token))).status).toBe(404);
  });

  it('a verified success marks PAID, emails one PDF receipt, and is idempotent', async () => {
    await startPayment();
    transactions = [
      {
        billpaymentStatus: '1',
        billpaymentAmount: '300.00',
        billpaymentInvoiceNo: 'TP2026100100001',
        billExternalReferenceNo: 'AUB-2026-000001',
      },
    ];
    await callback('abc123xy', '1');
    await callback('abc123xy', '1'); // ToyyibPay may retry callbacks

    expect(table[0]).toMatchObject({ payment_status: 'PAID', toyyibpay_transaction_id: 'TP2026100100001' });
    expect(table[0].paid_at).toBeTruthy();
    expect(table[0].receipt_emailed_at).toBeTruthy();
    expect(emails).toEqual([
      { to: 'aminah@example.com', subject: 'Thank You for Supporting Alumni UTHM Borneo – AUB-2026-000001', hasPdf: true },
    ]);

    const pdf = await receipt(String(table[0].access_token));
    expect(pdf.status).toBe(200);
    expect(pdf.headers.get('content-type')).toBe('application/pdf');
    expect(Buffer.from(await pdf.arrayBuffer()).subarray(0, 5).toString()).toBe('%PDF-');
  });

  it('an underpaid success is not accepted', async () => {
    await startPayment();
    transactions = [{ billpaymentStatus: '1', billpaymentAmount: '3.00', billpaymentInvoiceNo: 'TPX' }];
    await callback('abc123xy', '1');
    expect(table[0].payment_status).toBe('PENDING');
    expect(emails).toHaveLength(0);
  });

  it('unknown bill codes and junk receipt tokens are ignored', async () => {
    expect((await callback('nosuchbill', '1')).status).toBe(200);
    expect((await receipt('short')).status).toBe(404);
  });
});
