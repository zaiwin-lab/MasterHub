import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { pdfSafe, renderReceipt } from '@/lib/receipt';
import { buildReceiptEmail } from '@/lib/email-template';

describe('receipt PDF', () => {
  it('renders with long, accented and emoji remarks', async () => {
    const bytes = await renderReceipt({
      receiptNumber: 'R-AUB-2026-000001',
      contributionId: 'AUB-2026-000001',
      date: new Date('2026-10-01T04:00:00Z'),
      contributor: 'ABC Sdn Bhd',
      contactPerson: 'José Ñúñez',
      email: 'finance@abc.com.my',
      purpose: 'Corporate Contribution',
      remark: 'On behalf of ABC Sdn Bhd 🎓 — for the Anak Sarawak Award. '.repeat(6),
      amount: 3000,
      transactionRef: 'TP2026100112345',
      status: 'PAID',
    });
    expect(Buffer.from(bytes.slice(0, 5)).toString()).toBe('%PDF-');
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(1);
    expect(doc.getTitle()).toBe('Receipt R-AUB-2026-000001');
  });

  it('strips characters standard fonts cannot draw', () => {
    expect(pdfSafe('Café 🎓 “ok” – done')).toBe('Cafe "ok" - done');
  });
});

describe('receipt email', () => {
  it('uses the required subject and escapes HTML', () => {
    const e = buildReceiptEmail({
      contributionId: 'AUB-2026-000001',
      amount: 100,
      purpose: 'Alumni Programme',
      remark: '<script>x</script>',
    });
    expect(e.subject).toBe('Thank You for Supporting Alumni UTHM Borneo – AUB-2026-000001');
    expect(e.text).toContain('RM100.00');
    expect(e.html).not.toContain('<script>');
    expect(e.html).toContain('&lt;script&gt;');
  });
});
