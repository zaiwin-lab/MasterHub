// ===========================================================================
// ASSETS — client-side handling of uploaded build materials.
// Images are downscaled to keep the database light; PDFs have their text
// extracted (best-effort, lazy-loads pdf.js from CDN) so it can feed copy.
// Everything degrades gracefully offline.
// ===========================================================================

// Read an image File and return a downscaled JPEG/PNG data URL.
export function readImageResized(file, maxDim = 1280, quality = 0.72) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject(new Error('not an image'));
    const fr = new FileReader();
    fr.onerror = () => reject(fr.error);
    fr.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('bad image'));
      img.onload = () => {
        let { width: w, height: h } = img;
        if (w > maxDim || h > maxDim) {
          const r = Math.min(maxDim / w, maxDim / h);
          w = Math.round(w * r); h = Math.round(h * r);
        }
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        // keep PNG for logos (transparency), JPEG otherwise for size
        const isPng = file.type === 'image/png';
        resolve(c.toDataURL(isPng ? 'image/png' : 'image/jpeg', quality));
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

// Extract text from a PDF File. Best-effort: lazy-loads pdf.js from CDN.
// On any failure (offline, blocked CDN) returns { name, text:'', pages:0 }.
export async function readPdfText(file) {
  const out = { name: file?.name || 'document.pdf', text: '', pages: 0 };
  if (!file) return out;
  try {
    const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';
    const WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
    const url = CDN; // variable so the bundler treats it as external/dynamic
    const pdfjs = await import(/* @vite-ignore */ url);
    pdfjs.GlobalWorkerOptions.workerSrc = WORKER;
    const buf = await file.arrayBuffer();
    const doc = await pdfjs.getDocument({ data: buf }).promise;
    out.pages = doc.numPages;
    const parts = [];
    for (let i = 1; i <= Math.min(doc.numPages, 15); i++) {
      const page = await doc.getPage(i);
      const tc = await page.getTextContent();
      parts.push(tc.items.map(it => it.str).join(' '));
    }
    out.text = parts.join('\n').replace(/\s+\n/g, '\n').trim();
  } catch (e) {
    console.warn('[KOBIS] PDF text extraction unavailable:', e.message);
  }
  return out;
}

// Pull likely menu/service items from free text: lines containing a price.
// Returns [{ title, price }]. Works well on menus/brochures.
export function extractPricedItems(text, limit = 8) {
  if (!text) return [];
  const items = [];
  const seen = new Set();
  const re = /(.{2,48}?)\s*(?:RM|rm|MYR)?\s*(\d{1,3}(?:\.\d{1,2})?)\b/;
  for (let raw of text.split(/\n|•|·|•/)) {
    const line = raw.trim();
    if (line.length < 3 || line.length > 60) continue;
    const m = line.match(/(RM|MYR|rm)\s?(\d{1,3}(?:\.\d{1,2})?)/);
    if (!m) continue;
    const title = line.slice(0, m.index).replace(/[\.\-–:]+$/, '').trim();
    if (title.length < 2 || /^\d/.test(title)) continue;
    const key = title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ title: title.slice(0, 42), price: 'RM' + m[2] });
    if (items.length >= limit) break;
  }
  return items;
}

export function normalizeUrls(raw) {
  return (raw || '').split(/[\n,]/).map(s => s.trim()).filter(Boolean)
    .map(u => u.replace(/^https?:\/\//, '')).slice(0, 6);
}
