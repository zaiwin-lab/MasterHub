// Lead Pipeline — kanban across the 7 blueprint statuses with quick advance.
import { icon } from '../lib/icons.js';
import * as store from '../lib/store.js';
import { byStatus, RM, timeAgo, daysUntil, esc } from '../lib/ui.js';
import { band } from '../lib/scoring.js';
import { CATEGORY_LABEL } from '../lib/scoring.js';

export function renderPipeline() {
  const buckets = byStatus();
  setTimeout(wire, 0);

  return `
  <div class="page-head between wrap">
    <div>
      <span class="eyebrow">${icon('pipeline')} Lead Pipeline</span>
      <h1 class="page-title">Move every prospect to activated.</h1>
      <p class="page-sub">Click a card to open it. Use the arrow to advance a prospect to the next stage.</p>
    </div>
    <a class="btn btn-primary" href="#/admin/prospects">${icon('plus')} New prospect</a>
  </div>

  <div class="pipeline">
    ${store.STATUSES.map(s => col(s, buckets[s.id] || [])).join('')}
  </div>`;
}

function col(s, items) {
  return `<div class="pipe-col">
    <div class="pipe-col-head">
      <span class="dot" style="width:8px;height:8px;border-radius:50%;background:${s.color}"></span>
      <span class="label">${s.label}</span>
      <span class="count">${items.length}</span>
    </div>
    <div class="pipe-col-bar" style="background:${s.color}33"></div>
    ${items.length ? items.map(card).join('') : `<div class="text-xs dim center" style="padding:20px 0">empty</div>`}
  </div>`;
}

function card(p) {
  const b = band(p.score);
  const expiry = p.preview_expires_at ? daysUntil(p.preview_expires_at) : null;
  const nextIdx = store.STATUSES.findIndex(s => s.id === p.status);
  const canAdvance = nextIdx >= 0 && nextIdx < store.STATUSES.length - 1;
  return `<div class="lead-card" data-open="${p.id}">
    <div class="lc-top">
      <div><div class="lc-name">${esc(p.company_name)}</div>
      <div class="lc-cat">${CATEGORY_LABEL[p.business_category] || ''} · ${esc(p.city)}</div></div>
      <div class="score-ring" style="--val:${p.score};--ring-c:var(--${b.color})"><span>${p.score}</span></div>
    </div>
    <div class="lc-meta">
      ${p.website_spec ? `<span class="lc-tag">${icon('spark')} preview</span>` : ''}
      ${p.analytics?.opens ? `<span class="lc-tag">${icon('eye')} ${p.analytics.opens} opens</span>` : ''}
      ${expiry !== null && expiry <= 5 ? `<span class="lc-tag" style="color:var(--rose)">${icon('clock')} ${expiry}d left</span>` : ''}
    </div>
    ${canAdvance ? `<button class="btn btn-ghost btn-sm" style="width:100%;margin-top:11px;justify-content:space-between" data-advance="${p.id}">
      <span class="text-xs dim">Move to ${store.STATUSES[nextIdx+1].label}</span>${icon('arrowRight')}</button>` : ''}
  </div>`;
}

function wire() {
  document.querySelectorAll('[data-advance]').forEach(b => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = b.dataset.advance;
    const p = store.prospectById(id);
    const idx = store.STATUSES.findIndex(s => s.id === p.status);
    store.setStatus(id, store.STATUSES[idx + 1].id);
  }));
  document.querySelectorAll('[data-open]').forEach(c => c.addEventListener('click', () => {
    location.hash = '#/admin/prospect/' + c.dataset.open;
  }));
}
