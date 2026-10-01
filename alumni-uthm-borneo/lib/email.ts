import 'server-only';
import { emailConfig } from './env';
import { buildReceiptEmail, type ReceiptEmail } from './email-template';

export type { ReceiptEmail };

function toBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('base64');
}

export async function sendReceiptEmail(e: ReceiptEmail): Promise<void> {
  const cfg = emailConfig();
  const { subject, text, html } = buildReceiptEmail(e);
  const attachment = toBase64(e.pdf);

  let res: Response;
  if (cfg.provider === 'resend') {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cfg.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `${cfg.fromName} <${cfg.fromAddress}>`,
        to: [e.to],
        ...(cfg.bcc ? { bcc: [cfg.bcc] } : {}),
        ...(cfg.replyTo ? { reply_to: cfg.replyTo } : {}),
        subject,
        text,
        html,
        attachments: [{ filename: e.pdfFilename, content: attachment }],
      }),
      signal: AbortSignal.timeout(20000),
    });
  } else {
    res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': cfg.apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        sender: { name: cfg.fromName, email: cfg.fromAddress },
        to: [{ email: e.to, name: e.toName }],
        ...(cfg.bcc ? { bcc: [{ email: cfg.bcc }] } : {}),
        ...(cfg.replyTo ? { replyTo: { email: cfg.replyTo } } : {}),
        subject,
        textContent: text,
        htmlContent: html,
        attachment: [{ name: e.pdfFilename, content: attachment }],
      }),
      signal: AbortSignal.timeout(20000),
    });
  }

  if (!res.ok) {
    throw new Error(`Email (${cfg.provider}) failed: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`);
  }
}
