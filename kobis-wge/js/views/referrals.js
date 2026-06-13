// Referrals & Credits — Module H. Wallets, attribution, cash redemption (Rec 5).
import { icon } from '../lib/icons.js';
import * as store from '../lib/store.js';
import { RM, fmtDate, timeAgo, toast, esc } from '../lib/ui.js';
import { PRICING } from '../lib/pricing.js';
import { rbacBlock } from './clients.js';

export function renderReferrals() {
  if (store.role() !== 'admin') return rbacBlock();
  setTimeout(wire, 0);
  const wallets = store.wallets();
  const refs = store.referrals();
  const totalIssued = refs.filter(r => r.activation_status === 'confirmed').reduce((s, r) => s + r.reward_amount, 0);
  const eligible = wallets.filter(w => w.credit_balance >= PRICING.referral.cashRedeemThreshold).length;

  return `
  <div class="page-head">
    <span class="eyebrow">${icon('gift')} Referrals & Credits</span>
    <h1 class="page-title">Organic growth, tracked to the ringgit</h1>
    <p class="page-sub">Every activation earns the referrer ${RM(PRICING.referral.rewardPerActivation)} renewal credit (released on payment confirmation — Rec 5). Cash-out unlocks at ${RM(PRICING.referral.cashRedeemThreshold)}.</p>
  </div>

  <div class="grid g-4">
    ${stat('gift','t-grow','Credits issued', RM(totalIssued))}
    ${stat('users','t-violet','Referrers', wallets.filter(w=>w.total_credit_earned>0).length)}
    ${stat('check','t-sky','Confirmed referrals', refs.filter(r=>r.activation_status==='confirmed').length)}
    ${stat('money','t-amber','Cash-out eligible', eligible)}
  </div>

  <div class="grid g-3 mt-18">
    <div class="card span-2">
      <div class="card-head"><div class="kpi-icon t-grow">${icon('wallet')}</div><h3>Credit wallets</h3></div>
      <table class="tbl">
        <thead><tr><th>Client</th><th>Referrals</th><th>Earned</th><th>Balance</th><th>Cashed</th><th></th></tr></thead>
        <tbody>
          ${wallets.map(walletRow).join('') || `<tr><td colspan="6"><div class="empty">No wallets yet.</div></td></tr>`}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-head"><div class="kpi-icon t-violet">${icon('link')}</div><h3>How it flows</h3></div>
      ${['Client shares unique referral link','Referred business activates & pays',`${RM(50)} auto-credited on confirmation`,`At ${RM(500)} → redeem for cash`]
        .map((t,i) => `<div class="row gap-14" style="padding:11px 0;border-bottom:1px solid var(--line-soft)">
          <div class="step-num">${i+1}</div><div class="text-sm hi">${t}</div></div>`).join('')}
      <div class="pill pill-grow mt-14" style="width:100%;justify-content:center;padding:8px">${icon('shield')} Credit = domain & hosting renewals only</div>
    </div>
  </div>

  <div class="card mt-18">
    <div class="card-head"><div class="kpi-icon t-sky">${icon('gift')}</div><h3>Referral ledger</h3></div>
    <table class="tbl">
      <thead><tr><th>Referrer</th><th>Referred business</th><th>Status</th><th>Reward</th><th>When</th></tr></thead>
      <tbody>
        ${refs.slice().reverse().map(refRow).join('') || `<tr><td colspan="5"><div class="empty">No referrals yet.</div></td></tr>`}
      </tbody>
    </table>
  </div>`;
}

function walletRow(w) {
  const c = store.clientById(w.client_id);
  const n = store.referralsForClient(w.client_id).length;
  const eligible = w.credit_balance >= PRICING.referral.cashRedeemThreshold;
  const pctTo = Math.min(100, (w.credit_balance / PRICING.referral.cashRedeemThreshold) * 100);
  return `<tr>
    <td><div class="fw-700 hi">${esc(c?.company_name || '—')}</div><div class="text-xs dim mono">ref/${esc(c?.referral_code || '')}</div></td>
    <td class="num">${n}</td>
    <td class="num muted">${RM(w.total_credit_earned)}</td>
    <td><div class="fw-700 hi mono">${RM(w.credit_balance)}</div><div class="bar" style="width:80px;margin-top:5px"><i style="width:${pctTo}%"></i></div></td>
    <td class="num muted">${RM(w.cash_redeemed)}</td>
    <td>${eligible ? `<button class="btn btn-primary btn-sm" data-redeem="${w.client_id}">${icon('money')} Redeem ${RM(500)}</button>` : `<span class="text-xs dim">${RM(PRICING.referral.cashRedeemThreshold - w.credit_balance)} to go</span>`}</td>
  </tr>`;
}

function refRow(r) {
  const c = store.clientById(r.referrer_client_id);
  const ok = r.activation_status === 'confirmed';
  return `<tr>
    <td class="fw-600 hi">${esc(c?.company_name || '—')}</td>
    <td>${esc(r.referred_company_name)}</td>
    <td><span class="pill ${ok?'pill-grow':'pill-amber'}"><span class="dot" style="background:${ok?'var(--grow)':'var(--amber)'}"></span>${ok?'Confirmed':'Pending'}</span></td>
    <td class="num fw-600 hi">${RM(r.reward_amount)}</td>
    <td class="text-sm muted">${timeAgo(r.created_at)}</td>
  </tr>`;
}

function stat(ic, tint, label, value) {
  return `<div class="card kpi"><div class="kpi-label"><span class="kpi-icon ${tint}">${icon(ic)}</span> ${label}</div><div class="kpi-value">${value}</div></div>`;
}

function wire() {
  document.querySelectorAll('[data-redeem]').forEach(b => b.addEventListener('click', () => {
    if (store.redeemCash(b.dataset.redeem)) toast(`${RM(500)} cash redemption recorded`, 'amber');
  }));
}
