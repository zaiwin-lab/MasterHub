// Clients & Orders — activated customers, revenue, renewals (RBAC-gated).
import { icon } from '../lib/icons.js';
import * as store from '../lib/store.js';
import { RM, fmtDate, daysUntil, metrics } from '../lib/ui.js';
import { PRICING } from '../lib/pricing.js';

export function renderClients() {
  if (store.role() !== 'admin') return rbacBlock();
  const m = metrics();
  const clients = store.clients();

  return `
  <div class="page-head">
    <span class="eyebrow">${icon('money')} Clients & Orders</span>
    <h1 class="page-title">${clients.length} activated · ${RM(m.totalRevenue)} collected</h1>
    <p class="page-sub">Every activation, order breakdown and upcoming renewal in one ledger.</p>
  </div>

  <div class="grid g-4">
    ${stat('rocket','t-grow','Activations', clients.length)}
    ${stat('money','t-amber','Revenue', RM(m.totalRevenue))}
    ${stat('spark','t-violet','Upsell revenue', RM(m.upsellRevenue))}
    ${stat('clock','t-sky','Renewals/yr', RM(m.renewalRevenue))}
  </div>

  <div class="card mt-18" style="padding:6px 6px 2px">
    <table class="tbl">
      <thead><tr><th>Client</th><th>Package</th><th>Add-ons</th><th>Paid</th><th>Activated</th><th>Renewal due</th><th></th></tr></thead>
      <tbody>
        ${clients.map(rowHtml).join('') || `<tr><td colspan="7"><div class="empty">${icon('money')}<div>No activations yet.</div></div></td></tr>`}
      </tbody>
    </table>
  </div>`;
}

function rowHtml(c) {
  const o = store.orders().find(x => x.client_id === c.id) || {};
  const addons = [o.ai_chatbot && 'Chatbot', o.news_module && 'News', o.extra_email_count && `${o.extra_email_count}× email`].filter(Boolean);
  const due = daysUntil(c.renewal_due_date);
  return `<tr>
    <td><div class="fw-700 hi">${c.company_name}</div><div class="text-xs dim">${c.contact_person}</div></td>
    <td><span class="pill pill-grow">Activation</span></td>
    <td>${addons.length ? addons.map(a => `<span class="pill" style="margin:2px">${a}</span>`).join('') : '<span class="text-xs dim">—</span>'}</td>
    <td class="num fw-700 hi">${RM(c.package_price)}</td>
    <td class="text-sm muted">${fmtDate(c.activation_date)}</td>
    <td>${due <= 30 ? `<span class="pill pill-rose">${due}d</span>` : `<span class="text-sm muted">${fmtDate(c.renewal_due_date)}</span>`}</td>
    <td><a class="btn btn-ghost btn-sm" href="#/client/${c.id}">${icon('eye')} Portal</a></td>
  </tr>`;
}

function stat(ic, tint, label, value) {
  return `<div class="card kpi"><div class="kpi-label"><span class="kpi-icon ${tint}">${icon(ic)}</span> ${label}</div>
    <div class="kpi-value">${value}</div></div>`;
}

export function rbacBlock() {
  return `<div class="empty" style="padding:80px 20px">
    <div class="kpi-icon t-rose" style="width:56px;height:56px;margin:0 auto 18px">${icon('shield')}</div>
    <h3 style="color:var(--tx-hi)">Restricted — Admin only</h3>
    <p class="muted mt-8" style="max-width:46ch;margin-inline:auto">Financial data and payment records are protected by role-based access control (Rec 9). Switch to the Admin role to view this section.</p>
  </div>`;
}
