/**
 * Manual payment flow (DuitNow QR / bank transfer + proof upload + admin verification)
 * against an in-memory database, in-memory storage and a mocked email API.
 * Proves: no receipt or email until an admin verifies, exactly once.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

type Row = Record<string, unknown>;
const table: Row[] = [];
const stored = new Map<string, { bytes: Uint8Array; contentType: string }>();
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
      proof_path: null,
      proof_uploaded_at: null,
      payment_reference: null,
      verified_at: null,
      rejection_reason: null,
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
  in(col: string, vals: unknown[]) {
    this.filters.push((r) => vals.includes(r[col]));
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

const storage = {
  from: (bucket: string) => ({
    upload: async (path: string, bytes: Uint8Array, opts: { contentType: string }) => {
      stored.set(`${bucket}/${path}`, { bytes, contentType: opts.contentType });
      return { data: { path }, error: null };
    },
    createSignedUrl: async (path: string) => ({ data: { signedUrl: `https://signed.test/${bucket}/${path}` }, error: null }),
  }),
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ from: () => new Query(), storage }),
}));

const emails: { to: string; subject: string; hasPdf: boolean }[] = [];
const fetchMock = vi.fn(async (url: string | URL, init?: RequestInit) => {
  const u = String(url);
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

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4]);
const PDF = new TextEncoder().encode('%PDF-1.7 test');

async function startPayment(body: Record<string, unknown> = validBody) {
  const { POST } = await import('@/app/api/contributions/route');
  return POST(new Request('https://portal.test/api/contributions', { method: 'POST', body: JSON.stringify(body) }));
}

async function uploadProof(token: string, bytes: Uint8Array, type = 'image/png', name = 'proof.png') {
  const { POST } = await import('@/app/api/proof/[token]/route');
  const form = new FormData();
  form.append('proof', new File([bytes as BlobPart], name, { type }));
  return POST(new Request(`https://portal.test/api/proof/${token}`, { method: 'POST', body: form }), {
    params: Promise.resolve({ token }),
  });
}

async function receipt(token: string) {
  const { GET } = await import('@/app/api/receipt/[token]/route');
  return GET(new Request(`https://portal.test/api/receipt/${token}`), { params: Promise.resolve({ token }) });
}

async function rowNow() {
  const { normalise } = await import('@/lib/db');
  return normalise(table[0]);
}

beforeEach(() => {
  table.length = 0;
  stored.clear();
  emails.length = 0;
  seq = 0;
  delete process.env.ADMIN_NOTIFY_EMAIL;
  fetchMock.mockClear();
  vi.stubGlobal('fetch', fetchMock);
});

describe('manual payment flow', () => {
  it('creates a PENDING contribution and sends the payer to the payment page', async () => {
    const res = await startPayment();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ contributionId: 'AUB-2026-000001', paymentUrl: `/pay/${table[0].access_token}` });
    expect(table[0]).toMatchObject({
      payment_status: 'PENDING',
      payment_method: 'duitnow_qr',
      email: 'aminah@example.com',
      remark: 'Payment for Alumni programme – 3 pax',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects requests without email or acknowledgement', async () => {
    const res = await startPayment({ ...validBody, email: '', acknowledged: false });
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.fields.email).toBeDefined();
    expect(json.fields.acknowledged).toBeDefined();
    expect(table).toHaveLength(0);
  });

  it('stores an uploaded proof privately and moves the row to AWAITING_VERIFICATION', async () => {
    await startPayment();
    const token = String(table[0].access_token);
    const res = await uploadProof(token, PNG);
    expect(res.status).toBe(200);
    expect(table[0].payment_status).toBe('AWAITING_VERIFICATION');
    expect(String(table[0].proof_path)).toMatch(/^AUB-2026-000001\/\d+\.png$/);
    expect(stored.get(`payment-proofs/${table[0].proof_path}`)?.contentType).toBe('image/png');
    // Uploading proof is not payment: still no receipt and no email to the payer.
    expect((await receipt(token)).status).toBe(404);
    expect(emails).toHaveLength(0);
  });

  it('accepts PDFs and identifies files by content, not by the declared type', async () => {
    await startPayment();
    const token = String(table[0].access_token);
    expect((await uploadProof(token, PDF, 'image/png', 'trick.png')).status).toBe(200);
    expect(String(table[0].proof_path)).toMatch(/\.pdf$/);
    const fake = new TextEncoder().encode('<html>not an image</html>');
    expect((await uploadProof(token, fake, 'image/png')).status).toBe(415);
  });

  it('refuses files over 4MB', async () => {
    await startPayment();
    const big = new Uint8Array(4 * 1024 * 1024 + 10);
    big.set(PNG);
    expect((await uploadProof(String(table[0].access_token), big)).status).toBe(413);
    expect(table[0].payment_status).toBe('PENDING');
  });

  it('notifies the admin inbox when proof arrives, if configured', async () => {
    process.env.ADMIN_NOTIFY_EMAIL = 'admin@kobis.test';
    await startPayment();
    await uploadProof(String(table[0].access_token), PNG);
    expect(emails).toEqual([
      { to: 'admin@kobis.test', subject: 'Proof of payment received – AUB-2026-000001', hasPdf: false },
    ]);
  });

  it('admin verification marks PAID and emails one PDF receipt; a second verify is refused', async () => {
    const { verifyPayment } = await import('@/lib/payments');
    await startPayment();
    const token = String(table[0].access_token);
    await uploadProof(token, PNG);

    const result = await verifyPayment(await rowNow(), 'RHB 123456');
    expect(result.emailed).toBe(true);
    expect(table[0]).toMatchObject({ payment_status: 'PAID', payment_reference: 'RHB 123456' });
    expect(table[0].paid_at).toBeTruthy();
    expect(table[0].receipt_emailed_at).toBeTruthy();
    expect(emails).toEqual([
      { to: 'aminah@example.com', subject: 'Thank You for Supporting Alumni UTHM Borneo – AUB-2026-000001', hasPdf: true },
    ]);

    await expect(verifyPayment(await rowNow(), 'again')).rejects.toThrow(/already verified/);
    expect(emails).toHaveLength(1);

    const pdf = await receipt(token);
    expect(pdf.status).toBe(200);
    expect(Buffer.from(await pdf.arrayBuffer()).subarray(0, 5).toString()).toBe('%PDF-');

    // Verified contributions no longer accept uploads.
    expect((await uploadProof(token, PNG)).status).toBe(409);
  });

  it('rejection keeps the receipt locked, tells the payer why, and allows a new upload', async () => {
    const { rejectPayment } = await import('@/lib/payments');
    await startPayment();
    const token = String(table[0].access_token);
    await uploadProof(token, PNG);

    await rejectPayment(await rowNow(), 'Amount not found in bank statement');
    expect(table[0]).toMatchObject({ payment_status: 'REJECTED', rejection_reason: 'Amount not found in bank statement' });
    expect((await receipt(token)).status).toBe(404);
    expect(emails).toHaveLength(1);
    expect(emails[0].subject).toBe('We could not verify your payment – AUB-2026-000001');
    expect(emails[0].hasPdf).toBe(false);

    expect((await uploadProof(token, PNG)).status).toBe(200);
    expect(table[0]).toMatchObject({ payment_status: 'AWAITING_VERIFICATION', rejection_reason: null });
  });

  it('verification still succeeds when email is not configured', async () => {
    const { verifyPayment } = await import('@/lib/payments');
    const saved = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;
    try {
      await startPayment();
      const result = await verifyPayment(await rowNow(), '');
      expect(result).toMatchObject({ emailed: false, emailError: 'Email is not configured' });
      expect(table[0].payment_status).toBe('PAID');
      expect(table[0].receipt_emailed_at).toBeNull();
    } finally {
      process.env.RESEND_API_KEY = saved;
    }
  });

  it('unknown or malformed tokens are refused', async () => {
    expect((await uploadProof('x'.repeat(32), PNG)).status).toBe(404);
    expect((await receipt('short')).status).toBe(404);
  });
});
