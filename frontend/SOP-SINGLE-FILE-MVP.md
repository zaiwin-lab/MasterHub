# SOP — Single-File MVP Build

> Complete protocol for building a production-quality MVP sales page as one `index.html` file.
> Target: 90 minutes from brief to pushed commit.

---

## The 11 Non-Negotiable Sections

Every MVP page must have these, in this order:

```
1.  NAV          — sticky, logo + links + CTA button
2.  HERO         — headline + subhead + CTA + visual
3.  STATS BAR    — 4 social proof numbers
4.  PROBLEM      — 6 pain points in grid (make them nod)
5.  FEATURES     — product modules/benefits (tabs or cards)
6.  HOW IT WORKS — 3 steps (reduce fear)
7.  WHO IT'S FOR — target audience tiles
8.  PRICING      — 3 tiers, middle = popular
9.  FAQ          — 7 objection-killers
10. FINAL CTA    — dark section, repeat the action
11. FOOTER       — logo, links, copyright
```

Optional (add when relevant):
- AI Agents section (for tech products)
- Marketplace teaser (for ecosystem plays)
- Testimonials (when you have real ones)

---

## File Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Brand] — [Tagline] | [Location keyword]</title>
  <meta name="description" content="[One sentence, 150 chars, include CTA]">
  <meta property="og:title" content="[Brand] — [Tagline]">
  <meta property="og:description" content="[Same or variation]">
  <meta property="og:type" content="website">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: { extend: { fontFamily: { sans: ['Inter', 'ui-sans-serif'] } } }
    }
  </script>
  <style>
    /* === PASTE STANDARD CSS BLOCK HERE === */
  </style>
</head>
<body class="bg-white text-gray-900 antialiased">
  <!-- FLOATING WHATSAPP -->
  <!-- NAV -->
  <!-- HERO -->
  <!-- STATS BAR -->
  <!-- PROBLEM -->
  <!-- FEATURES -->
  <!-- HOW IT WORKS -->
  <!-- WHO IT'S FOR -->
  <!-- PRICING -->
  <!-- FAQ -->
  <!-- FINAL CTA -->
  <!-- FOOTER -->
  <script>
    /* === PASTE STANDARD JS BLOCK HERE === */
  </script>
</body>
</html>
```

---

## Standard CSS Block

Copy-paste this into every MVP's `<style>` tag:

```css
html { scroll-behavior: smooth; }
body { font-family: 'Inter', sans-serif; }

/* Hero background */
.hero-bg {
  background: linear-gradient(135deg, #0D0820 0%, #1A0F3C 50%, #0F1B3D 100%);
}

/* Gradient headline text */
.gradient-text {
  background: linear-gradient(135deg, #A78BFA 0%, #60A5FA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Card hover lift */
.card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(124,58,237,0.15); }

/* AI agent glass card */
.agent-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.2s ease;
}
.agent-card:hover { background: rgba(124,58,237,0.2); border-color: rgba(124,58,237,0.5); }

/* Pricing popular card */
.pricing-popular {
  background: linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%);
  transform: scale(1.04);
}

/* FAQ accordion */
.faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
.faq-answer.open { max-height: 400px; }
.faq-chevron { transition: transform 0.3s ease; }
.faq-chevron.rotated { transform: rotate(180deg); }

/* Module tabs */
.module-tab { transition: all 0.2s ease; border-bottom: 3px solid transparent; }
.module-tab.active { color: #7C3AED; border-bottom-color: #7C3AED; }
.module-content { display: none; }
.module-content.active { display: grid; }

/* Floating WhatsApp */
.whatsapp-float {
  position: fixed; bottom: 24px; right: 24px; z-index: 999;
  background: #25D366; border-radius: 50px;
  box-shadow: 0 8px 24px rgba(37,211,102,0.4);
  transition: transform 0.2s ease;
}
.whatsapp-float:hover { transform: scale(1.05); }

/* Float animation (for dashboard mockup) */
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
.float-anim { animation: float 3s ease-in-out infinite; }

/* Shimmer (for live agent status) */
@keyframes shimmer {
  0%{background-position:-200% 0} 100%{background-position:200% 0}
}
.shimmer {
  background: linear-gradient(90deg,
    rgba(255,255,255,0.05) 25%,
    rgba(255,255,255,0.12) 50%,
    rgba(255,255,255,0.05) 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

/* Scroll fade-up */
.fade-up { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
.fade-up.visible { opacity: 1; transform: translateY(0); }

/* Sticky nav scroll state */
.nav-scrolled {
  background: rgba(13,8,32,0.95);
  backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 rgba(255,255,255,0.08);
}

/* Step connector */
.step-connector { width: 2px; height: 48px; background: linear-gradient(to bottom, #7C3AED, transparent); margin: 0 auto; }
```

---

## Standard JS Block

Copy-paste this into every MVP's `<script>` tag:

```javascript
// Navbar scroll state
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('nav-scrolled', window.scrollY > 20);
});

// Mobile menu
document.getElementById('menu-btn').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});
document.querySelectorAll('#mobile-menu a').forEach(a =>
  a.addEventListener('click', () =>
    document.getElementById('mobile-menu').classList.add('hidden')
  )
);

// Module tabs (if used)
const tabs = document.querySelectorAll('.module-tab');
const contents = document.querySelectorAll('.module-content');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const idx = tab.dataset.tab;
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.querySelector(`[data-content="${idx}"]`).classList.add('active');
  });
});

// FAQ accordion
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const chevron = btn.querySelector('.faq-chevron');
    const isOpen = answer.classList.contains('open');
    document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-chevron').forEach(c => c.classList.remove('rotated'));
    if (!isOpen) {
      answer.classList.add('open');
      chevron.classList.add('rotated');
    }
  });
});

// Scroll fade-up observer
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
```

---

## CTA URL Format

All WhatsApp CTAs must use this format:

```html
https://wa.me/[NUMBER]?text=[URL-ENCODED-MESSAGE]

<!-- Example -->
https://wa.me/601128465813?text=Hi%20KBOOST!%20I%20want%20to%20start%20my%20free%20trial.
```

**Rules:**
- No `+` in number (use country code directly: `601128465813` not `+601128465813`)
- Always URL-encode the message text
- Floating button: always visible, always green `#25D366`
- Every section should have at least one CTA

---

## Performance Rules

- No external images — use CSS gradients, SVG inline, or emoji
- Max 2 external CDN calls: Tailwind + Google Fonts
- All JS must be vanilla (no jQuery, no libraries)
- Target page load: under 3 seconds on 4G mobile
- Target file size: 50–100KB (KBOOST = 70KB)

---

## 90-Minute Build Timeline

```
00–10 min   Read client brief. Define: product, audience, pain, CTA goal
10–20 min   Write hero copy: H1, subhead, CTA button text
20–30 min   Write all section copy: problem, features, pricing, FAQ
30–60 min   Build HTML: paste template, fill sections with copy
60–75 min   Style & polish: animations, colours, mobile check
75–85 min   QA: resize to 375px, click all CTAs, check accordion/tabs
85–90 min   Commit, push to branch
```

---

## Naming Convention

```
Repo:    mvp-kb
Folder:  [project-slug]/
File:    index.html
Branch:  claude/[client]-mvp-kickoff-[ID]
```

**Example:**
```
mvp-kb/kboost/index.html
branch: claude/kobe-mvp-kickoff-M45M3
```
