// Admin Command Center — KPIs, revenue, pipeline health, automation feed.
import { icon } from '../lib/icons.js';
import * as store from '../lib/store.js';
import { metrics, byStatus, RM, pct, sparkline, fmtShort, timeAgo } from '../lib/ui.js';
import { band, QUALIFY_THRESHOLD } from '../lib/scoring.js';

export function renderDashboard() {
  const m = metrics();
  const role = store.role();
  const buckets = byStatus();

  return `
  <div class="page-head between wrap">
    <div>
      <span class="eyebrow">${icon('bolt')} Command Center</span>
      <h1 class="page-title">Good to see you. Here's the engine.</h1>
      <p class="page-sub">Every prospect, preview, activation and ringgit — live. ${role === 'sales' ? 'Sales view: financials hidden.' : ''}</p>
    </div>
    <a class="btn btn-primary" href="#/admin/prospects">${icon('plus')} New prospect</a>
  </div>

  <div class="grid g-4">
    ${kpi('target', 't-violet', 'Prospects', m.totalProspects, `${m.generated} previews generated`, [4,6,5,8,7,9,11,m.totalProspects], '#7c5cff')}
    ${kpi('rocket', 't-grow', 'Activations', m.activations, `${pct(m.conv)} conversion`, [0,1,1,2,2,3,3,m.activations], '#00e5a0')}
    ${role === 'admin' ? kpi('money', 't-amber', 'Total revenue', RM(m.totalRevenue), `${RM(m.renewalRevenue)} renewals/yr`, [200,500,800,1200,1600,2100,2600,m.totalRevenue], '#ffb547', true)
      : kpi('eye', 't-sky', 'Previews sent', m.sentOrLater, 'awaiting response', [1,2,3,4,5,6,7,m.sentOrLater], '#4cc9ff')}
    ${kpi('gift', 't-sky', 'Referral credits', RM(m.creditsIssued), `${RM(m.cashRedeemed)} cashed out`, [0,0,50,50,100,100,150,m.creditsIssued], '#4cc9ff', true)}
  </div>

  <div class="grid g-3 mt-18">
    <div class="card span-2">
      <div class="card-head"><h3>Pipeline health</h3><span class="sub">prospects by stage</span>
        <a class="btn btn-ghost btn-sm" style="margin-left:auto" href="#/admin/pipeline">${icon('pipeline')} Open board</a></div>
      ${pipelineBars(buckets)}
    </div>
    ${role === 'admin' ? revenueCard(m) : automationCard()}
  </div>

  <div class="grid g-3 mt-18">
    <div class="card">
      <div class="card-head"><div class="kpi-icon t-rose">${icon('fire')}</div><h3>Hot leads</h3>
        <span class="pill pill-rose" style="margin-left:auto">≥ ${QUALIFY_THRESHOLD} score</span></div>
      ${hotLeads()}
    </div>
    <div class="card span-2">
      <div class="card-head"><div class="kpi-icon t-grow">${icon('bolt')}</div><h3>Automation feed</h3>
        <span class="sub">what the engine did for you</span></div>
      ${activityFeed()}
    </div>
  </div>`;
}

function kpi(ic, tint, label, value, foot, spark, color, isMoney) {
  return `<div class="card kpi">
    <div class="kpi-label"><span class="kpi-icon ${tint}">${icon(ic)}</span> ${label}</div>
    <div class="kpi-value">${value}</div>
    <div class="kpi-foot"><span class="delta-up">${icon('arrowUp')}</span><span class="muted">${foot}</span></div>
    ${sparkline(spark, color)}
  </div>`;
}

function pipelineBars(buckets) {
  const max = Math.max(...store.STATUSES.map(s => (buckets[s.id] || []).length), 1);
  return `<div class="stack gap-10">${store.STATUSES.map(s => {
    const n = (buckets[s.id] || []).length;
    return `<div class="row gap-14">
      <div style="width:140px" class="text-sm fw-600 hi">${s.label}</div>
      <div class="bar" style="flex:1"><i style="width:${(n/max)*100}%;background:${s.color}"></i></div>
      <div class="num fw-700 hi" style="width:28px;text-align:right">${n}</div>
    </div>`;
  }).join('')}</div>`;
}

function revenueCard(m) {
  return `<div class="card">
    <div class="card-head"><div class="kpi-icon t-amber">${icon('chart')}</div><h3>Revenue mix</h3></div>
    ${[['Activations', m.activationRevenue, '#00e5a0'],['Add-on upsells', m.upsellRevenue, '#7c5cff'],['Renewals (annualised)', m.renewalRevenue, '#ffb547']]
      .map(([l,v,c]) => {
        const tot = m.activationRevenue + m.upsellRevenue + m.renewalRevenue || 1;
        return `<div class="mt-14"><div class="between text-sm"><span class="muted">${l}</span><span class="fw-700 hi mono">${RM(v)}</span></div>
        <div class="bar mt-8"><i style="width:${(v/tot)*100}%;background:${c}"></i></div></div>`;
      }).join('')}
    <div class="divider"></div>
    <div class="between"><span class="muted text-sm">Avg. customer LTV</span><span class="kpi-value" style="font-size:22px">${RM(m.ltv)}+</span></div>
  </div>`;
}

function automationCard() {
  return `<div class="card">
    <div class="card-head"><div class="kpi-icon t-grow">${icon('spark')}</div><h3>Engine automation</h3></div>
    <div class="stack gap-14">
      ${[['Auto lead scoring','Every prospect ranked 0–100 on entry','target'],
         ['AI website generation','Socials → full site spec in seconds','spark'],
         ['WhatsApp quoting','Pre-filled activation messages','whatsapp'],
         ['Referral auto-credit','Wallet credited on payment','gift']]
        .map(([t,d,i]) => `<div class="row gap-14"><div class="kpi-icon t-grow">${icon(i)}</div>
          <div><div class="fw-600 hi text-sm">${t}</div><div class="text-xs dim">${d}</div></div></div>`).join('')}
    </div>
  </div>`;
}

function hotLeads() {
  const hot = [...store.prospects()].filter(p => !['activated','renewal'].includes(p.status))
    .sort((a,b) => b.score - a.score).slice(0, 5);
  if (!hot.length) return `<div class="empty">${icon('check')}<div>Pipeline all converted 🎉</div></div>`;
  return `<div class="stack gap-10">${hot.map(p => {
    const b = band(p.score);
    return `<a class="lead-card" href="#/admin/prospect/${p.id}">
      <div class="lc-top">
        <div><div class="lc-name">${p.company_name}</div><div class="lc-cat">${p.city} · ${(p.followers/1000).toFixed(1)}k followers</div></div>
        <div class="score-ring" style="--val:${p.score};--ring-c:var(--${b.color})"><span>${p.score}</span></div>
      </div>
    </a>`;
  }).join('')}</div>`;
}

function activityFeed() {
  // Synthesize a feed from recent data points
  const items = [];
  store.prospects().filter(p => p.website_spec).slice(0,3).forEach(p =>
    items.push(['spark','violet', `AI generated a website for <b>${p.company_name}</b>`, p.created_at]));
  store.prospects().filter(p => p.analytics?.opens > 0).sort((a,b)=>new Date(b.analytics.lastOpenedAt)-new Date(a.analytics.lastOpenedAt)).slice(0,3).forEach(p =>
    items.push(['eye','sky', `<b>${p.company_name}</b> opened their preview (${p.analytics.opens}×)`, p.analytics.lastOpenedAt]));
  store.referrals().filter(r=>r.activation_status==='confirmed').slice(0,2).forEach(r =>
    items.push(['gift','amber', `Referral credit awarded for <b>${r.referred_company_name}</b>`, r.created_at]));
  store.clients().slice(0,2).forEach(c =>
    items.push(['rocket','grow', `<b>${c.company_name}</b> activated · ${RM(c.package_price)}`, c.activation_date]));

  items.sort((a,b) => new Date(b[3]) - new Date(a[3]));
  return `<div class="stack">${items.slice(0,7).map(([ic,col,txt,t]) => `
    <div class="sop-step" style="padding:11px 0;border-color:var(--line-soft)">
      <div class="kpi-icon t-${col}" style="flex:none">${icon(ic)}</div>
      <div style="flex:1"><div class="text-sm hi">${txt}</div><div class="text-xs dim">${timeAgo(t)}</div></div>
    </div>`).join('')}</div>`;
}
