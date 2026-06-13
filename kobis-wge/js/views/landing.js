// Public Launch Hub — the marketing front door + waitlist request (Rec 6/8).
import { icon } from '../lib/icons.js';
import * as store from '../lib/store.js';
import { PRICING } from '../lib/pricing.js';
import { RM, toast, esc } from '../lib/ui.js';
import { CATEGORY_LABEL } from '../lib/scoring.js';

export function renderLanding() {
  // capture ?ref= from the hash query (referral link → kobislaunch.com/ref/x)
  const q = (location.hash.split('?')[1] || '');
  const ref = new URLSearchParams(q).get('ref') || '';

  setTimeout(wire, 0);

  return `
  <header class="lh-nav">
    <a class="brand" href="#/"><div class="brand-mark">K</div>
      <div><div class="brand-name">KOBIS</div><div class="brand-sub">Berhad</div></div></a>
    <nav class="lh-nav-links">
      <a href="#how">How it works</a><a href="#pricing">Pricing</a><a href="#request">Request preview</a>
    </nav>
    <a class="btn btn-ghost btn-sm" href="#/admin">${icon('dashboard')} Engine Login</a>
  </header>

  <section class="lh-hero">
    <div class="lh-hero-inner">
      <span class="pill pill-grow">${icon('bolt')} The website you can see before you buy</span>
      <h1 class="lh-h1">Build First.<br><span class="grad">Sell Later.</span> Grow Forever.</h1>
      <p class="lh-lead">KOBIS builds a complete, professional website preview for your business — <b>before</b> you pay a cent. Love it? Activate ownership for a one-time <b>${RM(PRICING.activation)}</b>. That's it.</p>
      <div class="lh-cta-row">
        <a class="btn btn-primary" href="#request">${icon('rocket')} Request my free preview</a>
        <a class="btn btn-ghost" href="#/preview/aimankopi">${icon('eye')} See a live example</a>
      </div>
      <div class="lh-trust">
        ${[['No deposit','check'],['No contracts','check'],['See it before you pay','check'],['Live in days, not weeks','check']]
          .map(([t,i]) => `<span>${icon(i)} ${t}</span>`).join('')}
      </div>
    </div>
    <div class="lh-hero-card">
      ${miniPreviewCard()}
    </div>
  </section>

  <section class="lh-band" id="how">
    <div class="lh-section-head">
      <span class="eyebrow">The inverted model</span>
      <h2>We removed the scariest part of buying a website: <span class="grad">uncertainty.</span></h2>
    </div>
    <div class="lh-compare">
      <div class="lh-compare-col bad">
        <div class="lh-compare-tag">Traditional agency · high friction</div>
        ${['Proposal','Discussion','Deposit','Build','Revisions','Pay'].map((s,i,a)=>`<div class="lh-flow-step">${s}${i<a.length-1?'<span class="arr">→</span>':''}</div>`).join('')}
        <p class="lh-compare-note">Weeks of back-and-forth before you see anything real.</p>
      </div>
      <div class="lh-compare-col good">
        <div class="lh-compare-tag">KOBIS engine · zero friction</div>
        ${['Identify','Build Preview','Send','Activate','Upsell','Renew'].map((s,i,a)=>`<div class="lh-flow-step">${s}${i<a.length-1?'<span class="arr">→</span>':''}</div>`).join('')}
        <p class="lh-compare-note">You see exactly what you'll own — then decide.</p>
      </div>
    </div>
  </section>

  <section class="lh-band">
    <div class="lh-feature-grid">
      ${[
        ['eye','Tangible proof','See the finished website before any commitment — not a mockup, the real thing.'],
        ['spark','AI-assisted build','Smart generation turns your socials into a polished site in hours, not weeks.'],
        ['gift','Grow by referral','Earn ${RM(50)} renewal credit for every business you refer. Cash out at ${RM(500)}.'],
        ['shield','Yours to keep','Activate and you own it — hosting, domain, business email & dashboard included.'],
      ].map(([ic,t,d]) => `
        <div class="lh-feature">
          <div class="lh-feature-ic t-grow">${icon(ic)}</div>
          <h3>${t}</h3><p>${d.replace('${RM(50)}',RM(50)).replace('${RM(500)}',RM(500))}</p>
        </div>`).join('')}
    </div>
  </section>

  <section class="lh-band" id="pricing">
    <div class="lh-section-head">
      <span class="eyebrow">Simple, honest pricing</span>
      <h2>One website. <span class="grad">${RM(PRICING.activation)}</span> to own it.</h2>
      <p class="muted">Selected Business Launch Promotion — ${RM(PRICING.websiteValue)} value.</p>
    </div>
    <div class="lh-pricing">
      <div class="lh-price-card featured">
        <div class="lh-price-tag">Activation</div>
        <div class="lh-price"><s>${RM(PRICING.websiteValue)}</s> ${RM(PRICING.activation)}<span>one-time</span></div>
        <ul class="lh-price-list">
          ${['Website ownership activation','1-year hosting','Domain setup','1 business email','Admin dashboard access','Gallery & announcement updates','Basic technical support']
            .map(f=>`<li>${icon('check')} ${f}</li>`).join('')}
        </ul>
        <a class="btn btn-primary btn-block" href="#request">Request my preview</a>
        <div class="lh-renewal">Then ${RM(PRICING.renewal)}/year — domain, hosting & maintenance.</div>
      </div>
      <div class="lh-addons">
        <h4>Power it up</h4>
        ${Object.values(PRICING.addons).map(a=>`
          <div class="lh-addon">
            <div><div class="fw-600 hi">${a.label}</div><div class="text-xs dim">${a.blurb}</div></div>
            <div class="lh-addon-price">${RM(a.price)}${a.unit||''}</div>
          </div>`).join('')}
        <div class="lh-addon-foot">${icon('spark')} First-payment potential up to <b>${RM(800)}</b> with add-ons.</div>
      </div>
    </div>
  </section>

  <section class="lh-band" id="request">
    <div class="lh-request">
      <div class="lh-request-copy">
        <span class="eyebrow">Phase 2 · invite-only</span>
        <h2>Join the preview waitlist</h2>
        <p class="muted">We build a limited number of previews each week to keep quality high. Drop your details and we'll prepare yours.</p>
        <div class="lh-waitlist-meta">${icon('users')} <b id="wlCount">${store.waitlist().length}</b> businesses in the queue</div>
        ${ref ? `<div class="pill pill-violet mt-14">${icon('gift')} Referred by <b style="margin-left:4px">${esc(ref)}</b> — attribution locked in</div>` : ''}
      </div>
      <form class="lh-form card" id="wlForm">
        <div class="field"><label>Business name</label><input class="input" name="company_name" required placeholder="e.g. Kopi Tujuh" /></div>
        <div class="field-row">
          <div class="field"><label>Contact person</label><input class="input" name="contact_person" required placeholder="Your name" /></div>
          <div class="field"><label>Email</label><input class="input" type="email" name="email" required placeholder="you@business.com" /></div>
        </div>
        <div class="field-row">
          <div class="field"><label>Category</label>
            <select class="select" name="business_category">
              ${Object.entries(CATEGORY_LABEL).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}
            </select>
          </div>
          <div class="field"><label>Referral code <span class="hint">(optional)</span></label>
            <input class="input" name="referral_code" value="${esc(ref)}" placeholder="friend's code" /></div>
        </div>
        <button class="btn btn-primary btn-block" type="submit">${icon('send')} Join the waitlist</button>
        <div class="text-xs dim center mt-8">Preview prepared by KOBIS Berhad · no payment required</div>
      </form>
    </div>
  </section>

  <footer class="lh-foot">
    <div class="row gap-10"><div class="brand-mark" style="width:30px;height:30px;font-size:15px">K</div><b class="hi">KOBIS Berhad</b></div>
    <div class="text-xs dim">Build First. Sell Later. Grow Forever. · © ${new Date().getFullYear()} KOBIS Website Growth Engine</div>
    <a class="text-xs" href="#/admin" style="color:var(--grow)">Engine dashboard →</a>
  </footer>`;
}

function miniPreviewCard() {
  return `<div class="mini-prev">
    <div class="mini-prev-bar"><span></span><span></span><span></span><em>kobislaunch.com/preview</em></div>
    <div class="mini-prev-body">
      <div class="mini-marker">${icon('shield')} Professional Website Preview · KOBIS Berhad</div>
      <div class="mini-hero">
        <div class="mini-eyebrow">CAFE · BANGSAR</div>
        <div class="mini-title">Kopi Tujuh</div>
        <div class="mini-sub">Freshly made. Locally loved.</div>
        <div class="mini-cta">Activate Website Ownership</div>
      </div>
      <div class="mini-thumbs">${[1,2,3].map(()=>'<div class="mini-thumb"></div>').join('')}</div>
    </div>
  </div>`;
}

function wire() {
  const form = document.getElementById('wlForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    store.joinWaitlist(Object.fromEntries(fd.entries()));
    toast('🎉 You\'re on the waitlist! KOBIS will prepare your preview.', 'grow');
    form.reset();
    const c = document.getElementById('wlCount'); if (c) c.textContent = store.waitlist().length;
  });
}
