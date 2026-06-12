// Headless smoke test: boots the app under jsdom, visits every route, and
// drives the core flows (add → generate → activate → referral → redeem).
import { JSDOM } from 'jsdom';

const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="app"></div></body></html>`, {
  url: 'http://localhost:8099/index.html',
  pretendToBeVisual: true,
  runScripts: 'outside-only',
});
const { window } = dom;
// expose browser globals for the ES modules
for (const k of ['document','location','localStorage','history','FormData','HTMLElement','Node','getComputedStyle','requestAnimationFrame','Event']) {
  try { globalThis[k] = window[k]; } catch {}
}
try { Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true }); } catch {}
globalThis.window = window;
window.setTimeout = globalThis.setTimeout; // use real async timers
globalThis.prompt = () => 'https://example.com/photo.jpg';
window.scrollTo = () => {};
if (!window.navigator.clipboard) Object.defineProperty(window.navigator, 'clipboard', { value: { writeText: () => Promise.resolve() } });

let errors = [];
function fail(ctx, e) { errors.push(`[${ctx}] ${e.message}`); }
window.addEventListener('error', (e) => fail('window', e.error || new Error(e.message)));

const app = window.document.getElementById('app');
const nav = async (hash) => { window.location.hash = hash; window.dispatchEvent(new window.Event('hashchange')); await tick(); };
const tick = () => new Promise(r => globalThis.setTimeout(r, 5));
const has = (sel) => !!app.querySelector(sel);
const txt = () => app.textContent.length;

const results = [];
function check(name, cond, extra='') { results.push([cond ? 'PASS' : 'FAIL', name, extra]); if (!cond) errors.push('CHECK FAIL: ' + name); }

try {
  const store = await import('./js/lib/store.js');
  await import('./js/app.js'); // boots + renders default route
  await tick();

  // Landing
  await nav('#/');
  check('Landing renders', txt() > 1000 && app.textContent.includes('Build First'));
  check('Waitlist form present', has('#wlForm'));

  // Admin dashboard
  await nav('#/admin');
  check('Dashboard renders', has('.shell') && app.textContent.includes('Command Center'));
  check('KPIs present', app.querySelectorAll('.kpi').length >= 4);

  // Pipeline
  await nav('#/admin/pipeline');
  check('Pipeline kanban', app.querySelectorAll('.pipe-col').length === store.STATUSES.length);
  check('Lead cards render', app.querySelectorAll('.lead-card').length > 0);

  // Prospects list
  await nav('#/admin/prospects');
  check('Prospects table', app.querySelectorAll('.tbl tbody tr').length > 5);

  // Prospect detail (pick one with a preview + one without)
  const withPrev = store.prospects().find(p => p.website_spec);
  const noPrev = store.prospects().find(p => !p.website_spec);
  await nav('#/admin/prospect/' + withPrev.id);
  check('Detail (with preview) renders', app.textContent.includes(withPrev.company_name));
  check('Score breakdown present', has('.score-ring'));
  check('SOP cadence present', app.querySelectorAll('[data-sop]').length === 3);
  check('Preview iframe present', has('.prev-frame iframe'));

  await nav('#/admin/prospect/' + noPrev.id);
  check('Detail (no preview) shows generate', has('#genBtn') || has('#genBtn2'));

  // Generate a website (automation) — call store directly (modal uses timers)
  const beforeSpec = !!noPrev.website_spec;
  store.generateForProspect(noPrev.id);
  await tick();
  check('AI generation attaches spec', !beforeSpec && !!store.prospectById(noPrev.id).website_spec);

  // Preview page (public themed site)
  const slug = store.prospectById(noPrev.id).demo_slug;
  await nav('#/preview/' + slug);
  check('Preview site renders', has('.site') && has('.site-marker'));
  check('Activation CTA present', app.querySelectorAll('[data-activate]').length > 0);

  // Add prospect via store
  const np = store.addProspect({ company_name: 'Test Cafe', contact_person: 'Tester', business_category: 'cafe', followers: 15000, web_presence: 'none', engagement: 'high', affordability: 'strong' });
  check('Add prospect scores it', np.score > 0 && np.score <= 100, 'score=' + np.score);

  // Activate (creates client, order, wallet)
  store.generateForProspect(np.id);
  const clientsBefore = store.clients().length;
  const c = store.activateProspect(np.id, { chatbot: true, news: true, emailCount: 1 });
  check('Activation creates client', store.clients().length === clientsBefore + 1);
  check('Order total correct (500+200+100+50)', (store.orders().find(o=>o.client_id===c.id).total_amount) === 850, 'total=' + store.orders().find(o=>o.client_id===c.id).total_amount);

  // Client portal
  await nav('#/client/' + c.id);
  check('Client portal renders', app.textContent.includes('Refer & earn') && has('#refLink'));

  // Clients ledger (admin)
  await nav('#/admin/clients');
  check('Clients ledger renders', app.textContent.includes('activated') || app.querySelectorAll('.tbl tbody tr').length > 0);

  // Referrals
  await nav('#/admin/referrals');
  check('Referrals view renders', app.textContent.includes('Credit wallets'));

  // Waitlist
  await nav('#/admin/waitlist');
  check('Waitlist renders', app.textContent.includes('Controlled onboarding'));

  // RBAC: switch to sales, financials should be blocked
  store.setRole('sales');
  await nav('#/admin/clients');
  check('RBAC blocks sales from financials', app.textContent.includes('Restricted'));
  store.setRole('admin');

  // Referral auto-credit: a referred prospect activating credits the referrer
  const referrer = store.clients()[store.clients().length-1]; // the just-made client has a referral_code
  const referred = store.addProspect({ company_name: 'Referred Biz', contact_person: 'R', business_category: 'cafe', followers: 9000, web_presence: 'none', engagement: 'high', affordability: 'likely', referred_by: referrer.referral_code });
  store.generateForProspect(referred.id);
  const wBefore = store.walletForClient(referrer.id).credit_balance;
  store.activateProspect(referred.id, {});
  const wAfter = store.walletForClient(referrer.id).credit_balance;
  check('Referral auto-credits referrer +50', wAfter === wBefore + 50, `${wBefore}->${wAfter}`);

} catch (e) {
  errors.push('FATAL: ' + e.stack);
}

console.log('\n=== SMOKE RESULTS ===');
for (const [s, n, x] of results) console.log(`${s === 'PASS' ? '✅' : '❌'} ${n}${x ? '  (' + x + ')' : ''}`);
console.log(`\n${results.filter(r=>r[0]==='PASS').length}/${results.length} checks passed`);
if (errors.length) { console.log('\n--- ERRORS ---'); errors.forEach(e => console.log('• ' + e)); process.exit(1); }
console.log('\nAll green. 🎉');
