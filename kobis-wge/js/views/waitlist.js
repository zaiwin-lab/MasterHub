// Waitlist — Rec 6 controlled onboarding. Invite prospects in batches.
import { icon } from '../lib/icons.js';
import * as store from '../lib/store.js';
import { fmtDate, timeAgo, toast } from '../lib/ui.js';
import { CATEGORY_LABEL } from '../lib/scoring.js';

export function renderWaitlist() {
  setTimeout(wire, 0);
  const wl = store.waitlist();
  const BATCH = 20;

  return `
  <div class="page-head">
    <span class="eyebrow">${icon('hourglass')} Waitlist · Phase 2</span>
    <h1 class="page-title">Controlled onboarding</h1>
    <p class="page-sub">Invite-only intake keeps preview quality high and the team from burning out (Rec 6). Invite in batches of ${BATCH}/week.</p>
  </div>

  <div class="grid g-3">
    <div class="card kpi"><div class="kpi-label"><span class="kpi-icon t-violet">${icon('users')}</span> In queue</div><div class="kpi-value">${wl.length}</div></div>
    <div class="card kpi"><div class="kpi-label"><span class="kpi-icon t-grow">${icon('send')}</span> Batch capacity</div><div class="kpi-value">${BATCH}<small>/week</small></div></div>
    <div class="card kpi"><div class="kpi-label"><span class="kpi-icon t-amber">${icon('gift')}</span> Via referral</div><div class="kpi-value">${wl.filter(w=>w.referral_code).length}</div></div>
  </div>

  <div class="card mt-18" style="padding:6px 6px 2px">
    <table class="tbl">
      <thead><tr><th>#</th><th>Business</th><th>Category</th><th>Referral</th><th>Joined</th><th></th></tr></thead>
      <tbody>
        ${wl.map((w, i) => `<tr>
          <td class="num dim">${i + 1}</td>
          <td><div class="fw-700 hi">${w.company_name}</div><div class="text-xs dim">${w.contact_person} · ${w.email}</div></td>
          <td><span class="pill">${CATEGORY_LABEL[w.business_category] || '—'}</span></td>
          <td>${w.referral_code ? `<span class="pill pill-violet">${icon('gift')} ${w.referral_code}</span>` : '<span class="text-xs dim">—</span>'}</td>
          <td class="text-sm muted">${timeAgo(w.created_at)}</td>
          <td><button class="btn btn-primary btn-sm" data-invite="${w.id}">${icon('rocket')} Convert to prospect</button></td>
        </tr>`).join('') || `<tr><td colspan="6"><div class="empty">${icon('hourglass')}<div>Waitlist empty.</div></div></td></tr>`}
      </tbody>
    </table>
  </div>`;
}

function wire() {
  document.querySelectorAll('[data-invite]').forEach(b => b.addEventListener('click', () => {
    const w = store.waitlist().find(x => x.id === b.dataset.invite);
    const p = store.addProspect({
      company_name: w.company_name, contact_person: w.contact_person, email: w.email,
      business_category: w.business_category, city: '', followers: 0,
      web_presence: 'none', engagement: 'medium', affordability: 'likely',
      referred_by: w.referral_code || '',
    });
    // remove from waitlist
    const idx = store.waitlist().findIndex(x => x.id === w.id);
    if (idx > -1) store.waitlist().splice(idx, 1);
    toast(`${w.company_name} moved into the pipeline`, 'grow');
    location.hash = '#/admin/prospect/' + p.id;
  }));
}
