import { NextResponse } from 'next/server';
import { findByToken } from '@/lib/db';
import { canSubmitProof, saveProof } from '@/lib/payments';
import { MAX_PROOF_BYTES, sniffProofType } from '@/lib/rules';

export const runtime = 'nodejs';

/** Payer uploads a screenshot or PDF of their DuitNow / bank transfer. */
export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const row = await findByToken(token);
  if (!row) return NextResponse.json({ error: 'This payment link is not valid.' }, { status: 404 });
  if (!canSubmitProof(row)) {
    return NextResponse.json({ error: 'This payment has already been verified.' }, { status: 409 });
  }

  const declared = Number(req.headers.get('content-length') ?? 0);
  if (declared > MAX_PROOF_BYTES + 64 * 1024) {
    return NextResponse.json({ error: 'The file is too large. Please upload a file under 4MB.' }, { status: 413 });
  }

  let file: File | null = null;
  try {
    const form = await req.formData();
    const value = form.get('proof');
    file = value instanceof File ? value : null;
  } catch {
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 400 });
  }
  if (!file || file.size === 0) return NextResponse.json({ error: 'Choose a file to upload.' }, { status: 400 });
  if (file.size > MAX_PROOF_BYTES) {
    return NextResponse.json({ error: 'The file is too large. Please upload a file under 4MB.' }, { status: 413 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = sniffProofType(bytes);
  if (!mime) {
    return NextResponse.json({ error: 'Please upload a JPG, PNG or WEBP screenshot, or a PDF.' }, { status: 415 });
  }

  try {
    await saveProof(row, bytes, mime);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[proof-upload]', row.contribution_id, err);
    return NextResponse.json({ error: 'We could not save your file. Please try again.' }, { status: 502 });
  }
}
