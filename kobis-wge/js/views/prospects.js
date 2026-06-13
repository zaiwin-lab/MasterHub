// Prospects list + detail. Houses lead scoring, AI generation, link analytics,
// the WhatsApp follow-up SOP, preview expiry, and activation.
import { icon } from '../lib/icons.js';
import * as store from '../lib/store.js';
import { RM, timeAgo, fmtDate, daysUntil, toast } from '../lib/ui.js';
import { openModal, closeModal } from '../lib/modal.js';
import { scoreProspect, band, CATEGORY_LABEL, CATEGORY_TIER, PRESENCE_LABEL, QUALIFY_THRESHOLD } from '../lib/scoring.js';
import { GEN_STEPS } from '../lib/aigen.js';
import { quote, whatsappActivation, whatsappOutreach, FOLLOWUP_CADENCE, PRICING } from '../lib/pricing.js';
import { readImageResized, readPdfText, normalizeUrls } from '../lib/assets.js';

// ============================ LIST =========================================
let listFilter = 'all', listSort = 'score';

export function renderProspects() {
  setTimeout(wireList, 0);
  let rows = [...store.prospects()];
  if (listFilter === 'qualified') rows = rows.filter(p => p.score >= QUALIFY_THRESHOLD);
  else if (listFilter === 'no-preview') rows = rows.filter(p => !p.website_spec);
  else if (listFilter !== 'all') rows = rows.filter(p => p.status === listFilter);
  rows.sort((a, b) => listSort === 'score' ? b.score - a.score : new Date(b.created_at) - new Date(a.created_at));

  return `
  <div class="page-head between wrap">
    <div>
      <span class="eyebrow">${icon('target')} Prospects</span>
      <h1 class="page-title">${store.prospects().length} businesses in the engine</h1>
      <p class="page-sub">Auto-scored on entry. Generate previews for anyone at or above the ${QUALIFY_THRESHOLD}-point qualification line.</p>
    </div>
    <button class="btn btn-primary" id="addBtn">${icon('plus')} Add prospect</button>
  </div>

  <div class="between wrap mb-14" style="margin-bottom:16px;gap:10px">
    <div class="row gap-8 wrap" id="filters">
      ${[['all','All'],['qualified',`Qualified ≥${QUALIFY_THRESHOLD}`],['no-preview','No preview'],['interested','Interested'],['quoted','Quoted']]
        .map(([k,l]) => `<button class="pill ${listFilter===k?'pill-grow':''}" data-filter="${k}">${l}</button>`).join('')}
    </div>
    <div class="row gap-8">
      <span class="text-xs dim">Sort</span>
      <button class="pill ${listSort==='score'?'pill-grow':''}" data-sort="score">Score</button>
      <button class="pill ${listSort==='recent'?'pill-grow':''}" data-sort="recent">Recent</button>
    </div>
  </div>

  <div class="card" style="padding:6px 6px 2px">
    <table class="tbl">
      <thead><tr><th>Business</th><th>Category</th><th>Score</th><th>Status</th><th>Preview</th><th>Opens</th><th></th></tr></thead>
      <tbody>
        ${rows.map(rowHtml).join('') || `<tr><td colspan="7"><div class="empty">${icon('target')}<div>No prospects match.</div></div></td></tr>`}
      </tbody>
    </table>
  </div>`;
}

function rowHtml(p) {
  const b = band(p.score);
  return `<tr data-open="${p.id}" style="cursor:pointer">
    <td><div class="fw-700 hi">${p.company_name}</div><div class="text-xs dim">${p.contact_person} · ${p.city}</div></td>
    <td><span class="pill">${CATEGORY_LABEL[p.business_category]||'—'}</span> <span class="text-xs dim">${CATEGORY_TIER[p.business_category]||''}</span></td>
    <td><div class="row gap-8"><div class="score-ring" style="--val:${p.score};--ring-c:var(--${b.color});width:38px;height:38px"><span style="font-size:12px">${p.score}</span></div><span class="pill pill-${b.color}">${b.label}</span></div></td>
    <td><span class="pill" style="color:${store.statusColor(p.status)}"><span class="dot" style="background:${store.statusColor(p.status)}"></span>${store.statusLabel(p.status)}</span></td>
    <td>${p.website_spec ? `<span class="pill pill-violet">${icon('spark')} ready</span>` : `<span class="text-xs dim">—</span>`}</td>
    <td class="num">${p.analytics?.opens || 0}</td>
    <td>${icon('arrowRight','',)}</td>
  </tr>`;
}

function wireList() {
  document.getElementById('addBtn')?.addEventListener('click', openAddModal);
  document.querySelectorAll('[data-open]').forEach(r => r.addEventListener('click', () => location.hash = '#/admin/prospect/' + r.dataset.open));
  document.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => { listFilter = b.dataset.filter; rerenderList(); }));
  document.querySelectorAll('[data-sort]').forEach(b => b.addEventListener('click', () => { listSort = b.dataset.sort; rerenderList(); }));
}
function rerenderList() { const v = document.getElementById('view'); if (v) { v.innerHTML = renderProspects(); } }

// ============================ ADD MODAL (live scoring) =====================
function openAddModal() {
  const draft = { business_category: 'cafe', followers: 5000, web_presence: 'none', engagement: 'high', affordability: 'likely' };
  // build materials the client/team supplies — fed into generation
  const assets = { logo: '', images: [], pdf: null, references: [] };
  const m = openModal(addModalHtml(draft));
  const refresh = () => {
    const f = m.querySelector('#addForm');
    draft.business_category = f.business_category.value;
    draft.followers = Number(f.followers.value) || 0;
    draft.web_presence = f.web_presence.value;
    draft.engagement = f.engagement.value;
    draft.affordability = f.affordability.value;
    m.querySelector('#scorePreview').innerHTML = scorePreview(draft);
  };
  m.querySelectorAll('select,input[name=followers]').forEach(el => el.addEventListener('input', refresh));

  // ---- asset uploads -----------------------------------------------------
  const note = (sel, msg) => { const el = m.querySelector(sel); if (el) el.textContent = msg; };
  m.querySelector('#logoInput').addEventListener('change', async (e) => {
    const file = e.target.files[0]; if (!file) return;
    note('#logoNote', 'processing…');
    try { assets.logo = await readImageResized(file, 400, 0.9); m.querySelector('#logoPrev').innerHTML = `<img src="${assets.logo}" alt="logo"/>`; note('#logoNote', file.name); }
    catch { note('#logoNote', 'could not read image'); }
  });
  m.querySelector('#photosInput').addEventListener('change', async (e) => {
    const files = [...e.target.files]; if (!files.length) return;
    note('#photosNote', `processing ${files.length}…`);
    for (const file of files) {
      if (assets.images.length >= 10) break;
      try { const d = await readImageResized(file); assets.images.push(d); } catch {}
    }
    m.querySelector('#photosPrev').innerHTML = assets.images.map((d, i) => `<div class="asset-thumb" style="background-image:url('${d}')"><button data-rm="${i}">${icon('x')}</button></div>`).join('');
    note('#photosNote', `${assets.images.length} photo(s) ready`);
    m.querySelectorAll('[data-rm]').forEach(b => b.addEventListener('click', () => { assets.images.splice(Number(b.dataset.rm), 1); m.querySelector('#photosInput').dispatchEvent(new Event('change')); }));
  });
  m.querySelector('#pdfInput').addEventListener('change', async (e) => {
    const file = e.target.files[0]; if (!file) return;
    note('#pdfNote', 'reading PDF…');
    const res = await readPdfText(file);
    assets.pdf = res;
    note('#pdfNote', res.text ? `${res.name} · ${res.pages} pages, text captured` : `${res.name} · stored (text not readable)`);
  });

  m.querySelector('#addForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target).entries());
    fd.followers = Number(fd.followers) || 0;
    assets.references = normalizeUrls(fd.reference_urls);
    delete fd.reference_urls;
    fd.assets = assets;
    const p = store.addProspect(fd);
    closeModal();
    toast(`Added ${p.company_name} · scored ${p.score}/100`, 'grow');
    location.hash = '#/admin/prospect/' + p.id;
  });
  refresh();
}

function addModalHtml(d) {
  return `
  <div class="modal-head"><div class="kpi-icon t-violet">${icon('plus')}</div>
    <div><h3>Add prospect</h3><div class="text-xs dim">Auto-scored live as you type</div></div>
    <button class="modal-x" onclick="this.closest('.modal-scrim').remove()">${icon('x')}</button></div>
  <div class="modal-body">
    <form id="addForm">
      <div class="field"><label>Business name</label><input class="input" name="company_name" required placeholder="e.g. Kopi Tujuh"/></div>
      <div class="field-row">
        <div class="field"><label>Contact person</label><input class="input" name="contact_person" required placeholder="Owner name"/></div>
        <div class="field"><label>City</label><input class="input" name="city" placeholder="e.g. Bangsar"/></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Phone</label><input class="input" name="phone" placeholder="+60..."/></div>
        <div class="field"><label>Email</label><input class="input" type="email" name="email" placeholder="owner@business.com"/></div>
      </div>
      <div class="field"><label>Business description</label><textarea class="input" name="business_description" placeholder="What do they do? Feeds AI generation."></textarea></div>
      <div class="field-row">
        <div class="field"><label>Instagram</label><input class="input" name="instagram_url" placeholder="instagram.com/..."/></div>
        <div class="field"><label>Facebook</label><input class="input" name="facebook_url" placeholder="facebook.com/..."/></div>
      </div>

      <div class="divider"></div>
      <div class="text-xs dim" style="letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px">Build materials <span style="text-transform:none;letter-spacing:0">— the engine builds the site from these</span></div>
      <div class="field-row">
        <div class="field">
          <label>Logo <span class="hint">(image)</span></label>
          <div class="asset-row"><label class="asset-btn">${icon('image')} Choose logo<input id="logoInput" type="file" accept="image/*" hidden/></label><div id="logoPrev" class="asset-logo"></div></div>
          <div id="logoNote" class="hint"></div>
        </div>
        <div class="field">
          <label>Menu / Brochure <span class="hint">(PDF)</span></label>
          <label class="asset-btn">${icon('preview')} Choose PDF<input id="pdfInput" type="file" accept="application/pdf" hidden/></label>
          <div id="pdfNote" class="hint"></div>
        </div>
      </div>
      <div class="field">
        <label>Photos <span class="hint">(used as the real hero & gallery, up to 10)</span></label>
        <label class="asset-btn">${icon('image')} Choose photos<input id="photosInput" type="file" accept="image/*" multiple hidden/></label>
        <div id="photosPrev" class="asset-thumbs"></div>
        <div id="photosNote" class="hint"></div>
      </div>
      <div class="field">
        <label>Example website links <span class="hint">(one per line — design references)</span></label>
        <textarea class="input" name="reference_urls" placeholder="competitor1.com&#10;a-style-you-like.com"></textarea>
      </div>

      <div class="divider"></div>
      <div class="text-xs dim" style="letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px">Lead scoring inputs</div>
      <div class="field-row">
        <div class="field"><label>Category</label><select class="select" name="business_category">
          ${Object.entries(CATEGORY_LABEL).map(([k,v]) => `<option value="${k}" ${k===d.business_category?'selected':''}>${v} · ${CATEGORY_TIER[k]}</option>`).join('')}
        </select></div>
        <div class="field"><label>Followers</label><input class="input" type="number" name="followers" value="${d.followers}" min="0"/></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Web presence</label><select class="select" name="web_presence">
          ${Object.entries(PRESENCE_LABEL).map(([k,v]) => `<option value="${k}" ${k===d.web_presence?'selected':''}>${v}</option>`).join('')}
        </select></div>
        <div class="field"><label>Engagement</label><select class="select" name="engagement">
          ${['high','medium','low'].map(k => `<option value="${k}" ${k===d.engagement?'selected':''}>${k[0].toUpperCase()+k.slice(1)}</option>`).join('')}
        </select></div>
      </div>
      <div class="field"><label>Affordability signal <span class="hint">— can they afford ${RM(PRICING.activation)}?</span></label>
        <select class="select" name="affordability">
          ${[['strong','Strong'],['likely','Likely'],['unsure','Unsure']].map(([k,v]) => `<option value="${k}" ${k===d.affordability?'selected':''}>${v}</option>`).join('')}
        </select></div>
      <div id="scorePreview"></div>
    </form>
  </div>
  <div class="modal-foot">
    <button class="btn btn-ghost" onclick="this.closest('.modal-scrim').remove()">Cancel</button>
    <button class="btn btn-primary" form="addForm" type="submit">${icon('check')} Add & score</button>
  </div>`;
}

function scorePreview(d) {
  const s = scoreProspect(d); const b = band(s.total);
  return `<div class="card" style="background:var(--ink-900);margin-top:6px">
    <div class="between"><div class="row gap-14">
      <div class="score-ring" style="--val:${s.total};--ring-c:var(--${b.color});width:54px;height:54px"><span style="font-size:16px">${s.total}</span></div>
      <div><div class="fw-700 hi">${b.label} lead</div><div class="text-xs dim">${s.total>=QUALIFY_THRESHOLD?'Auto-qualifies for preview generation':'Below '+QUALIFY_THRESHOLD+'-pt line — nurture first'}</div></div>
    </div></div>
    <div class="divider"></div>
    ${s.factors.map(f => `<div class="between text-xs" style="padding:3px 0"><span class="muted">${f.label} <span class="dim">· ${f.note}</span></span><span class="mono fw-600 hi">${f.points}/${f.max}</span></div>`).join('')}
  </div>`;
}

// ============================ DETAIL =======================================
export function renderProspectDetail(id) {
  const p = store.prospectById(id);
  if (!p) return `<div class="empty">${icon('target')}<div>Prospect not found.</div><a class="btn btn-ghost mt-14" href="#/admin/prospects">Back</a></div>`;
  setTimeout(() => wireDetail(p), 0);
  const sc = scoreProspect(p); const b = band(p.score);
  const expiry = p.preview_expires_at ? daysUntil(p.preview_expires_at) : null;
  const isClient = ['activated','renewal'].includes(p.status);

  return `
  <a class="text-sm dim row gap-6" href="#/admin/prospects" style="margin-bottom:16px">${icon('arrowRight')} <span style="transform:rotate(180deg);display:inline-block">${''}</span>← Back to prospects</a>
  <div class="page-head between wrap">
    <div class="row gap-14">
      <div class="score-ring" style="--val:${p.score};--ring-c:var(--${b.color});width:60px;height:60px"><span style="font-size:18px">${p.score}</span></div>
      <div>
        <h1 class="page-title" style="font-size:28px">${p.company_name}</h1>
        <div class="row gap-8 wrap mt-8">
          <span class="pill pill-${b.color}">${b.label}</span>
          <span class="pill">${CATEGORY_LABEL[p.business_category]} · Priority ${CATEGORY_TIER[p.business_category]}</span>
          <span class="pill" style="color:${store.statusColor(p.status)}"><span class="dot" style="background:${store.statusColor(p.status)}"></span>${store.statusLabel(p.status)}</span>
        </div>
      </div>
    </div>
    <div class="row gap-10 wrap">
      ${p.website_spec
        ? `<a class="btn btn-ghost" href="#/preview/${p.demo_slug}" target="_blank">${icon('eye')} Open preview</a>`
        : ''}
      ${isClient
        ? `<a class="btn btn-primary" href="#/client/${store.clients().find(c=>c.prospect_id===p.id)?.id}">${icon('dashboard')} Client dashboard</a>`
        : p.website_spec
          ? `<button class="btn btn-primary" id="activateBtn">${icon('rocket')} Activate</button>`
          : `<button class="btn btn-violet" id="genBtn">${icon('spark')} Generate website</button>`}
    </div>
  </div>

  <div class="grid g-3">
    <div class="stack gap-18 span-2">
      ${p.website_spec ? previewCard(p, expiry) : generatePromptCard(p)}
      ${sopCard(p)}
    </div>
    <div class="stack gap-18">
      ${scoreCard(sc, b)}
      ${profileCard(p)}
    </div>
  </div>`;
}

function generatePromptCard(p) {
  return `<div class="card card-pad-lg" id="genCard">
    <div class="row gap-14"><div class="kpi-icon t-violet" style="width:44px;height:44px">${icon('spark')}</div>
      <div><h3>AI website generation</h3><div class="text-sm dim">Turn ${p.company_name}'s profile into a complete, themed website — instantly.</div></div></div>
    <div class="divider"></div>
    <div class="between wrap gap-10">
      <div class="text-sm muted">Reads category, socials & description → hero, about, services, gallery plan & contact.</div>
      <button class="btn btn-violet" id="genBtn2">${icon('bolt')} Generate now</button>
    </div>
  </div>`;
}

function previewCard(p, expiry) {
  const a = p.analytics || { opens: 0, unique: 0 };
  const previewUrl = `${location.origin}${location.pathname}#/preview/${p.demo_slug}`;
  return `<div class="card card-pad-lg">
    <div class="card-head"><div class="kpi-icon t-grow">${icon('preview')}</div><h3>Website preview</h3>
      ${expiry !== null ? `<span class="pill ${expiry<=5?'pill-rose':'pill-amber'}" style="margin-left:auto">${icon('clock')} ${expiry>0?expiry+' days left':'expired'}</span>` : ''}</div>
    <div class="prev-frame">
      <div class="prev-frame-bar"><span></span><span></span><span></span></div>
      <iframe src="#/preview/${p.demo_slug}" title="preview" loading="lazy"></iframe>
    </div>
    <div class="field mt-14"><label>Shareable preview link</label>
      <div class="row gap-8"><input class="input mono" id="prevLink" readonly value="${previewUrl}"/>
        <button class="btn btn-ghost" id="copyLink">${icon('copy')}</button></div>
    </div>
    <div class="grid g-3 mt-14">
      ${[['Opens', a.opens, 'eye'],['Unique', a.unique, 'users'],['Last open', a.lastOpenedAt?timeAgo(a.lastOpenedAt):'—', 'clock']]
        .map(([l,v,i]) => `<div class="card" style="background:var(--ink-900);padding:14px"><div class="kpi-label">${icon(i)} ${l}</div><div class="kpi-value" style="font-size:22px;margin-top:6px">${v}</div></div>`).join('')}
    </div>
    <div class="row gap-10 mt-14 wrap">
      <a class="btn btn-wa" href="${whatsappOutreach(p, previewUrl)}" target="_blank">${icon('whatsapp')} Send via WhatsApp</a>
      <button class="btn btn-ghost" id="markSent">${icon('send')} Mark as sent</button>
    </div>
  </div>`;
}

function sopCard(p) {
  return `<div class="card card-pad-lg">
    <div class="card-head"><div class="kpi-icon t-sky">${icon('whatsapp')}</div><h3>WhatsApp follow-up SOP</h3>
      <span class="sub">Rec 4 · systematised cadence</span></div>
    ${FOLLOWUP_CADENCE.map((step, i) => `
      <div class="sop-step">
        <div class="sop-day"><div class="d">D${step.day}</div><div class="l">${step.tone}</div></div>
        <div style="flex:1">
          <div class="fw-600 hi text-sm">${step.label}</div>
          <div class="text-xs dim" style="margin-top:4px;font-style:italic">"${step.sample(p)}"</div>
        </div>
        <button class="sop-check" data-sop="${i}">${icon('check')}</button>
      </div>`).join('')}
  </div>`;
}

function scoreCard(sc, b) {
  return `<div class="card">
    <div class="card-head"><div class="kpi-icon t-${b.color}">${icon('chart')}</div><h3>Lead score</h3>
      <span class="pill pill-${b.color}" style="margin-left:auto">${sc.total}/100</span></div>
    ${sc.factors.map(f => `<div style="margin-bottom:12px">
      <div class="between text-xs"><span class="muted">${f.label}</span><span class="mono fw-600 hi">${f.points}/${f.max}</span></div>
      <div class="bar mt-8"><i style="width:${(f.points/f.max)*100}%"></i></div>
      <div class="text-xs dim" style="margin-top:3px">${f.note}</div>
    </div>`).join('')}
  </div>`;
}

function profileCard(p) {
  const rows = [
    ['users', 'Contact', p.contact_person],
    ['phone', 'Phone', p.phone],
    ['mail', 'Email', p.email],
    ['building', 'City', p.city],
    ['eye', 'Web presence', PRESENCE_LABEL[p.web_presence]],
    ['gift', 'Referred by', p.referred_by || '—'],
  ];
  return `<div class="card">
    <div class="card-head"><div class="kpi-icon t-violet">${icon('building')}</div><h3>Profile</h3></div>
    ${rows.map(([i,l,v]) => `<div class="between" style="padding:9px 0;border-bottom:1px solid var(--line-soft)">
      <span class="text-xs dim row gap-8">${icon(i)} ${l}</span><span class="text-sm hi fw-600" style="text-align:right;max-width:60%;overflow:hidden;text-overflow:ellipsis">${v||'—'}</span></div>`).join('')}
    <div class="row gap-8 wrap mt-14">
      ${[['instagram_url','IG'],['facebook_url','FB'],['tiktok_url','TT']].filter(([k])=>p[k]).map(([k,l]) =>
        `<a class="pill" href="https://${p[k]}" target="_blank">${icon('link')} ${l}</a>`).join('')}
    </div>
    ${p.business_description ? `<div class="divider"></div><div class="text-sm muted">${p.business_description}</div>` : ''}
    ${materialsBlock(p.assets)}
  </div>`;
}

function materialsBlock(a) {
  if (!a) return '';
  const bits = [];
  if (a.logo) bits.push(`<span class="pill">${icon('image')} logo</span>`);
  if (a.images?.length) bits.push(`<span class="pill">${icon('image')} ${a.images.length} photos</span>`);
  if (a.pdf?.name) bits.push(`<span class="pill">${icon('preview')} ${a.pdf.name}</span>`);
  if (!bits.length && !a.references?.length) return '';
  return `<div class="divider"></div>
    <div class="text-xs dim" style="letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Build materials</div>
    <div class="row gap-8 wrap">${bits.join('')}</div>
    ${a.references?.length ? `<div class="text-xs dim mt-8">References:</div>${a.references.map(u => `<a class="pill" href="https://${u}" target="_blank" style="margin:3px 3px 0 0">${icon('link')} ${u}</a>`).join('')}` : ''}`;
}

// ---- detail wiring -------------------------------------------------------
function wireDetail(p) {
  const gen = () => runGeneration(p);
  document.getElementById('genBtn')?.addEventListener('click', gen);
  document.getElementById('genBtn2')?.addEventListener('click', gen);
  document.getElementById('activateBtn')?.addEventListener('click', () => openActivateModal(p));
  document.getElementById('copyLink')?.addEventListener('click', () => {
    const inp = document.getElementById('prevLink'); navigator.clipboard?.writeText(inp.value); toast('Preview link copied', 'sky');
  });
  document.getElementById('markSent')?.addEventListener('click', () => { store.setStatus(p.id, 'sent'); toast('Marked as sent'); });
  document.querySelectorAll('[data-sop]').forEach(b => b.addEventListener('click', () => b.classList.toggle('done')));
}

function runGeneration(p) {
  const m = openModal(`
    <div class="modal-body center" style="padding:36px 28px">
      <div class="gen-orb">${icon('spark')}</div>
      <h3 style="margin-top:18px">Generating ${p.company_name}'s website</h3>
      <div class="text-sm dim" style="margin-top:6px">AI is assembling the site from their profile…</div>
      <div id="genSteps" class="gen-steps"></div>
    </div>`);
  const host = m.querySelector('#genSteps');
  let i = 0;
  const tick = () => {
    if (i < GEN_STEPS.length) {
      const done = host.querySelectorAll('.gen-line.done').length;
      host.querySelectorAll('.gen-line').forEach(l => l.classList.add('done'));
      const line = document.createElement('div');
      line.className = 'gen-line';
      line.innerHTML = `<span class="gen-spin">${icon('bolt')}</span> ${GEN_STEPS[i]}`;
      host.appendChild(line);
      i++;
      setTimeout(tick, 360);
    } else {
      host.querySelectorAll('.gen-line').forEach(l => l.classList.add('done'));
      setTimeout(() => {
        store.generateForProspect(p.id);
        closeModal();
        toast('✨ Website generated — preview is live', 'violet');
      }, 450);
    }
  };
  tick();
}

// ---- activation modal (simulated payment → real activation) --------------
function openActivateModal(p) {
  const sel = { chatbot: false, news: false, emailCount: 0 };
  const m = openModal(activateHtml(p, sel), { wide: true });
  const refresh = () => m.querySelector('#actSummary').innerHTML = activateSummary(p, sel);
  m.querySelectorAll('[data-addon]').forEach(el => el.addEventListener('change', () => {
    if (el.dataset.addon === 'email') sel.emailCount = Number(el.value) || 0;
    else sel[el.dataset.addon] = el.checked;
    refresh();
  }));
  // #confirmPay lives inside #actSummary, which is re-rendered by refresh(),
  // so delegate from the modal root (a direct handler would be wiped each refresh).
  m.addEventListener('click', (e) => {
    if (!e.target.closest('#confirmPay')) return;
    const c = store.activateProspect(p.id, sel);
    closeModal();
    toast(`💰 ${p.company_name} activated · ${RM(c.package_price)} confirmed`, 'grow');
    location.hash = '#/client/' + c.id;
  });
  refresh();
}

function activateHtml(p, sel) {
  return `
  <div class="modal-head"><div class="kpi-icon t-grow">${icon('rocket')}</div>
    <div><h3>Activate ${p.company_name}</h3><div class="text-xs dim">Confirm package & record payment</div></div>
    <button class="modal-x" onclick="this.closest('.modal-scrim').remove()">${icon('x')}</button></div>
  <div class="modal-body">
    <div class="grid g-2" style="gap:22px">
      <div>
        <div class="text-xs dim" style="letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px">Add-ons</div>
        <label class="addon-row"><input type="checkbox" data-addon="chatbot"/><div><div class="fw-600 hi">${PRICING.addons.chatbot.label}</div><div class="text-xs dim">${PRICING.addons.chatbot.blurb}</div></div><span class="addon-amt">${RM(PRICING.addons.chatbot.price)}</span></label>
        <label class="addon-row"><input type="checkbox" data-addon="news"/><div><div class="fw-600 hi">${PRICING.addons.news.label}</div><div class="text-xs dim">${PRICING.addons.news.blurb}</div></div><span class="addon-amt">${RM(PRICING.addons.news.price)}</span></label>
        <div class="addon-row"><div><div class="fw-600 hi">${PRICING.addons.email.label}</div><div class="text-xs dim">${PRICING.addons.email.blurb}</div></div>
          <input class="input" style="width:64px" type="number" min="0" value="0" data-addon="email"/></div>
      </div>
      <div id="actSummary"></div>
    </div>
  </div>`;
}

function activateSummary(p, sel) {
  const q = quote(sel);
  return `<div class="card" style="background:var(--ink-900)">
    <div class="text-xs dim" style="letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px">Order summary</div>
    ${q.lines.map(l => `<div class="between text-sm" style="padding:6px 0"><span class="muted">${l.label}</span><span class="mono fw-600 hi">${RM(l.amount)}</span></div>`).join('')}
    <div class="divider"></div>
    <div class="between"><span class="fw-700 hi">Total today</span><span class="kpi-value" style="font-size:26px">${RM(q.total)}</span></div>
    <div class="text-xs dim mt-8">You save ${RM(q.saved)} vs. ${RM(PRICING.websiteValue)} value · then ${RM(PRICING.renewal)}/yr</div>
    ${p.referred_by ? `<div class="pill pill-violet mt-14">${icon('gift')} Referrer "${p.referred_by}" earns ${RM(PRICING.referral.rewardPerActivation)} on confirm</div>` : ''}
    <button class="btn btn-primary btn-block mt-18" id="confirmPay">${icon('check')} Confirm payment & activate</button>
    <div class="text-xs dim center mt-8">Records order · awards referral · provisions dashboard</div>
  </div>`;
}
