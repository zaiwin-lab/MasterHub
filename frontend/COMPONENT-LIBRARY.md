# Component Library — Reusable HTML Sections

> Copy-paste ready HTML components for every MVP page section.
> All components use the standard CSS + JS block from SOP-SINGLE-FILE-MVP.md.

---

## 1. Floating WhatsApp Button

Always the first element in `<body>`. Fixed bottom-right on all screens.

```html
<a href="https://wa.me/[NUMBER]?text=[MESSAGE]" target="_blank"
   class="whatsapp-float flex items-center gap-2 px-5 py-3 text-white font-semibold text-sm">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
  WhatsApp Us
</a>
```

---

## 2. Sticky Navigation

```html
<nav id="navbar" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
          <span class="text-white font-black text-sm">[AB]</span>
        </div>
        <span class="text-white font-bold text-xl tracking-tight">[Brand]</span>
      </div>
      <!-- Desktop links -->
      <div class="hidden md:flex items-center gap-8">
        <a href="#features" class="text-gray-300 hover:text-white text-sm font-medium transition-colors">Features</a>
        <a href="#pricing" class="text-gray-300 hover:text-white text-sm font-medium transition-colors">Pricing</a>
        <a href="#faq" class="text-gray-300 hover:text-white text-sm font-medium transition-colors">FAQ</a>
      </div>
      <!-- Desktop CTA -->
      <div class="hidden md:flex items-center gap-3">
        <a href="https://wa.me/[NUMBER]" target="_blank"
           class="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          Get Started
        </a>
      </div>
      <!-- Mobile hamburger -->
      <button id="menu-btn" class="md:hidden text-white p-2">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>
  </div>
  <!-- Mobile menu -->
  <div id="mobile-menu" class="hidden md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 space-y-3">
    <a href="#features" class="block text-gray-300 text-sm py-2">Features</a>
    <a href="#pricing" class="block text-gray-300 text-sm py-2">Pricing</a>
    <a href="#faq" class="block text-gray-300 text-sm py-2">FAQ</a>
    <a href="https://wa.me/[NUMBER]" target="_blank"
       class="block bg-violet-600 text-white text-sm text-center py-3 rounded-lg font-semibold">Get Started</a>
  </div>
</nav>
```

---

## 3. Hero Section

```html
<section class="hero-bg min-h-screen flex items-center pt-16 pb-12 px-4 relative overflow-hidden">
  <!-- Background orbs -->
  <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-700 rounded-full filter blur-3xl opacity-15 pointer-events-none"></div>
  <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-700 rounded-full filter blur-3xl opacity-10 pointer-events-none"></div>

  <div class="max-w-7xl mx-auto w-full">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <!-- Copy -->
      <div>
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 bg-violet-900 bg-opacity-60 border border-violet-700 border-opacity-50 rounded-full px-4 py-2 mb-6">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-violet-400"></span>
          </span>
          <span class="text-violet-300 text-xs font-semibold tracking-wider uppercase">[Category tagline]</span>
        </div>
        <!-- Headline -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
          [Line 1].<br>[Line 2].<br><span class="gradient-text">[Line 3].</span>
        </h1>
        <!-- Subheadline -->
        <p class="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
          [One paragraph. Who it's for. What it does. What they get.]
        </p>
        <!-- CTA buttons -->
        <div class="flex flex-col sm:flex-row gap-3 mb-8">
          <a href="https://wa.me/[NUMBER]" target="_blank"
             class="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-7 py-4 rounded-xl font-bold text-base transition-all hover:scale-105 shadow-lg shadow-violet-900">
            [Primary CTA] — RM[price]/mo
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="https://wa.me/[NUMBER]" target="_blank"
             class="flex items-center justify-center border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-7 py-4 rounded-xl font-semibold text-base transition-all">
            [Secondary CTA]
          </a>
        </div>
        <!-- Trust line -->
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-400">
          <span class="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="#10B981"><path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"/></svg>
            No setup fee
          </span>
          <span class="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="#10B981"><path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"/></svg>
            Cancel anytime
          </span>
          <span class="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="#10B981"><path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"/></svg>
            Built for [Location]
          </span>
        </div>
      </div>
      <!-- Visual: paste dashboard mockup or stats card here -->
      <div class="float-anim">
        <!-- See SOP-DASHBOARD-MOCKUP.md -->
      </div>
    </div>
  </div>
</section>
```

---

## 4. Stats Bar

```html
<section class="bg-violet-900 py-6 px-4">
  <div class="max-w-5xl mx-auto">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      <div><div class="text-white text-3xl font-black">[X]+</div><div class="text-violet-300 text-sm mt-1">[Label]</div></div>
      <div><div class="text-white text-3xl font-black">[X]+</div><div class="text-violet-300 text-sm mt-1">[Label]</div></div>
      <div><div class="text-white text-3xl font-black">[X]×</div><div class="text-violet-300 text-sm mt-1">[Label]</div></div>
      <div><div class="text-white text-3xl font-black">[X]+</div><div class="text-violet-300 text-sm mt-1">[Label]</div></div>
    </div>
  </div>
</section>
```

---

## 5. Problem Grid

```html
<section class="py-24 px-4 bg-gray-50">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-16 fade-up">
      <h2 class="text-3xl sm:text-4xl font-black text-gray-900 mb-4">[Problem headline]</h2>
      <p class="text-gray-500 text-lg">[Empathy subhead]</p>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-up">
      <!-- Repeat this card 6 times -->
      <div class="bg-white rounded-2xl p-6 border border-red-100 shadow-sm">
        <div class="text-3xl mb-3">[emoji]</div>
        <h3 class="font-bold text-gray-900 mb-2">[Short pain title]</h3>
        <p class="text-gray-500 text-sm">[1-2 sentence description of the pain]</p>
      </div>
    </div>
    <!-- Bridge statement -->
    <div class="mt-12 text-center fade-up">
      <div class="inline-block bg-violet-50 border border-violet-200 rounded-2xl px-8 py-6">
        <p class="text-violet-900 text-xl font-bold">[Solution teaser question]</p>
        <p class="text-violet-600 mt-2">[Brand] [short answer].</p>
      </div>
    </div>
  </div>
</section>
```

---

## 6. Pricing — 3 Tiers

```html
<section id="pricing" class="py-24 px-4 bg-gray-50">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-14 fade-up">
      <span class="text-violet-600 font-semibold text-sm uppercase tracking-wider">Simple Pricing</span>
      <h2 class="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-4">[Pricing headline]</h2>
      <p class="text-gray-500 text-lg">[No contracts. No hidden fees. Cancel anytime.]</p>
    </div>
    <div class="grid md:grid-cols-3 gap-6 items-start fade-up">

      <!-- Tier 1: Starter -->
      <div class="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
        <div class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">[Tier Name]</div>
        <div class="text-4xl font-black text-gray-900 mb-1">RM[price]<span class="text-lg font-normal text-gray-400">/mo</span></div>
        <p class="text-gray-500 text-sm mb-6">[Who it's best for]</p>
        <ul class="space-y-3 mb-8">
          <li class="flex items-center gap-2 text-sm text-gray-700">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="#7C3AED"><path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"/></svg>
            [Feature]
          </li>
          <!-- repeat for each feature -->
        </ul>
        <a href="https://wa.me/[NUMBER]" target="_blank"
           class="block text-center border border-violet-600 text-violet-600 hover:bg-violet-50 py-3 rounded-xl font-semibold text-sm transition-colors">Get Started</a>
      </div>

      <!-- Tier 2: Popular (highlighted) -->
      <div class="pricing-popular rounded-2xl p-8 shadow-2xl shadow-violet-900 relative">
        <div class="absolute -top-3 left-1/2 -translate-x-1/2">
          <span class="bg-amber-400 text-gray-900 text-xs font-black px-4 py-1.5 rounded-full">⭐ MOST POPULAR</span>
        </div>
        <div class="text-sm font-semibold text-violet-200 uppercase tracking-wider mb-2">[Tier Name]</div>
        <div class="text-4xl font-black text-white mb-1">RM[price]<span class="text-lg font-normal text-violet-300">/mo</span></div>
        <p class="text-violet-200 text-sm mb-6">[Who it's best for]</p>
        <ul class="space-y-3 mb-8">
          <li class="flex items-center gap-2 text-sm text-violet-100">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="#A78BFA"><path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"/></svg>
            [Feature]
          </li>
        </ul>
        <a href="https://wa.me/[NUMBER]" target="_blank"
           class="block text-center bg-white text-violet-700 hover:bg-gray-100 py-3 rounded-xl font-bold text-sm transition-colors">Get Started</a>
      </div>

      <!-- Tier 3: Elite -->
      <div class="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
        <div class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">[Tier Name]</div>
        <div class="text-4xl font-black text-gray-900 mb-1">RM[price]<span class="text-lg font-normal text-gray-400">/mo</span></div>
        <p class="text-gray-500 text-sm mb-6">[Who it's best for]</p>
        <ul class="space-y-3 mb-8">
          <li class="flex items-center gap-2 text-sm text-gray-700">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="#7C3AED"><path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"/></svg>
            [Feature]
          </li>
        </ul>
        <a href="https://wa.me/[NUMBER]" target="_blank"
           class="block text-center border border-violet-600 text-violet-600 hover:bg-violet-50 py-3 rounded-xl font-semibold text-sm transition-colors">Talk to Us</a>
      </div>

    </div>
    <p class="text-center text-gray-400 text-sm mt-8 fade-up">All plans include a 14-day free trial. No credit card required.</p>
  </div>
</section>
```

---

## 7. FAQ Accordion

```html
<section id="faq" class="py-24 px-4 bg-white">
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-12 fade-up">
      <h2 class="text-3xl font-black text-gray-900 mb-3">Frequently Asked Questions</h2>
      <p class="text-gray-500">Everything you need to know before getting started.</p>
    </div>
    <div class="space-y-3 fade-up">
      <!-- Repeat this block for each question -->
      <div class="faq-item border border-gray-200 rounded-xl overflow-hidden">
        <button class="faq-btn w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
          <span class="font-semibold text-gray-900">[Question]</span>
          <svg class="faq-chevron w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <div class="faq-answer">
          <div class="px-6 pb-5 text-gray-600">[Answer paragraph]</div>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 8. Final CTA Section

```html
<section class="hero-bg py-28 px-4 relative overflow-hidden">
  <div class="absolute top-0 left-1/3 w-80 h-80 bg-violet-700 rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>
  <div class="max-w-3xl mx-auto text-center relative fade-up">
    <h2 class="text-4xl sm:text-5xl font-black text-white mb-4">[Final headline]</h2>
    <p class="text-gray-300 text-xl mb-10">[One line of encouragement]</p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="https://wa.me/[NUMBER]" target="_blank"
         class="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105">
        [Primary CTA]
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
      <a href="https://wa.me/[NUMBER]" target="_blank"
         class="flex items-center justify-center gap-2 bg-white bg-opacity-10 border border-white border-opacity-20 text-white px-8 py-4 rounded-xl font-semibold transition-all">
        WhatsApp Us
      </a>
    </div>
    <p class="mt-6 text-gray-500 text-sm">14-day free trial · No credit card · Cancel anytime</p>
  </div>
</section>
```

---

## 9. Footer

```html
<footer class="bg-gray-950 py-12 px-4">
  <div class="max-w-6xl mx-auto">
    <div class="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
      <div>
        <div class="flex items-center gap-2 mb-3">
          <div class="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <span class="text-white font-black text-sm">[AB]</span>
          </div>
          <span class="text-white font-bold text-xl">[Brand]</span>
        </div>
        <p class="text-gray-500 text-sm max-w-xs">[One line tagline]</p>
        <p class="text-gray-600 text-xs mt-3">Powered by [Company] · [City], Sarawak</p>
      </div>
      <div class="grid grid-cols-2 gap-8">
        <div>
          <div class="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-3">Platform</div>
          <ul class="space-y-2">
            <li><a href="#features" class="text-gray-500 hover:text-gray-300 text-sm transition-colors">Features</a></li>
            <li><a href="#pricing" class="text-gray-500 hover:text-gray-300 text-sm transition-colors">Pricing</a></li>
            <li><a href="#faq" class="text-gray-500 hover:text-gray-300 text-sm transition-colors">FAQ</a></li>
          </ul>
        </div>
        <div>
          <div class="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-3">Contact</div>
          <ul class="space-y-2">
            <li><a href="https://wa.me/[NUMBER]" target="_blank" class="text-gray-500 hover:text-gray-300 text-sm">WhatsApp</a></li>
            <li><a href="mailto:[email]" class="text-gray-500 hover:text-gray-300 text-sm">[email]</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
      <p class="text-gray-600 text-xs">© [year] [Brand] by [Company]. All rights reserved.</p>
      <p class="text-gray-700 text-xs">Built for Sarawak. Powered by AI.</p>
    </div>
  </div>
</footer>
```

---

## Checklist Before Every Commit

```
[ ] Replace ALL [PLACEHOLDERS] with real content
[ ] Replace [NUMBER] with actual WhatsApp number (no + sign)
[ ] Mobile test: resize browser to 375px width
[ ] Click every CTA button — check wa.me URL opens
[ ] Click every FAQ question — check accordion opens/closes
[ ] Click every module tab — check content switches
[ ] Scroll full page — check fade-up animations fire
[ ] Check mobile menu: opens on tap, closes on link click
[ ] Check floating WhatsApp button visible on all sections
[ ] Footer: copyright year correct
```
