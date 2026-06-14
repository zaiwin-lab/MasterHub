// Client portal (post-activation, Module E) — gallery, announcement, contact,
// plus the client's referral dashboard (Module H view).
import { icon } from '../lib/icons.js';
import * as store from '../lib/store.js';
import { RM, fmtDate, daysUntil, toast, esc } from '../lib/ui.js';
import { PRICING } from '../lib/pricing.js';

export function renderClientPortal(id) {
  const c = store.clientById(id);
  if (!c) return `<div class="empty" style="min-height:100vh;display:grid;place-content:center">${icon('users')}<div>Client not found.</div><a class="btn btn-ghost mt-14" href="#/admin/clients">Back</a></div>`;
  const w = store.walletForClient(c.id) || { credit_balance: 0, total_credit_earned: 0, cash_redeemed: 0 };
  const refs = store.referralsForClient(c.id);
  const o = store.orders().find(x => x.client_id === c.id) || {};
  const renewDue = daysUntil(c.renewal_due_date);
  const refLink = `${location.origin}${location.pathname}#/?ref=${c.referral_code}`;
  const pctTo = Math.min(100, (w.credit_balance / PRICING.referral.cashRedeemThreshold) * 100);
  setTimeout(() => wire(c), 0);

  return `
  <div class="cp">
    <header class="cp-nav">
      <div class="row gap-12"><div class="brand-mark">${esc((c.company_name || '?')[0])}</div>
        <div><div class="brand-name">${esc(c.company_name)}</div><div class="brand-sub">Client Dashboard</div></div></div>
      <div class="row gap-10">
        <span class="pill pill-grow">${icon('check')} Active</span>
        <a class="btn btn-ghost btn-sm" href="${c.activated_website_url}" target="_blank">${icon('eye')} View site</a>
        <a class="btn btn-ghost btn-sm" href="#/admin/clients">${icon('dashboard')} Engine</a>
      </div>
    </header>

    <div class="cp-body">
      <div class="page-head">
        <span class="eyebrow">${icon('rocket')} Welcome aboard</span>
        <h1 class="page-title">Manage ${esc(c.company_name)}</h1>
        <p class="page-sub">Your website is live and yours to manage. Update content anytime — changes publish instantly.</p>
      </div>

      <div class="grid g-4">
        ${stat('money','t-grow','Plan', RM(c.package_price))}
        ${stat('clock','t-amber','Renewal', renewDue + ' days')}
        ${stat('gift','t-violet','Referral credit', RM(w.credit_balance))}
        ${stat('users','t-sky','Referrals', refs.length)}
      </div>

      <div class="grid g-3 mt-18">
        <div class="stack gap-18 span-2">
          <div class="card">
            <div class="card-head"><div class="kpi-icon t-violet">${icon('image')}</div><h3>Gallery</h3><span class="sub">add your best photos</span></div>
            <div class="cp-gallery" id="cpGallery">
              ${(c.gallery.length ? c.gallery : ['','','']).map((g, i) => g
                ? `<div class="cp-shot" style="background-image:url('${esc(g)}')"></div>`
                : `<div class="cp-shot empty-shot">${icon('image')}</div>`).join('')}
              <button class="cp-shot add-shot" id="addShot">${icon('plus')}<span>Add image URL</span></button>
            </div>
          </div>

          <div class="card">
            <div class="card-head"><div class="kpi-icon t-amber">${icon('megaphone')}</div><h3>Moving / announcement</h3></div>
            <div class="field"><textarea class="input" id="announceBox" placeholder="e.g. We're moving to a new location from 1 July! New address: ...">${esc(c.announcement || '')}</textarea></div>
            <button class="btn btn-primary btn-sm" id="saveAnnounce">${icon('check')} Publish announcement</button>
          </div>

          <div class="card">
            <div class="card-head"><div class="kpi-icon t-sky">${icon('phone')}</div><h3>Contact details</h3></div>
            <div class="field-row">
              <div class="field"><label>Phone</label><input class="input" id="cPhone" value="${esc(c.phone || '')}"/></div>
              <div class="field"><label>Email</label><input class="input" id="cEmail" value="${esc(c.email || '')}"/></div>
            </div>
            <button class="btn btn-primary btn-sm" id="saveContact">${icon('check')} Save contact</button>
          </div>

          ${promoCard(c)}
          ${newsCard(c, o)}
        </div>

        <div class="stack gap-18">
          <div class="card cp-referral">
            <div class="card-head"><div class="kpi-icon t-grow">${icon('gift')}</div><h3>Refer & earn</h3></div>
            <p class="text-sm muted">Earn <b class="hi">${RM(PRICING.referral.rewardPerActivation)}</b> renewal credit for every business that activates through your link.</p>
            <div class="field mt-14"><label>Your referral link</label>
              <div class="row gap-8"><input class="input mono text-xs" id="refLink" readonly value="${esc(refLink)}"/>
                <button class="btn btn-ghost" id="copyRef">${icon('copy')}</button></div>
            </div>
            <div class="cp-credit">
              <div class="between"><span class="text-sm muted">Credit balance</span><span class="kpi-value" style="font-size:22px">${RM(w.credit_balance)}</span></div>
              <div class="bar mt-8"><i style="width:${pctTo}%"></i></div>
              <div class="text-xs dim mt-8">${w.credit_balance >= PRICING.referral.cashRedeemThreshold
                ? '🎉 Eligible to redeem ' + RM(PRICING.referral.cashRedeemThreshold) + ' cash!'
                : RM(PRICING.referral.cashRedeemThreshold - w.credit_balance) + ' more to unlock ' + RM(PRICING.referral.cashRedeemThreshold) + ' cash-out'}</div>
              ${w.credit_balance >= PRICING.referral.cashRedeemThreshold
                ? `<button class="btn btn-primary btn-block mt-14" id="redeemBtn">${icon('money')} Redeem ${RM(PRICING.referral.cashRedeemThreshold)} cash</button>` : ''}
            </div>
            <div class="divider"></div>
            <div class="text-xs dim">${refs.length ? 'Your referrals' : 'No referrals yet — share your link!'}</div>
            ${refs.map(r => `<div class="between" style="padding:8px 0;border-bottom:1px solid var(--line-soft)">
              <span class="text-sm hi">${esc(r.referred_company_name)}</span>
              <span class="pill ${r.activation_status==='confirmed'?'pill-grow':'pill-amber'}">${r.activation_status==='confirmed'?'+'+RM(r.reward_amount):'pending'}</span></div>`).join('')}
          </div>

          <div class="card">
            <div class="card-head"><div class="kpi-icon t-amber">${icon('money')}</div><h3>Your plan</h3></div>
            ${[['Activation', RM(o.activation_fee||500)],
               o.ai_chatbot ? ['AI Chatbot', RM(PRICING.addons.chatbot.price)] : null,
               o.news_module ? ['News Module', RM(PRICING.addons.news.price)] : null,
               o.ecommerce ? ['E-commerce Store', RM(PRICING.addons.ecommerce.price)] : null,
               o.extra_email_count ? [`${o.extra_email_count}× Email`, RM(o.extra_email_count*PRICING.addons.email.price)] : null,
               ['Activated', fmtDate(c.activation_date)],
               ['Renews', fmtDate(c.renewal_due_date)]].filter(Boolean)
              .map(([l,v]) => `<div class="between" style="padding:8px 0;border-bottom:1px solid var(--line-soft)"><span class="text-sm muted">${l}</span><span class="text-sm fw-600 hi">${v}</span></div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function stat(ic, tint, label, value) {
  return `<div class="card kpi"><div class="kpi-label"><span class="kpi-icon ${tint}">${icon(ic)}</span> ${label}</div><div class="kpi-value" style="font-size:24px">${value}</div></div>`;
}

// Promo Module — running promo with a countdown shown on the live site.
function promoCard(c) {
  const p = c.promo || { enabled: false, headline: '', sub: '', endsAt: '' };
  const localDt = p.endsAt ? new Date(p.endsAt).toISOString().slice(0, 16) : '';
  return `<div class="card">
    <div class="card-head"><div class="kpi-icon t-amber">${icon('fire')}</div><h3>Promo Module</h3><span class="sub">running offer + countdown</span></div>
    <label class="row gap-8" style="margin-bottom:12px;cursor:pointer"><input type="checkbox" id="promoOn" ${p.enabled ? 'checked' : ''} style="width:18px;height:18px;accent-color:var(--grow)"/> <span class="text-sm hi">Show promo banner on my site</span></label>
    <div class="field"><label>Headline</label><input class="input" id="promoHeadline" maxlength="80" value="${esc(p.headline || '')}" placeholder="e.g. Raya Sale — 20% off everything"/></div>
    <div class="field"><label>Subtext</label><input class="input" id="promoSub" maxlength="120" value="${esc(p.sub || '')}" placeholder="e.g. Use code RAYA20 at checkout"/></div>
    <div class="field"><label>Ends at</label><input class="input" id="promoEnds" type="datetime-local" value="${esc(localDt)}"/></div>
    <button class="btn btn-primary btn-sm" id="savePromo">${icon('check')} Publish promo</button>
  </div>`;
}

// News / Blog Module — real posting UI (delivers the RM100 add-on).
function newsCard(c, o) {
  if (!o || !o.news_module) {
    return `<div class="card">
      <div class="card-head"><div class="kpi-icon t-violet">${icon('megaphone')}</div><h3>News & Blog</h3></div>
      <p class="text-sm muted">Publish articles for SEO and customer updates. <b class="hi">Add the News Module (${RM(PRICING.addons.news.price)})</b> to unlock — message KOBIS on WhatsApp to enable.</p>
    </div>`;
  }
  const posts = c.news || [];
  return `<div class="card">
    <div class="card-head"><div class="kpi-icon t-violet">${icon('megaphone')}</div><h3>News & Blog</h3><span class="sub">${posts.length} post(s)</span></div>
    <div class="field"><label>Title</label><input class="input" id="newsTitle" maxlength="120" placeholder="Post title"/></div>
    <div class="field"><label>Body</label><textarea class="input" id="newsBody" maxlength="4000" placeholder="Write your update…"></textarea></div>
    <button class="btn btn-primary btn-sm" id="addNews">${icon('plus')} Publish post</button>
    <div class="divider"></div>
    ${posts.length ? posts.map(n => `<div class="between" style="padding:9px 0;border-bottom:1px solid var(--line-soft)">
      <div><div class="text-sm fw-600 hi">${esc(n.title)}</div><div class="text-xs dim">${fmtDate(n.created_at)}</div></div>
      <button class="btn btn-ghost btn-sm" data-delnews="${n.id}">${icon('x')}</button></div>`).join('') : '<div class="text-xs dim">No posts yet.</div>'}
  </div>`;
}

function wire(c) {
  document.getElementById('saveAnnounce')?.addEventListener('click', () => {
    store.updateClient(c.id, { announcement: document.getElementById('announceBox').value });
    toast('Announcement published', 'amber');
  });
  document.getElementById('saveContact')?.addEventListener('click', () => {
    store.updateClient(c.id, { phone: document.getElementById('cPhone').value, email: document.getElementById('cEmail').value });
    toast('Contact details saved');
  });
  document.getElementById('addShot')?.addEventListener('click', () => {
    const url = prompt('Paste an image URL for your gallery:');
    if (url) { const g = [...c.gallery, url]; store.updateClient(c.id, { gallery: g }); toast('Image added to gallery', 'violet'); }
  });
  document.getElementById('copyRef')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(document.getElementById('refLink').value); toast('Referral link copied', 'grow');
  });
  document.getElementById('redeemBtn')?.addEventListener('click', () => {
    if (store.redeemCash(c.id)) toast(`${RM(PRICING.referral.cashRedeemThreshold)} cash redemption requested`, 'amber');
  });
  document.getElementById('savePromo')?.addEventListener('click', () => {
    const ends = document.getElementById('promoEnds').value;
    store.updateClient(c.id, { promo: {
      enabled: document.getElementById('promoOn').checked,
      headline: document.getElementById('promoHeadline').value.slice(0, 80),
      sub: document.getElementById('promoSub').value.slice(0, 120),
      endsAt: ends ? new Date(ends).toISOString() : '',
    }});
    toast('Promo published to your site', 'amber');
  });
  document.getElementById('addNews')?.addEventListener('click', () => {
    const title = document.getElementById('newsTitle').value.trim();
    const body = document.getElementById('newsBody').value.trim();
    if (!title) { toast('Add a title first', 'rose'); return; }
    const news = [{ id: 'news_' + Math.random().toString(36).slice(2, 9), title: title.slice(0, 120), body: body.slice(0, 4000), created_at: new Date().toISOString() }, ...(c.news || [])];
    store.updateClient(c.id, { news });
    toast('Post published', 'violet');
  });
  document.querySelectorAll('[data-delnews]').forEach(b => b.addEventListener('click', () => {
    store.updateClient(c.id, { news: (c.news || []).filter(n => n.id !== b.dataset.delnews) });
    toast('Post deleted');
  }));
}
