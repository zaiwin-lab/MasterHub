import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import { formatRM2 } from './rules';

export interface ReceiptData {
  receiptNumber: string;
  contributionId: string;
  date: Date;
  contributor: string;
  contactPerson?: string;
  email: string;
  purpose: string;
  remark?: string | null;
  amount: number;
  transactionRef: string;
  status: 'PAID';
}

const NAVY = rgb(0.059, 0.141, 0.271);
const INK = rgb(0.13, 0.15, 0.2);
const MUTED = rgb(0.38, 0.41, 0.48);
const RULE = rgb(0.85, 0.87, 0.91);
const GREEN = rgb(0.09, 0.45, 0.27);

/** Standard PDF fonts are WinAnsi only: fold accents, drop anything else (emoji, CJK). */
export function pdfSafe(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/×/g, 'x')
    .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    for (const word of paragraph.split(' ')) {
      const attempt = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(attempt, size) <= width) {
        line = attempt;
        continue;
      }
      if (line) lines.push(line);
      // Hard-break words longer than the column.
      let rest = word;
      while (font.widthOfTextAtSize(rest, size) > width) {
        let i = rest.length;
        while (i > 1 && font.widthOfTextAtSize(rest.slice(0, i), size) > width) i--;
        lines.push(rest.slice(0, i));
        rest = rest.slice(i);
      }
      line = rest;
    }
    lines.push(line);
  }
  return lines;
}

export function formatReceiptDate(date: Date): string {
  return new Intl.DateTimeFormat('en-MY', {
    timeZone: 'Asia/Kuching',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export async function renderReceipt(data: ReceiptData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Receipt ${data.receiptNumber}`);
  pdf.setAuthor('Alumni UTHM Borneo, Sarawak Chapter');
  pdf.setCreator('Alumni UTHM Borneo contribution portal');

  const page: PDFPage = pdf.addPage([595.28, 841.89]); // A4
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();
  const margin = 56;
  const contentWidth = width - margin * 2;

  // Header band
  page.drawRectangle({ x: 0, y: height - 132, width, height: 132, color: NAVY });
  page.drawText('ALUMNI UTHM BORNEO', { x: margin, y: height - 62, size: 20, font: bold, color: rgb(1, 1, 1) });
  page.drawText('Sarawak Chapter', { x: margin, y: height - 84, size: 11, font: regular, color: rgb(0.8, 0.85, 0.93) });
  const tag = 'Connecting Alumni. Creating Opportunities. Giving Back.';
  page.drawText(tag, { x: margin, y: height - 108, size: 9, font: regular, color: rgb(0.68, 0.74, 0.85) });

  let y = height - 182;
  page.drawText('PAYMENT / CONTRIBUTION ACKNOWLEDGEMENT', { x: margin, y, size: 13, font: bold, color: INK });
  y -= 30;

  // Receipt number + date, side by side
  const meta: [string, string][] = [
    ['Receipt Number', data.receiptNumber],
    ['Date', formatReceiptDate(data.date)],
  ];
  meta.forEach(([label, value], i) => {
    const x = margin + i * (contentWidth / 2);
    page.drawText(label.toUpperCase(), { x, y, size: 7.5, font: bold, color: MUTED });
    page.drawText(pdfSafe(value), { x, y: y - 15, size: 11, font: regular, color: INK });
  });
  y -= 44;
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.75, color: RULE });
  y -= 26;

  const rows: [string, string][] = [
    ['Contribution ID', data.contributionId],
    ['Contributor / Organisation', data.contributor],
  ];
  if (data.contactPerson) rows.push(['Contact Person', data.contactPerson]);
  rows.push(['Email', data.email], ['Purpose', data.purpose], ['Remark', data.remark?.trim() || '-']);
  rows.push(['ToyyibPay Transaction Reference', data.transactionRef || '-']);

  const labelWidth = 170;
  const valueWidth = contentWidth - labelWidth;
  for (const [label, value] of rows) {
    const lines = wrap(pdfSafe(value) || '-', regular, 10.5, valueWidth);
    page.drawText(label, { x: margin, y, size: 9.5, font: regular, color: MUTED });
    lines.slice(0, 8).forEach((line, i) => {
      page.drawText(line, { x: margin + labelWidth, y: y - i * 15, size: 10.5, font: regular, color: INK });
    });
    y -= Math.min(lines.length, 8) * 15 + 12;
  }

  // Amount block
  y -= 6;
  page.drawRectangle({ x: margin, y: y - 58, width: contentWidth, height: 70, color: rgb(0.95, 0.96, 0.98) });
  page.drawText('AMOUNT RECEIVED', { x: margin + 18, y: y - 10, size: 7.5, font: bold, color: MUTED });
  page.drawText(formatRM2(data.amount), { x: margin + 18, y: y - 40, size: 24, font: bold, color: NAVY });
  const statusLabel = `PAYMENT STATUS: ${data.status}`;
  const statusWidth = bold.widthOfTextAtSize(statusLabel, 9);
  page.drawText(statusLabel, {
    x: width - margin - 18 - statusWidth,
    y: y - 33,
    size: 9,
    font: bold,
    color: GREEN,
  });
  y -= 100;

  const thanks = wrap(
    'Thank you for supporting Alumni UTHM Zon Borneo (Sarawak). Together, we continue strengthening alumni connections and creating opportunities for future UTHM graduates.',
    regular,
    10,
    contentWidth,
  );
  thanks.forEach((line, i) => page.drawText(line, { x: margin, y: y - i * 14, size: 10, font: regular, color: INK }));

  // Footer
  const footY = 92;
  page.drawLine({ start: { x: margin, y: footY + 22 }, end: { x: width - margin, y: footY + 22 }, thickness: 0.75, color: RULE });
  const footer = [
    'Payment and administrative facilitation by KOBIS Berhad for Alumni UTHM Zon Borneo (Sarawak).',
    'This acknowledgement is generated by the Alumni UTHM Borneo contribution portal upon verified payment.',
    'It is not an official receipt of Universiti Tun Hussein Onn Malaysia.',
  ];
  footer.forEach((line, i) =>
    page.drawText(line, { x: margin, y: footY - i * 13, size: 8.5, font: i === 0 ? bold : regular, color: i === 0 ? INK : MUTED }),
  );

  return pdf.save();
}
