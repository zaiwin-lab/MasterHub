import { NextResponse } from 'next/server';
import { startContribution } from '@/lib/payments';
import { parseAmount, validateContribution, type ContributionInput } from '@/lib/rules';

export const runtime = 'nodejs';

const str = (v: unknown) => (typeof v === 'string' ? v : '');

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field.
  if (str(body.website)) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });

  const input: ContributionInput = {
    type: body.type === 'corporate' ? 'corporate' : 'individual',
    name: str(body.name),
    organisationName: str(body.organisationName),
    email: str(body.email),
    mobile: str(body.mobile),
    purpose: str(body.purpose),
    amount: parseAmount(body.amount),
    remark: str(body.remark).replace(/\r\n/g, '\n'),
    acknowledged: body.acknowledged === true,
  };

  const errors = validateContribution(input);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'Please check the highlighted fields.', fields: errors }, { status: 422 });
  }

  try {
    const { contributionId, paymentUrl } = await startContribution(input);
    return NextResponse.json({ contributionId, paymentUrl });
  } catch (err) {
    console.error('[contributions] start failed', err);
    return NextResponse.json(
      { error: 'We could not open the secure payment page right now. Please try again in a moment.' },
      { status: 502 },
    );
  }
}
