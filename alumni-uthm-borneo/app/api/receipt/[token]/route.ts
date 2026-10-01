import { findByToken } from '@/lib/db';
import { buildReceiptPdf, receiptNumber } from '@/lib/payments';

export const runtime = 'nodejs';

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const row = await findByToken(token);
  // Receipts exist only for verified, paid contributions.
  if (!row || row.payment_status !== 'PAID') return new Response('Receipt not available', { status: 404 });

  const pdf = await buildReceiptPdf(row);
  return new Response(Buffer.from(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${receiptNumber(row)}.pdf"`,
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}
