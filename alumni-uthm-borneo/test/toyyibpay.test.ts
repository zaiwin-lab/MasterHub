import { describe, expect, it } from 'vitest';
import { evaluateTransactions, parseCreateBillResponse, parseTransactions, toCents, toyyibText } from '@/lib/toyyibpay';

const expected = { contributionId: 'AUB-2026-000001', amount: 100 };

describe('evaluateTransactions', () => {
  it('is PAID only for a successful transaction with the right amount and reference', () => {
    const v = evaluateTransactions(
      [{ billpaymentStatus: '1', billpaymentAmount: '100.00', billpaymentInvoiceNo: 'TP123', billExternalReferenceNo: 'AUB-2026-000001' }],
      expected,
    );
    expect(v).toEqual({ status: 'PAID', transactionId: 'TP123', paidAmount: 100 });
  });

  it('never marks PAID on an amount mismatch', () => {
    expect(evaluateTransactions([{ billpaymentStatus: '1', billpaymentAmount: '1.00' }], expected).status).not.toBe('PAID');
  });

  it('never marks PAID for another contribution reference', () => {
    const v = evaluateTransactions(
      [{ billpaymentStatus: '1', billpaymentAmount: '100.00', billExternalReferenceNo: 'AUB-2026-000099' }],
      expected,
    );
    expect(v.status).not.toBe('PAID');
  });

  it('reports FAILED and PENDING states', () => {
    expect(evaluateTransactions([{ billpaymentStatus: '3', billpaymentAmount: '100.00' }], expected).status).toBe('FAILED');
    expect(evaluateTransactions([{ billpaymentStatus: '2', billpaymentAmount: '100.00' }], expected).status).toBe('PENDING');
    expect(evaluateTransactions([], expected).status).toBe('PENDING');
  });

  it('a later success after a failure is PAID', () => {
    const v = evaluateTransactions(
      [
        { billpaymentStatus: '3', billpaymentAmount: '100.00' },
        { billpaymentStatus: '1', billpaymentAmount: '100.00', billpaymentInvoiceNo: 'TP2' },
      ],
      expected,
    );
    expect(v.status).toBe('PAID');
  });
});

describe('response parsing', () => {
  it('reads the bill code', () => {
    expect(parseCreateBillResponse('[{"BillCode":"gcbhict9"}]')).toBe('gcbhict9');
    expect(() => parseCreateBillResponse('KEY-DID-NOT-EXIST-OR-USER-IS-NOT-ACTIVE')).toThrow();
    expect(() => parseCreateBillResponse('[{"status":"error","msg":"x"}]')).toThrow();
  });

  it('treats "No data found!" as no transactions', () => {
    expect(parseTransactions('No data found!')).toEqual([]);
  });

  it('formats ToyyibPay fields', () => {
    expect(toCents(50)).toBe('5000');
    expect(toCents(10.1)).toBe('1010');
    expect(toyyibText('Programme / Event Payment AUB-2026-000001', 100)).toBe('Programme Event Payment AUB 2026 000001');
  });
});

describe('DuitNow QR fallback', () => {
  it('recognises the not-activated response', async () => {
    const { isDuitNowNotActivated } = await import('@/lib/toyyibpay');
    expect(isDuitNowNotActivated('[{"status":"error","msg":"DuitNow QR is not activated for your account. Please contact admin to register your POS ID."}]')).toBe(true);
    expect(isDuitNowNotActivated('[{"BillCode":"abc123"}]')).toBe(false);
  });
});
