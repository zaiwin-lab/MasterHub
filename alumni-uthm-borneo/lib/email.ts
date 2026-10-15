import 'server-only';
import { emailConfig } from './env';
import { buildReceiptEmail, type ReceiptEmail } from './email-template';

export type { ReceiptEmail };

interface Message {
  to: string;
  toName?: string;
  subject: string;
  text: string;
  html?: string;
  attachment?: { filename: string; bytes: Uint8Array };
  /** Copy the secretariat inbox (EMAIL_BCC). Receipts only. */
  bcc?: boolean;
}

/** True when an email provider is configured; callers skip optional notices otherwise. */
export function emailEnabled(): boolean {
  try {
    emailConfig();
    return true;
  } catch {
    return false;
  }
}

async function sendEmail(m: Message): Promise<void> {
  const cfg = emailConfig();
  const content = m.attachment ? Buffer.from(m.attachment.bytes).toString('base64') : null;
  const html = m.html ?? `<pre style="font-family:Arial,sans-serif;white-space:pre-wrap">${m.text.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!)}</pre>`;

  let res: Response;
  if (cfg.provider === 'resend') {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cfg.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `${cfg.fromName} <${cfg.fromAddress}>`,
        to: [m.to],
        ...(m.bcc && cfg.bcc ? { bcc: [cfg.bcc] } : {}),
        ...(cfg.replyTo ? { reply_to: cfg.replyTo } : {}),
        subject: m.subject,
        text: m.text,
        html,
        ...(m.attachment ? { attachments: [{ filename: m.attachment.filename, content }] } : {}),
      }),
      signal: AbortSignal.timeout(20000),
    });
  } else {
    res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': cfg.apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        sender: { name: cfg.fromName, email: cfg.fromAddress },
        to: [{ email: m.to, ...(m.toName ? { name: m.toName } : {}) }],
        ...(m.bcc && cfg.bcc ? { bcc: [{ email: cfg.bcc }] } : {}),
        ...(cfg.replyTo ? { replyTo: { email: cfg.replyTo } } : {}),
        subject: m.subject,
        textContent: m.text,
        htmlContent: html,
        ...(m.attachment ? { attachment: [{ name: m.attachment.filename, content }] } : {}),
      }),
      signal: AbortSignal.timeout(20000),
    });
  }

  if (!res.ok) {
    throw new Error(`Email (${cfg.provider}) failed: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`);
  }
}

export async function sendReceiptEmail(e: ReceiptEmail): Promise<void> {
  const { subject, text, html } = buildReceiptEmail(e);
  await sendEmail({
    to: e.to,
    toName: e.toName,
    subject,
    text,
    html,
    attachment: { filename: e.pdfFilename, bytes: e.pdf },
    bcc: true,
  });
}

export async function sendNoticeEmail(to: string, subject: string, text: string): Promise<void> {
  await sendEmail({ to, subject, text });
}
