import { formatRM2 } from './rules';

export interface ReceiptEmail {
  to: string;
  toName: string;
  contributionId: string;
  amount: number;
  purpose: string;
  remark?: string | null;
  pdf: Uint8Array;
  pdfFilename: string;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function buildReceiptEmail(e: Omit<ReceiptEmail, 'pdf' | 'pdfFilename' | 'to' | 'toName'>) {
  const subject = `Thank You for Supporting Alumni UTHM Borneo – ${e.contributionId}`;
  const amount = formatRM2(e.amount);
  const remark = e.remark?.trim();

  const text = [
    'Salam & Greetings,',
    '',
    `Thank you for your contribution/payment of ${amount} in support of Alumni UTHM Zon Borneo (Sarawak).`,
    '',
    'Your transaction has been successfully received.',
    '',
    'Purpose:',
    e.purpose,
    ...(remark ? ['', 'Remark:', remark] : []),
    '',
    'Attached is your Payment / Contribution Acknowledgement for your records.',
    '',
    'Together, we continue strengthening alumni connections and creating opportunities for future UTHM graduates.',
    '',
    'Thank you.',
    '',
    'Alumni UTHM Borneo',
    'Sarawak Chapter',
    '',
    '—',
    'Payment and administrative facilitation by KOBIS Berhad.',
  ].join('\n');

  const p = (s: string) => `<p style="margin:0 0 16px">${s}</p>`;
  const html = `<!doctype html><html><body style="margin:0;background:#f3f5f9;font-family:Arial,Helvetica,sans-serif;color:#1f2533">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f5f9;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden">
<tr><td style="background:#0f2445;padding:28px 32px;color:#ffffff">
<div style="font-size:17px;font-weight:bold;letter-spacing:.04em">ALUMNI UTHM BORNEO</div>
<div style="font-size:13px;color:#c9d4e6;margin-top:4px">Sarawak Chapter</div>
</td></tr>
<tr><td style="padding:32px;font-size:15px;line-height:1.6">
${p('Salam &amp; Greetings,')}
${p(`Thank you for your contribution/payment of <strong>${escapeHtml(amount)}</strong> in support of Alumni UTHM Zon Borneo (Sarawak).`)}
${p('Your transaction has been successfully received.')}
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 20px;border-top:1px solid #e3e7ee">
<tr><td style="padding:10px 0;color:#5d6475;width:130px;vertical-align:top">Contribution ID</td><td style="padding:10px 0">${escapeHtml(e.contributionId)}</td></tr>
<tr><td style="padding:10px 0;color:#5d6475;vertical-align:top;border-top:1px solid #e3e7ee">Purpose</td><td style="padding:10px 0;border-top:1px solid #e3e7ee">${escapeHtml(e.purpose)}</td></tr>
${remark ? `<tr><td style="padding:10px 0;color:#5d6475;vertical-align:top;border-top:1px solid #e3e7ee">Remark</td><td style="padding:10px 0;border-top:1px solid #e3e7ee">${escapeHtml(remark).replace(/\n/g, '<br>')}</td></tr>` : ''}
</table>
${p('Attached is your Payment / Contribution Acknowledgement for your records.')}
${p('Together, we continue strengthening alumni connections and creating opportunities for future UTHM graduates.')}
${p('Thank you.')}
<p style="margin:0"><strong>Alumni UTHM Borneo</strong><br>Sarawak Chapter</p>
</td></tr>
<tr><td style="padding:18px 32px;background:#f7f8fb;font-size:12px;color:#5d6475">Payment and administrative facilitation by KOBIS Berhad for Alumni UTHM Zon Borneo (Sarawak).</td></tr>
</table></td></tr></table></body></html>`;

  return { subject, text, html };
}
