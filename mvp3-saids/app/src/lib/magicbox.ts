import type { AssetPlatform, DetectedAsset, L } from '../types';

/**
 * Paste anything, in any format, all at once. Links are extracted, classified by
 * platform, stripped of tracking parameters and deduplicated. Bare @handles are
 * detected too, and suppressed when a matching profile URL is already present.
 *
 * Nothing here fetches anything. Every asset is recorded as `declared`.
 */

const TRACKING = /^(utm_|fbclid|gclid|igshid|mc_|ref|ref_src|si$|_ga)/i;

const PLATFORMS: { key: AssetPlatform; label: L; hosts: string[] }[] = [
  { key: 'facebook', label: ['Facebook', 'Facebook'], hosts: ['facebook.com', 'fb.com', 'fb.me', 'm.facebook.com'] },
  { key: 'instagram', label: ['Instagram', 'Instagram'], hosts: ['instagram.com', 'instagr.am'] },
  { key: 'tiktok', label: ['TikTok', 'TikTok'], hosts: ['tiktok.com'] },
  { key: 'linkedin', label: ['LinkedIn', 'LinkedIn'], hosts: ['linkedin.com'] },
  { key: 'youtube', label: ['YouTube', 'YouTube'], hosts: ['youtube.com', 'youtu.be'] },
  {
    key: 'google_business',
    label: ['Google Business Profile', 'Profil Perniagaan Google'],
    hosts: ['google.com', 'maps.google.com', 'goo.gl', 'maps.app.goo.gl', 'g.page'],
  },
  { key: 'shopee', label: ['Shopee', 'Shopee'], hosts: ['shopee.com.my', 'shopee.com', 'shp.ee'] },
  { key: 'lazada', label: ['Lazada', 'Lazada'], hosts: ['lazada.com.my', 'lazada.com'] },
  { key: 'whatsapp', label: ['WhatsApp', 'WhatsApp'], hosts: ['wa.me', 'api.whatsapp.com', 'chat.whatsapp.com'] },
];

export function platformLabel(p: AssetPlatform): L {
  const found = PLATFORMS.find((x) => x.key === p);
  if (found) return found.label;
  if (p === 'website') return ['Website', 'Laman web'];
  return ['Other', 'Lain-lain'];
}

function classify(host: string): AssetPlatform {
  const h = host.replace(/^www\./, '').toLowerCase();
  for (const p of PLATFORMS) {
    if (p.hosts.some((x) => h === x || h.endsWith('.' + x))) return p.key;
  }
  return 'website';
}

function clean(raw: string): string | null {
  let s = raw.trim().replace(/[),.;]+$/, '');
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  try {
    const u = new URL(s);
    if (!u.hostname.includes('.')) return null;
    for (const key of [...u.searchParams.keys()]) {
      if (TRACKING.test(key)) u.searchParams.delete(key);
    }
    u.hash = '';
    let out = u.toString();
    if (out.endsWith('/') && u.pathname === '/') out = out.slice(0, -1);
    return out;
  } catch {
    return null;
  }
}

let seq = 0;
const nextId = () => `a${Date.now().toString(36)}${(seq++).toString(36)}`;

export function detectAssets(input: string): DetectedAsset[] {
  const out: DetectedAsset[] = [];
  const seen = new Set<string>();

  const urlish = input.match(/(?:https?:\/\/)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[^\s,]*)?/gi) ?? [];
  for (const candidate of urlish) {
    const url = clean(candidate);
    if (!url) continue;
    const key = url.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    let host = '';
    try {
      host = new URL(url).hostname;
    } catch {
      continue;
    }
    out.push({ id: nextId(), platform: classify(host), raw: candidate.trim(), url, verification: 'declared' });
  }

  // Bare @handles, only when no existing asset already carries that handle.
  const handles = input.match(/(?:^|\s)@([a-z0-9._]{2,30})/gi) ?? [];
  for (const h of handles) {
    const handle = h.trim().slice(1).toLowerCase();
    if (!handle) continue;
    if (out.some((a) => a.url.toLowerCase().includes(handle))) continue;
    if (seen.has('@' + handle)) continue;
    seen.add('@' + handle);
    out.push({
      id: nextId(),
      platform: 'other',
      raw: '@' + handle,
      url: '@' + handle,
      verification: 'declared',
    });
  }

  return out;
}
