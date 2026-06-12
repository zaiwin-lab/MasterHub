// Small UI utilities shared across views: formatting, toasts, sparklines, metrics.
import * as store from './store.js';
import { PRICING } from './pricing.js';

export const RM = (n) => 'RM' + (Math.round(n) || 0).toLocaleString('en-MY');
export const pct = (n) => (n * 100).toFixed(n >= 0.1 ? 0 : 1) + '%';
export const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
export const fmtShort = (iso) => iso ? new Date(iso).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' }) : '—';
export const timeAgo = (iso) => {
  if (!iso) return 'never';
  const s = (Date.now() - new Date(iso)) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
};
export const daysUntil = (iso) => iso ? Math.ceil((new Date(iso) - Date.now()) / 864e5) : null;
export const initials = (name) => (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

// ---- toast ---------------------------------------------------------------
export function toast(msg, kind = 'grow') {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
  const el = document.createElement('div');
  el.className = 'toast ' + (kind === 'grow' ? '' : kind);
  el.innerHTML = `<span>${msg}</span>`;
  wrap.appendChild(el);
  setTimeout(() => { el.style.transition = 'all .3s'; el.style.opacity = '0'; el.style.transform = 'translateX(40px)'; setTimeout(() => el.remove(), 320); }, 3200);
}

// ---- sparkline -----------------------------------------------------------
export function sparkline(points, color = '#00e5a0', h = 38, w = 220) {
  const max = Math.max(...points, 1), min = Math.min(...points, 0);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const pts = points.map((p, i) => [i * step, h - ((p - min) / range) * (h - 6) - 3]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = d + ` L ${w} ${h} L 0 ${h} Z`;
  const gid = 'g' + Math.random().toString(36).slice(2, 7);
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${color}" stop-opacity=".28"/><stop offset="1" stop-color="${color}" stop-opacity="0"/>
    </linearGradient></defs>
    <path d="${area}" fill="url(#${gid})"/>
    <path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// ---- metrics (Module A dashboard) ---------------------------------------
export function metrics() {
  const prospects = store.prospects();
  const clients = store.clients();
  const orders = store.orders();
  const wallets = store.wallets();
  const referrals = store.referrals();

  const totalProspects = prospects.length;
  const generated = prospects.filter(p => p.website_spec).length;
  const activations = clients.length;
  const sentOrLater = prospects.filter(p => ['sent', 'interested', 'quoted', 'activated', 'renewal'].includes(p.status)).length;
  const conv = sentOrLater ? activations / sentOrLater : 0;

  const upsellRevenue = orders.reduce((s, o) => s + (o.total_amount - o.activation_fee), 0);
  const activationRevenue = orders.reduce((s, o) => s + o.activation_fee, 0);
  const renewalRevenue = clients.length * PRICING.renewal;
  const creditsIssued = referrals.filter(r => r.activation_status === 'confirmed').reduce((s, r) => s + r.reward_amount, 0);
  const cashRedeemed = wallets.reduce((s, w) => s + w.cash_redeemed, 0);
  const totalRevenue = orders.reduce((s, o) => s + o.total_amount, 0);
  const ltv = activations ? Math.round((totalRevenue + renewalRevenue) / activations) : 1400;

  return {
    totalProspects, generated, activations, conv, sentOrLater,
    upsellRevenue, activationRevenue, renewalRevenue, totalRevenue, creditsIssued, cashRedeemed, ltv,
    pipelineValue: prospects.filter(p => ['interested', 'quoted'].includes(p.status)).length * PRICING.activation,
  };
}

// Count prospects by status for the pipeline
export function byStatus() {
  const map = {};
  store.STATUSES.forEach(s => map[s.id] = []);
  store.prospects().forEach(p => { (map[p.status] = map[p.status] || []).push(p); });
  return map;
}
