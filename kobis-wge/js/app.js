// ===========================================================================
// KOBIS WEBSITE GROWTH ENGINE — application controller
// ===========================================================================
import * as store from './lib/store.js';
import * as router from './lib/router.js';
import { icon } from './lib/icons.js';

import { renderLanding } from './views/landing.js';
import { renderDashboard } from './views/dashboard.js';
import { renderPipeline } from './views/pipeline.js';
import { renderProspects, renderProspectDetail } from './views/prospects.js';
import { renderClients } from './views/clients.js';
import { renderReferrals } from './views/referrals.js';
import { renderWaitlist } from './views/waitlist.js';
import { renderPreview } from './views/preview.js';
import { renderClientPortal } from './views/client.js';

// Boot: hydrate from Supabase if configured (config.js), else browser-local.
await store.boot();

const app = document.getElementById('app');

// ---- nav definition (admin shell) ----------------------------------------
const NAV = [
  { group: 'Engine', items: [
    { path: '/admin', label: 'Command Center', icon: 'dashboard' },
    { path: '/admin/pipeline', label: 'Lead Pipeline', icon: 'pipeline', badge: () => store.prospects().filter(p => !['activated','renewal'].includes(p.status)).length },
    { path: '/admin/prospects', label: 'Prospects', icon: 'target' },
  ]},
  { group: 'Revenue', items: [
    { path: '/admin/clients', label: 'Clients & Orders', icon: 'money', badge: () => store.clients().length },
    { path: '/admin/referrals', label: 'Referrals & Credits', icon: 'gift' },
    { path: '/admin/waitlist', label: 'Waitlist', icon: 'hourglass', badge: () => store.waitlist().length, roles: ['admin'] },
  ]},
  { group: 'Public', items: [
    { path: '/', label: 'Launch Hub', icon: 'rocket' },
    { path: '/preview/aimankopi', label: 'Sample Preview', icon: 'eye' },
  ]},
];

// ---- routes ---------------------------------------------------------------
// full-bleed (own chrome)
router.route('/', () => full(renderLanding()));
router.route('/preview/:slug', ({ params }) => full(renderPreview(params.slug)));
router.route('/client/:id', ({ params }) => full(renderClientPortal(params.id)));
// admin shell
router.route('/admin', () => shell(renderDashboard(), '/admin'));
router.route('/admin/pipeline', () => shell(renderPipeline(), '/admin/pipeline'));
router.route('/admin/prospects', () => shell(renderProspects(), '/admin/prospects'));
router.route('/admin/prospect/:id', ({ params }) => shell(renderProspectDetail(params.id), '/admin/prospects'));
router.route('/admin/clients', () => shell(renderClients(), '/admin/clients'));
router.route('/admin/referrals', () => shell(renderReferrals(), '/admin/referrals'));
router.route('/admin/waitlist', () => shell(renderWaitlist(), '/admin/waitlist'));
router.setNotFound(() => full(renderLanding()));

// ---- renderers ------------------------------------------------------------
function full(html) { app.innerHTML = `<div class="main">${html}</div>`; window.scrollTo(0, 0); }

function shell(content, active) {
  const role = store.role();
  app.innerHTML = `
    <div class="shell">
      ${sidebar(active, role)}
      <div class="main">
        ${topbar(active)}
        <div class="view" id="view">${content}</div>
      </div>
    </div>
    <div class="scrim-nav" id="scrimNav" hidden></div>`;
  wireShell();
  window.scrollTo(0, 0);
}

function sidebar(active, role) {
  const team = store.team();
  const me = team.find(t => t.role === role) || team[0] || { name: 'You', initials: 'YO', email: 'admin@kobis.my' };
  const groups = NAV.map(g => {
    const items = g.items.filter(it => !it.roles || it.roles.includes(role));
    if (!items.length) return '';
    return `<div class="nav-group-label">${g.group}</div>` + items.map(it => {
      const isActive = active === it.path || (it.path !== '/' && active.startsWith(it.path) && it.path !== '/admin') || active === it.path;
      const badge = it.badge ? `<span class="nav-badge">${it.badge()}</span>` : '';
      return `<a class="nav-item ${active === it.path ? 'active' : ''}" href="#${it.path}">${icon(it.icon)}<span>${it.label}</span>${badge}</a>`;
    }).join('');
  }).join('');

  return `<aside class="sidebar" id="sidebar">
    <a class="brand" href="#/admin">
      <div class="brand-mark">K</div>
      <div><div class="brand-name">KOBIS</div><div class="brand-sub">Growth Engine</div></div>
    </a>
    ${groups}
    <div class="sidebar-foot">
      <div class="text-xs dim" style="padding:0 8px 8px;letter-spacing:.12em;text-transform:uppercase">Access Role</div>
      <div class="role-switch" id="roleSwitch">
        <button data-role="admin" class="${role === 'admin' ? 'on' : ''}">Admin</button>
        <button data-role="sales" class="${role === 'sales' ? 'on' : ''}">Sales Agent</button>
      </div>
      <div class="user-chip">
        <div class="avatar">${me.initials}</div>
        <div><div class="text-sm fw-600 hi">${me.name}</div><div class="text-xs dim">${me.email}</div></div>
      </div>
    </div>
  </aside>`;
}

function topbar(active) {
  const map = {
    '/admin': 'Command Center', '/admin/pipeline': 'Lead Pipeline', '/admin/prospects': 'Prospects',
    '/admin/clients': 'Clients & Orders', '/admin/referrals': 'Referrals & Credits', '/admin/waitlist': 'Waitlist',
  };
  const name = map[active] || 'Prospect';
  return `<div class="topbar">
    <button class="menu-btn" id="menuBtn">${icon('menu')}</button>
    <div class="crumbs">KOBIS Engine <span class="dim">/</span> <b>${name}</b></div>
    <div class="topbar-spacer"></div>
    <a class="btn btn-ghost btn-sm" href="#/" target="_self">${icon('eye')} View Launch Hub</a>
  </div>`;
}

function wireShell() {
  document.getElementById('roleSwitch')?.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-role]'); if (!b) return;
    store.setRole(b.dataset.role);
  });
  const sb = document.getElementById('sidebar');
  const scrim = document.getElementById('scrimNav');
  document.getElementById('menuBtn')?.addEventListener('click', () => { sb.classList.add('open'); scrim.hidden = false; });
  scrim?.addEventListener('click', () => { sb.classList.remove('open'); scrim.hidden = true; });
}

// ---- boot + reactivity ----------------------------------------------------
function render() { const { handler, params, path } = router.current(); handler({ params, path }); }
// On navigation, tear down any lingering body-level modal/popup (the activation
// popup and modal.js host live outside #app, so a route change must clear them).
router.onChange(() => { document.querySelectorAll('.modal-scrim').forEach(el => el.remove()); render(); });
store.subscribe(() => {
  // Re-render current view on data change, preserving any open modal via views.
  const { handler, params, path } = router.current();
  // Avoid clobbering an open modal: views render modals into document.body separately.
  handler({ params, path });
});

render();
