// Live website PREVIEW (Module B) built to the KOBIS Berhad "Standard Client
// Website" master template: dual KOBIS ticker bars, 4-language switcher
// (EN/BM/中/IB), Google Maps embed, and the signature footer + KOBIS credit
// bar. Plus the SaaS layer: activation popup (Module C) → WhatsApp (D),
// preview-open analytics (Rec 3) and expiry (Rec 2). No login required.
import { icon } from '../lib/icons.js';
import * as store from '../lib/store.js';
import { RM, daysUntil, esc } from '../lib/ui.js';
import { quote, whatsappActivation, billplzPayment, PRICING } from '../lib/pricing.js';

// Record each preview open at most once per app session (a store mutation
// re-renders the active view, so without this guard recordOpen would loop).
const recorded = new Set();
let curLang = 'en';
let curSlug = null;
let promoTimer = null;

// ---- 4-language chrome dictionary (business copy stays as generated) -------
// NOTE: Iban (ib) strings are an auto-draft — have a native speaker review per
// client. Ticker stays in English by design (see master spec).
const T = {
  en: { about:'About', gallery:'Gallery', contact:'Contact', whatWeOffer:'What we offer', aLookInside:'A look inside', getInTouch:'Get in touch', findUs:'Find us', followUs:'Follow us', allRights:'All rights reserved', activate:'Activate Website Ownership' },
  bm: { about:'Tentang', gallery:'Galeri', contact:'Hubungi', whatWeOffer:'Apa yang kami tawarkan', aLookInside:'Lihat lebih dekat', getInTouch:'Hubungi kami', findUs:'Cari kami', followUs:'Ikuti kami', allRights:'Hak cipta terpelihara', activate:'Aktifkan Pemilikan Laman Web' },
  zh: { about:'关于', gallery:'图库', contact:'联系', whatWeOffer:'我们的服务', aLookInside:'走进我们', getInTouch:'联系我们', findUs:'找到我们', followUs:'关注我们', allRights:'版权所有', activate:'激活网站所有权' },
  ib: { about:'Pasal Kami', gallery:'Galeri', contact:'Kontak', whatWeOffer:'Utai ti kami tawarka', aLookInside:'Peda ba dalam', getInTouch:'Kontak kami', findUs:'Giga kami', followUs:'Titih kami', allRights:'Semua hak ditagang', activate:'Aktifka Empu Laman Web' },
};
const LANGS = [['en','EN'],['bm','BM'],['zh','中'],['ib','IB']];

// ---- industry ticker icon (inline SVG, 14px, currentColor) ----------------
const TICKER_ICONS = {
  food: '<path d="M3 2v7a3 3 0 0 0 6 0V2M6 9v13M17 2c-2 0-3 2-3 5s1 5 3 5 3-2 3-5-1-5-3-5Zm0 10v10"/>',
  star: '<path d="M12 2l2.6 6.6L21 9.3l-5 4.3 1.6 6.4L12 16.9 6.4 20l1.6-6.4-5-4.3 6.4-.7Z"/>',
  seedling: '<path d="M12 22V12M12 12C12 8 9 6 4 6c0 4 3 6 8 6Zm0-2c0-3 3-5 8-5 0 3-3 5-8 5Z"/>',
  snowflake: '<path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19"/>',
  bolt: '<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/>',
  wrench: '<path d="M14 6a4 4 0 0 1 5 5l-9 9-4-4 9-9a4 4 0 0 1-1-1Z"/>',
  gear: '<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm9 4-2 .5.5 2-2 1-1.5-1.5L14 16l.5 2-2 .5-1-2-2 .5-.5-2L6 16l-1.5 1.5-2-1 .5-2L1 12l2-.5-.5-2 2-1L6 10l2-1.5L7.5 6l2-.5 1 2 2-.5.5 2L16 8l1.5-1.5 2 1-.5 2Z"/>',
};
function tickerIconFor(cat) {
  const map = { cafe:'food', restaurant:'food', catering:'food', 'food-brand':'food', 'home-food':'food',
    influencer:'star', creator:'star', 'personal-brand':'star', trainer:'star', coach:'star', consultant:'star',
    contractor:'wrench', aircond:'snowflake', electrical:'bolt', plumbing:'wrench', landscaping:'seedling' };
  return TICKER_ICONS[map[cat] || 'gear'];
}
function tickerSvg(cat) {
  return `<svg class="ticker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${tickerIconFor(cat)}</svg>`;
}
function tickerTrack(cat) {
  const unit = `<span class="ticker-item">${tickerSvg(cat)} This website is built by KOBIS Berhad</span>`;
  return `<div class="ticker-track">${unit.repeat(8)}</div>`;
}

export function renderPreview(slug) {
  if (promoTimer) { clearInterval(promoTimer); promoTimer = null; }
  const p = store.prospectBySlug(slug);
  if (!p || (!p.website_spec && !p.manual_html)) {
    // Not in memory — fetch just this one record by slug (scale: avoids loading
    // the whole database), then re-render once it arrives.
    if (!recorded.has('fetch:' + slug)) {
      recorded.add('fetch:' + slug);
      store.fetchProspectBySlug(slug).then(found => {
        if (found && found.website_spec) {
          const host = document.querySelector('.main');
          if (host) host.innerHTML = renderPreview(slug);
        }
      });
    }
    return `<div class="empty" style="min-height:100vh;display:grid;place-content:center">
      ${icon('preview')}<div>Loading preview…</div>
      <a class="btn btn-ghost mt-14" href="#/">Back to KOBIS</a></div>`;
  }
  curSlug = slug;
  if (!window.frameElement && !recorded.has(slug)) {
    recorded.add(slug);
    setTimeout(() => store.recordOpen(slug), 600);
  }

  // Manual-upload path (Path 2): serve the contributor's full site in a
  // sandboxed frame, still wrapped in KOBIS preview branding + activation.
  if (p.manual_html) { setTimeout(() => { wire(p); startPromoTimer(); }, 0); return manualSiteHtml(p); }

  const s = p.website_spec, t = s.theme, tr = T[curLang] || T.en, cat = s.meta.category;
  const expiry = p.preview_expires_at ? daysUntil(p.preview_expires_at) : null;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(s.mapQuery || (s.meta.name + ', Malaysia'))}&output=embed`;
  setTimeout(() => { wire(p); startPromoTimer(); }, 0);

  return `
  <div class="site" style="--site-bg:${t.bg};--site-accent:${t.accent};--site-tint:${t.tint};--site-font:${t.font === 'serif' ? 'Georgia, \'Times New Roman\', serif' : '\'Sora\', sans-serif'}">

    <!-- TEMP: KOBIS Berhad placeholder credit ticker — replace wording with client's chosen text once payment is received, then remove KOBIS branding ticker -->
    <div class="ticker-bar ticker-top">${tickerTrack(cat)}</div>

    <div class="site-marker">${icon('shield')} Professional Website Preview Prepared by <b>KOBIS Berhad</b>
      ${expiry !== null ? `<span class="site-marker-exp">· preview ${expiry > 0 ? 'expires in ' + expiry + ' days' : 'expired'}</span>` : ''}
      <button class="site-marker-cta" data-activate>${tr.activate}</button>
    </div>

    ${promoBar(p)}

    <header class="site-nav">
      <div class="site-logo">${s.meta.logo ? `<img class="site-logo-img" src="${esc(s.meta.logo)}" alt="${esc(s.meta.name)}"/>` : ''}<span>${esc(s.meta.name)}</span></div>
      <nav class="site-links">
        <a href="#site-about">${tr.about}</a><a href="#site-services">${esc(s.servicesSection.name)}</a>
        <a href="#site-gallery">${tr.gallery}</a><a href="#site-contact">${tr.contact}</a>
      </nav>
      <div class="lang-switch">${LANGS.map(([k, l]) => `<button class="${curLang === k ? 'on' : ''}" data-lang="${k}">${l}</button>`).join('')}</div>
      <a class="site-wa" href="#site-contact">${icon('whatsapp')} WhatsApp</a>
    </header>

    <section class="site-hero">
      <div class="site-hero-inner">
        <div class="site-eyebrow">${esc(s.hero.eyebrow)}</div>
        <h1 class="site-h1">${esc(s.hero.headline)}</h1>
        <p class="site-sub">${esc(s.hero.sub)}</p>
        <div class="site-hero-cta">
          <a class="site-btn-primary" href="#site-contact">${esc(s.hero.primaryCta)}</a>
          <a class="site-btn-ghost" href="#site-services">${esc(s.hero.secondaryCta)}</a>
        </div>
        <div class="site-stats">${s.about.stats.map(st => `<div><b>${esc(st.k)}</b><span>${esc(st.v)}</span></div>`).join('')}</div>
      </div>
      <div class="site-hero-art">${s.hero.image ? `<div class="site-hero-photo" style="background-image:url('${esc(s.hero.image)}')"></div>` : '<div class="site-hero-blob"></div>'}</div>
    </section>

    <section class="site-section" id="site-about">
      <div class="site-2col">
        <div><div class="site-tag">${tr.about}</div><h2 class="site-h2">${esc(s.about.title)}</h2></div>
        <p class="site-body">${esc(s.about.body)}</p>
      </div>
    </section>

    <section class="site-section site-alt" id="site-services">
      <div class="site-tag center-tag">${esc(s.servicesSection.name)}</div>
      <h2 class="site-h2 center">${tr.whatWeOffer}</h2>
      <div class="site-grid">
        ${s.servicesSection.items.map(it => `<div class="site-card">
          <div class="site-card-top"><h3>${esc(it.title)}</h3>${it.price ? `<span class="site-price">${esc(it.price)}</span>` : ''}</div>
          <p>${esc(it.blurb)}</p></div>`).join('')}
      </div>
    </section>

    <section class="site-section" id="site-gallery">
      <div class="site-tag center-tag">${tr.gallery}</div>
      <h2 class="site-h2 center">${tr.aLookInside}</h2>
      <div class="site-gallery">
        ${(s.gallery.images && s.gallery.images.length)
          ? s.gallery.images.map(src => `<div class="site-shot site-shot-photo" style="background-image:url('${esc(src)}')"></div>`).join('')
          : s.gallery.plan.map((g, i) => `<div class="site-shot site-shot-${i % 3}"><span>${esc(g)}</span></div>`).join('')}
      </div>
    </section>

    ${newsSection(p)}

    <!-- TEMP: KOBIS Berhad placeholder credit ticker — replace wording with client's chosen text once payment is received, then remove KOBIS branding ticker -->
    <div class="ticker-bar ticker-mid">${tickerTrack(cat)}</div>

    <section class="site-section site-alt" id="site-contact">
      <div class="site-contact">
        <div>
          <div class="site-tag">${tr.getInTouch}</div>
          <h2 class="site-h2">${esc(s.hero.primaryCta)}</h2>
          <p class="site-body">We'd love to hear from you. Reach out and we'll respond fast.</p>
          <div class="site-contact-lines">
            ${s.contact.lines.map(l => `<div class="site-contact-line">${icon(l.icon)} ${esc(l.label)}</div>`).join('')}
          </div>
          <a class="site-btn-wa" href="#" data-activate>${icon('whatsapp')} ${esc(s.hero.primaryCta)} on WhatsApp</a>
        </div>
        <div class="site-contact-card">
          <div class="site-tag" style="margin-bottom:10px">${tr.findUs}</div>
          <div class="map-embed">
            <iframe src="${mapSrc}" width="100%" height="240" style="border:0" loading="lazy"
              referrerpolicy="no-referrer-when-downgrade" title="${esc(s.meta.name)} map"></iframe>
          </div>
          <div class="site-socials"><span class="dim-label">${tr.followUs}:</span>
            ${s.contact.socials.map(so => `<span>${esc(so.k)}</span>`).join('') || '<span>—</span>'}
          </div>
        </div>
      </div>
    </section>

    <!-- Signature KOBIS footer: brand block + tagline + copyright + credit bar -->
    <footer class="site-foot-wrap">
      <div class="site-foot-main">
        <div class="footer-brand">
          <div class="footer-mark">${s.meta.logo ? `<img src="${esc(s.meta.logo)}" alt="${esc(s.meta.name)}"/>` : esc((s.meta.name || '?')[0])}</div>
          <div>
            <div class="footer-name">${esc(s.meta.name)}</div>
            <div class="footer-tagline">${esc(s.tagline || s.meta.catLabel)}</div>
          </div>
        </div>
        <nav class="footer-links">
          <a href="#site-about">${tr.about}</a><a href="#site-services">${esc(s.servicesSection.name)}</a>
          <a href="#site-gallery">${tr.gallery}</a><a href="#site-contact">${tr.contact}</a>
        </nav>
      </div>
      <div class="footer-copy"><p>© ${new Date().getFullYear()} ${esc(s.meta.name)}. ${tr.allRights}.</p></div>
      <div class="kobis-bar">
        This Digital Experience is Part of the
        <a class="kobis-link" href="https://www.kobisberhad.com" target="_blank" rel="noopener">KOBIS Berhad</a>
        Innovation Ecosystem
      </div>
    </footer>

    <button class="site-float" data-activate>${icon('rocket')} ${tr.activate}</button>
  </div>`;
}

// ---- promo module (running offer + live countdown) -----------------------
function activePromo(p) {
  const client = store.clientByProspect(p.id);
  if (client?.promo?.enabled && client.promo.headline) return { ...client.promo, kind: 'client' };
  // default for not-yet-clients: the 50%-off launch activation promo (Phase 3)
  return { kind: 'activation', headline: '50% OFF Launch Promo — own this website', sub: 'RM1,000 value · activate now for RM500', endsAt: p.preview_expires_at || '' };
}
function promoBar(p) {
  const promo = activePromo(p);
  return `<div class="promo-bar">
    <div class="promo-bar-in">
      <div class="promo-txt"><b>${esc(promo.headline)}</b>${promo.sub ? `<span>${esc(promo.sub)}</span>` : ''}</div>
      ${promo.endsAt ? `<div class="promo-count" id="promoCount" data-ends="${esc(promo.endsAt)}">…</div>` : ''}
      <button class="promo-cta" data-activate>${activatePromoLabel(promo)}</button>
    </div>
  </div>`;
}
function activatePromoLabel(promo) { return promo.kind === 'activation' ? (T[curLang] || T.en).activate : 'Learn more'; }

function startPromoTimer() {
  const el = document.getElementById('promoCount');
  if (!el) return;
  const ends = new Date(el.dataset.ends).getTime();
  const tick = () => {
    const d = ends - Date.now();
    if (isNaN(ends)) { el.textContent = ''; return; }
    if (d <= 0) { el.textContent = 'Ended'; clearInterval(promoTimer); promoTimer = null; return; }
    const days = Math.floor(d / 864e5), h = Math.floor(d % 864e5 / 36e5), m = Math.floor(d % 36e5 / 6e4), s = Math.floor(d % 6e4 / 1e3);
    el.textContent = (days ? days + 'd ' : '') + String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  };
  tick();
  promoTimer = setInterval(tick, 1000);
}

// ---- news / blog section (from the activated client's posts) --------------
function newsSection(p) {
  const client = store.clientByProspect(p.id);
  const posts = client?.news || [];
  if (!posts.length) return '';
  return `<section class="site-section" id="site-news">
    <div class="site-tag center-tag">News</div>
    <h2 class="site-h2 center">Latest updates</h2>
    <div class="site-news">
      ${posts.slice(0, 6).map(n => `<article class="site-news-card">
        <h3>${esc(n.title)}</h3>
        <div class="site-news-date">${new Date(n.created_at).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        <p>${esc((n.body || '').slice(0, 220))}${(n.body || '').length > 220 ? '…' : ''}</p>
      </article>`).join('')}
    </div>
  </section>`;
}

// ---- manual-upload site (Path 2) -----------------------------------------
function manualSiteHtml(p) {
  const tr = T[curLang] || T.en, cat = p.business_category;
  const expiry = p.preview_expires_at ? daysUntil(p.preview_expires_at) : null;
  return `
  <div class="site manual-site" style="--site-bg:#0d1116;--site-accent:#00e5a0;--site-tint:#f4f7ff;--site-font:'Sora',sans-serif">
    <!-- TEMP: KOBIS Berhad placeholder credit ticker — replace once payment received -->
    <div class="ticker-bar ticker-top">${tickerTrack(cat)}</div>
    <div class="site-marker">${icon('shield')} Professional Website Preview Prepared by <b>KOBIS Berhad</b>
      ${expiry !== null ? `<span class="site-marker-exp">· preview ${expiry > 0 ? 'expires in ' + expiry + ' days' : 'expired'}</span>` : ''}
      <button class="site-marker-cta" data-activate>${tr.activate}</button>
    </div>
    ${promoBar(p)}
    <iframe class="manual-frame" sandbox="allow-scripts allow-forms allow-popups" srcdoc="${esc(p.manual_html)}" title="${esc(p.company_name)} website"></iframe>
    <button class="site-float" data-activate>${icon('rocket')} ${tr.activate}</button>
  </div>`;
}

// ---- interaction ---------------------------------------------------------
function wire(p) {
  document.querySelectorAll('[data-activate]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); openActivation(p); }));
  document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => {
    curLang = b.dataset.lang;
    const host = document.querySelector('.main');
    if (host) { host.innerHTML = renderPreview(curSlug); }
  }));
}

// ---- activation popup (Module C → D) -------------------------------------
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
    const payUrl = billplzPayment({ total: q.total, companyName: p.company_name, email: p.email });
    const payBtn = scrim.querySelector('#payBtn');
    if (payUrl) { payBtn.href = payUrl; payBtn.style.display = ''; }
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
          <label class="act-addon"><input type="checkbox" data-addon="ecommerce"/>
            <div><b>${PRICING.addons.ecommerce.label}</b><span>${PRICING.addons.ecommerce.blurb}</span></div><em>${RM(PRICING.addons.ecommerce.price)}</em></label>
          <label class="act-addon"><span class="act-addon-num"><input class="input" type="number" min="0" value="0" data-addon="email"/></span>
            <div><b>${PRICING.addons.email.label}</b><span>${PRICING.addons.email.blurb}</span></div><em>${RM(PRICING.addons.email.price)}/yr</em></label>
          <div id="pkgSummary"></div>
        </div>
      </div>
    </div>
    <div class="act-foot">
      <div class="act-foot-total">Total today <b id="waTotal">${RM(PRICING.activation)}</b></div>
      <div class="row gap-10">
        <a class="btn btn-primary" id="payBtn" target="_blank" href="#" style="display:none">${icon('money')} Pay online</a>
        <a class="btn btn-wa" id="waBtn" target="_blank" href="#">${icon('whatsapp')} Proceed via WhatsApp</a>
      </div>
    </div>
  </div>`;
}

function pkgSummary(sel) {
  const q = quote(sel);
  return `<div class="act-sum">
    ${q.lines.map(l => `<div class="between text-sm"><span class="muted">${l.label}</span><span class="mono fw-600">${RM(l.amount)}</span></div>`).join('')}
  </div>`;
}
