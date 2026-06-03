# frontend — MVP Frontend Engineering

> Battle-tested frontend patterns for Sarawak SME MVP sales pages.
> Built from the KBOOST reference implementation (2026-06-03).

---

## What This Covers

Single-file HTML MVP sales pages. No frameworks. No build tools. Deploy in 60 seconds.

**NOT covered here:** React apps, Next.js, Vue, databases, user auth. Those belong in a separate `sys-[name]` repo when a client needs a full web app.

---

## Decision Tree — What to Build?

```
Client needs a page that:
├── Explains product + converts visitors → SINGLE-FILE MVP ✅ (this repo)
├── Has user login / database         → React/Next.js app (Phase 2)
├── Needs a dashboard / admin panel   → Full web app (Phase 2)
└── Is a landing page / sales page    → SINGLE-FILE MVP ✅ (this repo)
```

**Rule of thumb:** If it can be explained in one scroll, build it as one file.

---

## Skill Files in This Directory

| File | Purpose |
|------|---------|
| `SOP-SINGLE-FILE-MVP.md` | Complete build protocol for MVP sales pages |
| `SOP-DASHBOARD-MOCKUP.md` | CSS-only dashboard hero visual technique |
| `COMPONENT-LIBRARY.md` | Copy-paste HTML sections for every page |

---

## Tech Stack (Locked)

```
index.html          ← everything lives here
├── Tailwind CSS    ← cdn.tailwindcss.com (no build step)
├── Google Fonts    ← Inter, preconnect for speed
├── <style>         ← custom CSS: animations, gradients, glass
└── <script>        ← vanilla JS only: tabs, accordion, scroll
```

**Why this stack:**
- Zero setup time — start writing HTML immediately
- Netlify deploy: drag one file, live in 60 seconds
- No npm, no node_modules, no build errors
- Works on any device, any connection speed
- Fully self-contained — one file = one deliverable

---

## Design System (Standard)

### Colors
```css
/* Hero / dark sections */
hero-bg: linear-gradient(135deg, #0D0820, #1A0F3C, #0F1B3D)

/* Brand primary */
violet-600: #7C3AED
violet-500: #8B5CF6

/* CTA / highlight */
amber-400: #FBBF24

/* Success / WhatsApp */
green: #25D366

/* Text */
white / gray-300 / gray-500
```

### Typography
```css
Font: Inter (Google Fonts)
H1:  font-black (900), 4xl–6xl
H2:  font-black (900), 3xl–4xl
H3:  font-bold (700), xl–2xl
Body: font-normal (400), base–lg
Badge/label: font-semibold (600), xs–sm uppercase tracking-wider
```

### Spacing
```
Section padding: py-20 to py-28
Container: max-w-6xl mx-auto px-4
Card gap: gap-5 to gap-6
Stack gap: space-y-3 to space-y-4
```

---

## Reference Build

**KBOOST** — AI-Powered Revenue Growth System
- File: `mvp-kb/kboost/index.html`
- Branch: `claude/kobe-mvp-kickoff-M45M3`
- Sections: 13 (Nav, Hero+Dashboard, Stats, Problem, Modules×5, Agents, Steps, Pricing×3, Marketplace, FAQ, CTA, Footer)
- Size: ~70KB
- Build time: ~90 min
- WhatsApp: +601128465813
