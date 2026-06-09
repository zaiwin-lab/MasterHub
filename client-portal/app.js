const answers = {};
let currentStep = 0;

function goStep(n) {
  const prev = document.getElementById(`step-${currentStep}`);
  const next = document.getElementById(`step-${n}`);
  if (!next) return;
  prev.classList.remove('active');
  next.style.animation = 'none';
  next.offsetHeight;
  next.style.animation = '';
  next.classList.add('active');
  currentStep = n;
  updateProgress(n);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress(n) {
  const shell = document.getElementById('progress-shell');
  const bar   = document.getElementById('progress-bar');
  const label = document.getElementById('progress-label');
  if (n >= 1 && n <= 10) {
    shell.classList.add('visible');
    const pct = ((n - 1) / 10) * 100;
    bar.style.width = pct + '%';
    label.textContent = `${n} of 10`;
  } else {
    shell.classList.remove('visible');
  }
}

function selectOption(el, key, value) {
  el.closest('.option-grid').querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  answers[key] = value;
}

function selectRating(el, key, value) {
  el.closest('.rating-row').querySelectorAll('.rating-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  answers[key] = value;
}

function nextStep(stepNum, fieldId) {
  clearErrors();
  const el = document.getElementById(fieldId);
  if (!el) return goStep(stepNum + 1);
  if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
    if (!el.value.trim()) { showError(el, 'Please fill this in before continuing.'); return; }
    answers[fieldId] = el.value.trim();
  } else {
    if (!answers[fieldId]) {
      const hint = el.closest('.q-wrap').querySelector('.q-hint');
      hint.innerHTML = '<span class="error-msg">Please make a selection to continue.</span>';
      return;
    }
  }
  goStep(stepNum + 1);
}

function showError(el, msg) {
  el.classList.add('input-error');
  const err = document.createElement('p');
  err.className = 'error-msg';
  err.textContent = msg;
  el.insertAdjacentElement('afterend', err);
}

function clearErrors() {
  document.querySelectorAll('.input-error').forEach(e => e.classList.remove('input-error'));
  document.querySelectorAll('.error-msg').forEach(e => e.remove());
}

function submitForm() {
  clearErrors();
  const name  = document.getElementById('q10-name').value.trim();
  const email = document.getElementById('q10-email').value.trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let hasErr = false;
  if (!name)  { showError(document.getElementById('q10-name'),  'Please enter your name.'); hasErr = true; }
  if (!email || !emailRe.test(email)) { showError(document.getElementById('q10-email'), 'Please enter a valid email.'); hasErr = true; }
  if (hasErr) return;
  answers.name = name;
  answers.email = email;
  goStep('loading');
  runLoadingSequence(() => { buildReport(); goStep('report'); });
}

function runLoadingSequence(cb) {
  const items = ['li-1','li-2','li-3','li-4','li-5'];
  let i = 0;
  function tick() {
    if (i > 0) { const p = document.getElementById(items[i-1]); p.classList.remove('active'); p.classList.add('done'); }
    if (i < items.length) { document.getElementById(items[i]).classList.add('active'); i++; setTimeout(tick, 800 + Math.random() * 400); }
    else setTimeout(cb, 600);
  }
  tick();
}

function buildReport() {
  const d = answers;
  document.getElementById('report-date').textContent =
    `Generated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · Prepared for ${d.name}`;
  document.getElementById('report-title').textContent = 'Digital Business Diagnostic';

  const growthScore  = calcGrowthScore(d);
  const digitalScore = parseInt(d.q6 || 3);
  const salesScore   = calcSalesScore(d);
  setScore('growth', growthScore);
  setScore('digital', digitalScore);
  setScore('ops', salesScore);

  document.getElementById('report-where').textContent = buildWhere(d);

  const ul = document.getElementById('report-priorities');
  ul.innerHTML = '';
  buildPriorities(d).forEach(p => { const li = document.createElement('li'); li.innerHTML = `<div><strong>${p.title}</strong>${p.body}</div>`; ul.appendChild(li); });

  const wl = document.getElementById('report-wins');
  wl.innerHTML = '';
  buildWins(d).forEach(w => { const li = document.createElement('li'); li.textContent = w; wl.appendChild(li); });

  const rm = document.getElementById('report-roadmap');
  rm.innerHTML = '';
  buildRoadmap(d).forEach(col => {
    const div = document.createElement('div');
    div.className = 'roadmap-col';
    div.innerHTML = `<div class="roadmap-col-title">${col.title}</div><ul>${col.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
    rm.appendChild(div);
  });
}

function setScore(key, val) {
  document.getElementById(`score-${key}-num`).textContent = `${val}/5`;
  document.getElementById(`score-${key}`).style.borderTop = `3px solid ${val >= 4 ? 'var(--green)' : val >= 3 ? 'var(--gold)' : 'var(--red)'}`;
}

function calcGrowthScore(d) {
  const rev = {'Pre-revenue':1,'$1–$5K/mo':2,'$5–$20K/mo':3,'$20–$50K/mo':4,'$50K–$100K/mo':4,'$100K+/mo':5}[d.q2] || 2;
  const chan = {'Word of mouth / referrals':2,'Outbound (email, LinkedIn)':3,'Content / SEO / Inbound':4,'Paid ads':3,'Partnerships / integrations':4,"I'm still figuring this out":1}[d.q4] || 2;
  return Math.min(5, Math.round((rev + chan) / 2));
}

function calcSalesScore(d) {
  return {'Yes, fully documented':5,'Loosely written down':3,'Mostly in my head':2,'No process yet':1}[d.q7] || 2;
}

function buildWhere(d) {
  return `Based on your inputs, you're at the ${d.q2 || 'early stage'} stage with ${(d.q3 || 'growth').toLowerCase()} as your primary constraint. Your business has real potential, but the gap between where you are and where you want to be is likely a systems and positioning problem — not a talent problem. The good news: these are solvable.`;
}

function buildPriorities(d) {
  const map = {
    'Not enough leads': { title: 'Fix your top-of-funnel', body: 'Your acquisition channel is the bottleneck. Double down on one repeatable channel rather than spreading across many.' },
    "Leads don't convert": { title: 'Sharpen your offer and sales process', body: "Conversion issues are almost always a clarity problem — prospects aren't sure what they're buying or why it's worth it." },
    'Clients churn too fast': { title: 'Redesign your onboarding and first 30 days', body: 'Churn is won or lost in the first month. Map the client journey and find where the value promise breaks down.' },
    'Pricing feels wrong': { title: 'Reframe your pricing architecture', body: 'Most consultants undercharge and overbundle. Separate your entry offer, core offer, and premium tier clearly.' },
    "Team/ops can't scale": { title: 'Document and delegate before you hire', body: 'Systematise your delivery before adding headcount. Hire to a process, not a problem.' },
    'No clear positioning': { title: 'Define your sharp positioning statement', body: 'Generalists compete on price. Specialists compete on value. Nail your niche and ICP before any marketing spend.' }
  };
  const primary = map[d.q3] || { title: 'Clarify your core constraint', body: 'Identify the single bottleneck limiting your growth.' };
  const channel = d.q4 === 'Word of mouth / referrals'
    ? { title: 'Build a referral engine', body: 'Referrals are great but fragile. Create a structured ask cadence and referral incentive to make this predictable.' }
    : { title: 'Own one acquisition channel', body: "Pick the channel with the highest signal-to-noise ratio and invest until it's consistent before diversifying." };
  const digital = parseInt(d.q6 || 3) <= 2
    ? { title: 'Upgrade your digital credibility', body: 'Your online presence is actively costing you conversions. A focused redesign will lift close rates.' }
    : { title: 'Leverage your digital presence', body: 'Your digital presence is solid — make sure it works hard with clear CTAs and case studies.' };
  return [primary, channel, digital];
}

function buildWins(d) {
  const wins = [
    'Write a one-sentence positioning statement: "I help [ICP] achieve [outcome] without [obstacle]."',
    'Reach out to your 3 best past clients — ask for a testimonial and one referral.',
    'Review your last 5 proposals: identify the single most common objection and address it upfront.',
  ];
  if (d.q7 === 'Mostly in my head' || d.q7 === 'No process yet')
    wins.push('Write down every step of your current sales process — even rough notes reveal gaps instantly.');
  if (parseInt(d.q6) <= 2)
    wins.push('Add 3 specific client results to your homepage (numbers beat adjectives every time).');
  if (d.q9 === 'Identify revenue leaks')
    wins.push('Audit every touchpoint where a potential client can drop off — usually 3–5 obvious fixes appear immediately.');
  return wins.slice(0, 4);
}

function buildRoadmap(d) {
  return [
    { title: 'Days 1–30', items: ['Lock positioning statement','Audit website vs. ICP','Document sales process','Collect 3 new testimonials'] },
    { title: 'Days 31–60', items: ['Launch one repeatable channel','Create case study template','Build referral ask cadence','Set up simple CRM'] },
    { title: 'Days 61–90', items: ['Review & raise pricing','Create a productised offer','Start content flywheel','Review metrics & iterate'] }
  ];
}
