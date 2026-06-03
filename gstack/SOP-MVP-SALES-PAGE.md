# SOP — MVP Sales Page Build Protocol

> Standard Operating Procedure for building powerful, high-converting MVP sales pages.
> Use this alongside `master-hub + mvp-[client]` in every session.

---

## The Formula

```
Strategy → Copy → Design → Build → QA → Launch → Grow
```

**Output:** Single `index.html` — self-contained, Netlify-deploy in under 60 seconds.

---

## Layer 1: Strategy Foundation

*Before a single word is written.*

| Step | Skill | Action |
|------|-------|--------|
| Product Strategy | `/office-hours` | Clarify offer, audience, goal, differentiation |
| Full Review Pipeline | `/autoplan` | CEO + Design + Eng sanity check on the concept |
| Buyer Persona | `/customer-research` | Who is buying, what pain they have, what triggers action |
| Competitor Map | `/competitor-profiling` | What others say, what gaps you can own |
| Pricing Architecture | `/pricing` | Anchor tiers, perceived value, RM/USD framing |

**Client Brief Checklist:**
- [ ] Product/service name and tagline
- [ ] Target audience (industry, size, location)
- [ ] Top 3 pain points your product solves
- [ ] Unique selling proposition vs competitors
- [ ] Pricing tiers (if any)
- [ ] CTA goal: WhatsApp / Book demo / Sign up / Buy
- [ ] Brand colours (or leave to designer)
- [ ] WhatsApp number / email / domain

---

## Layer 2: Copy & Persuasion

*The words that sell. Written before design.*

| Step | Skill | Action |
|------|-------|--------|
| Hero Copy | `/copywriting` | Headline, subheadline, primary CTA |
| Psychology Layer | `/marketing-psychology` | Urgency, social proof, anchoring, colour psychology |
| Product Positioning | `/product-marketing` | Unique angle, category creation, contrast with alternatives |
| CRO Review | `/cro` | Funnel friction, button copy, trust signals |
| Content Flow | `/content-strategy` | Section order, narrative arc, objection sequence |

**Non-Negotiable Page Sections (in order):**
1. **Hero** — Bold headline + subhead + primary CTA button
2. **Social Proof Bar** — Numbers, logos, or quick stats
3. **Problem** — Agitate the pain (make them nod)
4. **Solution Bridge** — Introduce the product as the answer
5. **Features/Benefits** — 3–6 power benefits (outcomes, not features)
6. **How It Works** — 3-step simplicity (reduces fear)
7. **Who It's For** — Target audience recognition
8. **Pricing** — Clear, anchored, irresistible
9. **FAQ** — Kill top 5–7 objections before they kill the sale
10. **Final CTA** — Last chance, urgency, repeat the action
11. **Footer** — Trust signals, contact, legal

**Power Copy Rules:**
- Headline = outcome, not feature. "More Sales" not "CRM Software"
- Benefits = results, not tools. "Close deals in 60 sec" not "has proposal generator"
- CTA = specific action. "Start Free — RM299/mo" not just "Get Started"
- Social proof = specific numbers. "1,200+ leads" not "many leads"

---

## Layer 3: Design & Build

*HTML-first. No build tools. Netlify-ready in one file.*

| Step | Skill | Action |
|------|-------|--------|
| Visual Mockup | `/design-html` | Generate HTML/CSS layout for sign-off |
| Design Review | `/design-review` | UI polish, hierarchy, mobile spacing |
| Build | — | Single `index.html` with inline CSS + minimal JS |

**Tech Stack (non-negotiable for MVPs):**
```
├── index.html          ← single file, everything inside
├── Tailwind CSS CDN    ← utility classes, no build step
├── Google Fonts CDN    ← Inter or similar, preconnect
├── Inline <style>      ← custom animations, gradients
└── Inline <script>     ← tabs, accordion, scroll FX only
```

**Design Principles:**
- Mobile-first always (60%+ traffic is mobile in Malaysia)
- Dark hero + light body sections = premium, readable
- Primary CTA colour must contrast hard against background
- WhatsApp button = always green, always visible
- Floating WhatsApp button = fixed bottom-right on all pages
- Max 2 font weights visible at once (bold headlines, regular body)
- No external image dependencies — use CSS/SVG/emoji for visuals

**Hero Visual Options (no images needed):**
- CSS dashboard mockup (see KBOOST example)
- CSS phone/device frame with content inside
- Gradient card with stats/numbers
- Animated SVG icons

---

## Layer 4: Quality Gates

*Nothing ships broken or ugly.*

| Check | Skill | What to Verify |
|-------|-------|----------------|
| Browser QA | `/qa` | Chrome desktop + Chrome mobile (375px) |
| Design Polish | `/design-review` | Spacing, hierarchy, colour contrast |
| Code Review | `/review` | Clean HTML, no inline event handlers, no XSS |
| Security | `/cso` | No exposed secrets, safe external links |
| Speed Check | `/browse` | Screenshot proof, no layout breaks |

**QA Checklist:**
- [ ] Page loads under 3 seconds on mobile
- [ ] All CTAs link correctly (WhatsApp URL or form)
- [ ] Mobile menu opens/closes
- [ ] FAQ accordion works
- [ ] Module tabs work
- [ ] No broken images or missing fonts
- [ ] Footer has copyright + contact
- [ ] WhatsApp floating button visible on all sections

---

## Layer 5: Launch

| Step | Skill | Action |
|------|-------|--------|
| Deploy | `/ship` | Push to Netlify via branch or drag-and-drop |
| SEO Baseline | `/seo-audit` | Title, meta, og tags, Core Web Vitals |
| AI SEO | `/ai-seo` | Structure content for LLM discoverability |
| Launch Gate | `/launch` | Full pre-launch checklist |

**Netlify Deploy:**
```
mvp-kb/
└── [project-name]/
    └── index.html
```
Set Netlify publish directory to `[project-name]/`.
Subdomain: `[project-name].netlify.app`

**Essential Meta Tags:**
```html
<title>Brand — Tagline | Location keyword</title>
<meta name="description" content="One sentence, 150 chars, include CTA">
<meta property="og:title" content="Brand — Tagline">
<meta property="og:description" content="Same or variation">
<meta property="og:type" content="website">
```

---

## Layer 6: Post-Launch Growth

| Action | Skill | Timing |
|--------|-------|--------|
| Email sequence | `/emails` | Week 1 — nurture captured leads |
| Ad creative | `/ad-creative` | Week 1 — Facebook/Instagram hooks |
| Social content | `/social` | Week 1-2 — organic posts to drive traffic |
| Analytics | `/analytics` | Ongoing — conversion tracking |
| CRO iteration | `/cro` | Week 3+ — improve based on data |

---

## Repo & Branch Convention

```
mvp-kb/
├── INDEX.md                     ← project registry (keep updated)
├── [project-1]/
│   └── index.html
└── [project-2]/
    └── index.html
```

**Branch naming:** `claude/[client]-mvp-kickoff-[ID]`
**Max projects per repo:** 5

---

## Time Budget (Target)

| Phase | Target Time |
|-------|-------------|
| Strategy + Copy | 20–30 min |
| Design + Build | 45–60 min |
| QA | 10–15 min |
| Deploy | 5 min |
| **Total** | **~90 min per MVP** |

---

## Reference Build

**KBOOST** — AI-Powered Revenue Growth System
- Repo: `mvp-kb/kboost/index.html`
- Branch: `claude/kobe-mvp-kickoff-M45M3`
- Client: KOBIS Berhad
- Date: 2026-06-03
- Sections: Hero, Stats, Problem, 5 Modules (tabs), AI Agents, How It Works, Who It's For, Pricing (3 tiers), Marketplace Teaser, FAQ, Final CTA, Footer
