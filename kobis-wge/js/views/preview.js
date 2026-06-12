// Live website PREVIEW (Module B) + Activation popup (Module C) + WhatsApp (D).
// Themed per industry from the AI-generated spec. Records opens (Rec 3) and
// shows a preview-expiry notice (Rec 2). No login required (core UX rule).
import { icon } from '../lib/icons.js';
import * as store from '../lib/store.js';
import { RM, daysUntil } from '../lib/ui.js';
import { quote, whatsappActivation, PRICING } from '../lib/pricing.js';

// Record each preview open at most once per app session (a store mutation
// re-renders the active view, so without this guard recordOpen would loop).
const recorded = new Set();

export function renderPreview(slug) {
  const p = store.prospectBySlug(slug);
  if (!p || !p.website_spec) {
    return `<div class="empty" style="min-height:100vh;display:grid;place-content:center">
      ${icon('preview')}<div>Preview not found or not yet generated.</div>
      <a class="btn btn-ghost mt-14" href="#/">Back to KOBIS</a></div>`;
  }
  // record the open once (analytics) — skip inside the admin iframe preview
  if (!window.frameElement && !recorded.has(slug)) {
    recorded.add(slug);
    setTimeout(() => store.recordOpen(slug), 600);
  }

  const s = p.website_spec, t = s.theme;
  const expiry = p.preview_expires_at ? daysUntil(p.preview_expires_at) : null;
  setTimeout(() => wire(p), 0);

  return `
  <div class="site" style="--site-bg:${t.bg};--site-accent:${t.accent};--site-tint:${t.tint};--site-font:${t.font === 'serif' ? 'Georgia, \'Times New Roman\', serif' : '\'Sora\', sans-serif'}">
    <div class="site-marker">${icon('shield')} Professional Website Preview Prepared by <b>KOBIS Berhad</b>
      ${expiry !== null ? `<span class="site-marker-exp">· preview ${expiry > 0 ? 'expires in ' + expiry + ' days' : 'expired'}</span>` : ''}
      <button class="site-marker-cta" data-activate>Activate Website Ownership</button>
    </div>

    <header class="site-nav">
      <div class="site-logo">${s.meta.name}</div>
      <nav class="site-links">
        <a href="#site-about">About</a><a href="#site-services">${s.servicesSection.name}</a>
        <a href="#site-gallery">Gallery</a><a href="#site-contact">Contact</a>
      </nav>
      <a class="site-wa" href="#site-contact">${icon('whatsapp')} WhatsApp</a>
    </header>

    <section class="site-hero">
      <div class="site-hero-inner">
        <div class="site-eyebrow">${s.hero.eyebrow}</div>
        <h1 class="site-h1">${s.hero.headline}</h1>
        <p class="site-sub">${s.hero.sub}</p>
        <div class="site-hero-cta">
          <a class="site-btn-primary" href="#site-contact">${s.hero.primaryCta}</a>
          <a class="site-btn-ghost" href="#site-services">${s.hero.secondaryCta}</a>
        </div>
        <div class="site-stats">${s.about.stats.map(st => `<div><b>${st.k}</b><span>${st.v}</span></div>`).join('')}</div>
      </div>
      <div class="site-hero-art"><div class="site-hero-blob"></div></div>
    </section>

    <section class="site-section" id="site-about">
      <div class="site-2col">
        <div><div class="site-tag">About</div><h2 class="site-h2">${s.about.title}</h2></div>
        <p class="site-body">${s.about.body}</p>
      </div>
    </section>

    <section class="site-section site-alt" id="site-services">
      <div class="site-tag center-tag">${s.servicesSection.name}</div>
      <h2 class="site-h2 center">What we offer</h2>
      <div class="site-grid">
        ${s.servicesSection.items.map(it => `<div class="site-card">
          <div class="site-card-top"><h3>${it.title}</h3>${it.price ? `<span class="site-price">${it.price}</span>` : ''}</div>
          <p>${it.blurb}</p></div>`).join('')}
      </div>
    </section>

    <section class="site-section" id="site-gallery">
      <div class="site-tag center-tag">Gallery</div>
      <h2 class="site-h2 center">A look inside</h2>
      <div class="site-gallery">
        ${s.gallery.plan.map((g, i) => `<div class="site-shot site-shot-${i % 3}"><span>${g}</span></div>`).join('')}
      </div>
    </section>

    <section class="site-section site-alt" id="site-contact">
      <div class="site-contact">
        <div>
          <div class="site-tag">Get in touch</div>
          <h2 class="site-h2">${s.hero.primaryCta}</h2>
          <p class="site-body">We'd love to hear from you. Reach out and we'll respond fast.</p>
          <div class="site-contact-lines">
            ${s.contact.lines.map(l => `<div class="site-contact-line">${icon(l.icon)} ${l.label}</div>`).join('')}
          </div>
          <a class="site-btn-wa" href="#" data-activate>${icon('whatsapp')} ${s.hero.primaryCta} on WhatsApp</a>
        </div>
        <div class="site-contact-card">
          <div class="site-mini-map"></div>
          <div class="site-socials">
            ${s.contact.socials.map(so => `<span>${so.k}</span>`).join('') || '<span>Follow us</span>'}
          </div>
        </div>
      </div>
    </section>

    <footer class="site-foot">
      <span>© ${new Date().getFullYear()} ${s.meta.name}</span>
      <span class="site-foot-mark">${icon('shield')} Built with KOBIS Berhad</span>
    </footer>

    <button class="site-float" data-activate>${icon('rocket')} Activate Website Ownership</button>
  </div>`;
}

// ---- activation popup (Module C → D) -------------------------------------
function wire(p) {
  document.querySelectorAll('[data-activate]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); openActivation(p); }));
}

function openActivation(p) {
  const sel = { chatbot: false, news: false, emailCount: 0 };
  const scrim = document.createElement('div');
  scrim.className = 'modal-scrim';
  scrim.innerHTML = popupHtml(p, sel);
  scrim.addEventListener('mousedown', (e) => { if (e.target === scrim) scrim.remove(); });
  document.body.appendChild(scrim);

  const refresh = () => {
    scrim.querySelector('#pkgSummary').innerHTML = pkgSummary(sel);
    const q = quote(sel);
    scrim.querySelector('#waBtn').href = whatsappActivation({ companyName: p.company_name, demoUrl: p.demo_website_url, sel });
    scrim.querySelector('#waTotal').textContent = RM(q.total);
  };
  scrim.querySelector('.modal-x').addEventListener('click', () => scrim.remove());
  scrim.querySelectorAll('[data-addon]').forEach(el => el.addEventListener('change', () => {
    if (el.dataset.addon === 'email') sel.emailCount = Number(el.value) || 0;
    else sel[el.dataset.addon] = el.checked;
    refresh();
  }));
  refresh();
}

function popupHtml(p, sel) {
  return `<div class="modal modal-wide act-modal" role="dialog" aria-modal="true">
    <div class="act-head">
      <button class="modal-x">${icon('x')}</button>
      <div class="act-badge">${icon('rocket')} Selected Business Launch Promotion</div>
      <h2>Own your website, ${p.company_name}</h2>
      <div class="act-price"><s>${RM(PRICING.websiteValue)}</s><b>${RM(PRICING.activation)}</b><span>one-time activation</span></div>
    </div>
    <div class="act-body">
      <div class="grid g-2" style="gap:24px">
        <div>
          <div class="act-label">Included in activation</div>
          ${['Website ownership activation','1-year hosting','Domain setup','1 business email','Admin dashboard access','Gallery & announcement updates','Basic technical support']
            .map(f => `<div class="act-inc">${icon('check')} ${f}</div>`).join('')}
          <div class="act-renewal">Then just ${RM(PRICING.renewal)}/year — domain, hosting & maintenance.</div>
        </div>
        <div>
          <div class="act-label">Power it up (optional)</div>
          <label class="act-addon"><input type="checkbox" data-addon="chatbot"/>
            <div><b>${PRICING.addons.chatbot.label}</b><span>${PRICING.addons.chatbot.blurb}</span></div><em>${RM(PRICING.addons.chatbot.price)}</em></label>
          <label class="act-addon"><input type="checkbox" data-addon="news"/>
            <div><b>${PRICING.addons.news.label}</b><span>${PRICING.addons.news.blurb}</span></div><em>${RM(PRICING.addons.news.price)}</em></label>
          <label class="act-addon"><span class="act-addon-num"><input class="input" type="number" min="0" value="0" data-addon="email"/></span>
            <div><b>${PRICING.addons.email.label}</b><span>${PRICING.addons.email.blurb}</span></div><em>${RM(PRICING.addons.email.price)}/yr</em></label>
          <div id="pkgSummary"></div>
        </div>
      </div>
    </div>
    <div class="act-foot">
      <div class="act-foot-total">Total today <b id="waTotal">${RM(PRICING.activation)}</b></div>
      <a class="btn btn-wa" id="waBtn" target="_blank" href="#">${icon('whatsapp')} Proceed via WhatsApp</a>
    </div>
  </div>`;
}

function pkgSummary(sel) {
  const q = quote(sel);
  return `<div class="act-sum">
    ${q.lines.map(l => `<div class="between text-sm"><span class="muted">${l.label}</span><span class="mono fw-600">${RM(l.amount)}</span></div>`).join('')}
  </div>`;
}
