# KOBIS Berhad — "Standard Client Website" Master Build Prompt

Copy everything below the line into your AI coding tool (Claude Code, Cursor, etc.)
when starting a new client website project. Replace the bracketed `[ ]` placeholders
with the client's actual info before sending.

---

## PROMPT START

You are building a premium, conversion-focused single-page (or multi-page) marketing
website for a local business client. Follow this EXACT specification — it is our
agency's standard build template, proven across multiple live client sites.

### 1. Client Brief (fill these in)
- Business name: `[CLIENT NAME]`
- Industry / niche: `[e.g. barbershop, restaurant, motorworks, fragrance brand, farm]`
- Location(s) + full address(es) for Google Maps: `[ADDRESS]`
- Brand colors (2-3 hex codes or describe mood): `[COLORS]`
- Languages required: English (en), Bahasa Malaysia (bm), Chinese (zh), Iban (ib)
  — adjust if client needs different languages
- Pages needed: `[e.g. Home, Gallery, News/Blog, Contact]`
- Key sections for homepage: `[e.g. Hero, About, Services, Gallery, Testimonials,
  Locations, Contact]`

### 2. Tech Stack
- Plain HTML5 + CSS3 (CSS variables for theming) + vanilla JS. No frameworks unless
  client specifically requests React/Vue.
- Single `index.html`, `style.css`, `app.js` (plus extra HTML pages if multi-page).
- Mobile-first, fully responsive, accessible (semantic HTML, alt text, focus states).
- Fast-loading: no heavy libraries, optimize images, lazy-load below-fold content.

### 3. Visual Design System
- Use CSS custom properties (`:root { --ink, --accent, --accent-lt, ... }`) derived
  from the client's brand colors for consistent theming across the whole site.
- Modern, premium aesthetic: generous whitespace, large readable typography,
  subtle gradients/shadows, smooth hover transitions (200-300ms ease).
- Sticky navigation bar with logo + nav links + language switcher.
- Hero section with strong headline, subheadline, CTA button(s), and a background
  image or gradient matching brand colors.

### 4. Sticky Ticker Bars (REQUIRED — our signature feature)
Add TWO scrolling marquee ticker bars:

**Ticker Bar #1 (sticky, always visible at the very top):**
- `position: sticky; top: 0; z-index: 200; height: 32px; overflow: hidden;`
- Dark background using the brand's darkest accent color.
- Infinite horizontal scroll animation (`@keyframes ticker-scroll { from {
  transform: translateX(0) } to { transform: translateX(-50%) } }`,
  `animation: ticker-scroll 22s linear infinite;`).
- Content repeated 8x for seamless looping: an inline SVG icon (relevant to the
  client's industry — e.g. scissors for barber, seedling for farm, sparkle for
  fragrance, snowflake for desserts, gear for automotive) + text:
  `"This website is built by KOBIS Berhad"`.
- Wrap in HTML comment:
  `<!-- TEMP: KOBIS Berhad placeholder credit ticker — replace wording with
  client's chosen text once payment is received, then remove KOBIS branding
  ticker -->`
- Respect `prefers-reduced-motion: reduce` (pause animation).

**Ticker Bar #2 (static, blended, placed mid-page):**
- Same structure but NOT sticky, lower opacity (~0.35), placed after a major
  section (e.g. after the locations/services section) to feel "blended" into
  the page rather than like an ad banner.
- Same TEMP comment as above.

**Important — avoid FOUC (flash of unstyled content):**
Add an inline `<style>` block in the `<head>`, BEFORE the main stylesheet
`<link>`, containing critical CSS for `.ticker-bar`, `.ticker-track`,
`.ticker-item`, `.ticker-icon`, and a `*{box-sizing:border-box}` reset — using
LITERAL color values (not CSS variables, since variables aren't available yet
at this point). This ensures the ticker renders correctly as a single line on
first paint, before `style.css` finishes loading, with no overlap with the nav.

Use inline SVG icons (not emoji) for ticker icons — `class="ticker-icon"`,
`width:14px; height:14px; vertical-align:-2px; margin-right:2px; flex:none;`,
`fill="currentColor"` or `stroke="currentColor"`.

Because ticker bar #1 is sticky at top:0 and 32px tall, shift the main nav bar
down: `.nav { top: 32px; }` (or equivalent).

### 5. Footer (REQUIRED — our signature footer structure)
Structure, top to bottom:
1. `.footer-brand` block: company logo mark/icon + company name + short tagline
   (translatable via `data-i18n="footer.tagline"`), describing what the
   business does and where it operates.
2. Footer links/columns as appropriate (quick links, contact info, social icons).
3. `.footer-copy`: `<p data-i18n="footer.rights">© 2026 [CLIENT NAME]. All
   rights reserved.</p>`
4. **KOBIS Berhad credit bar** (`.kobis-bar`):
   - Height: `0.75in`
   - Small white/light text (~`.72rem`, `font-weight: 300`,
     `color: rgba(255,255,255,.85)` or similar based on bg)
   - Text: `This Digital Experience is Part of the
     <a href="https://www.kobisberhad.com" target="_blank"
     rel="noopener">KOBIS Berhad</a> Innovation Ecosystem`
   - The "KOBIS Berhad" link is plain-colored by default, but on hover becomes
     a glossy animated gradient using the CLIENT's brand colors:
     ```css
     .kobis-bar .kobis-link:hover {
       background: linear-gradient(135deg, var(--accent-lt), var(--accent), var(--accent-2));
       -webkit-background-clip: text;
       background-clip: text;
       color: transparent;
     }
     ```

### 6. Google Maps Integration
For each business location, embed a working Google Map using the simple
no-API-key iframe method:
```html
<div class="map-embed">
  <iframe
    src="https://www.google.com/maps?q=<URL-ENCODED FULL ADDRESS>&output=embed"
    width="100%" height="320" style="border:0" loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    title="[Location Name] map">
  </iframe>
</div>
```
Place this in the contact/locations section for each address provided.

### 7. 4-Language i18n System
- Languages: English (`en`), Bahasa Malaysia (`bm`), Chinese (`zh`), Iban (`ib`)
  — adjust per client brief.
- Mark every translatable text node with `data-i18n="section.key"` (e.g.
  `data-i18n="hero.title"`, `data-i18n="footer.tagline"`).
- In `app.js`, define a `translations` object keyed by language code, each
  containing all `section.key` → translated string (supports HTML tags for
  bold/links where needed).
- `applyLanguage(lang)` function: iterates all `[data-i18n]` elements, sets
  `innerHTML` if the translation string contains HTML tags, otherwise
  `textContent`. Persist selected language to `localStorage` as
  `<slugified-client-name>-lang`. Default to `en` on first visit, or browser
  language if it matches one of the 4.
- Add a visible language switcher in the nav: `EN / BM / 中 / IB` (or whatever
  languages apply), styled as small buttons/pills, active language highlighted.
- Translate ALL user-facing copy: nav, hero, about, services, footer tagline,
  footer rights line, ticker text (optional — ticker can stay in EN), form
  labels, button text.

### 8. Content & Tone
- Write real, persuasive marketing copy for the client's industry — not
  Lorem Ipsum. Highlight unique selling points, location, hours, contact
  methods (phone/WhatsApp/email), and a clear call to action (book now, visit
  us, contact us).
- Include a gallery/portfolio section with placeholder image grid (use
  `<div>` placeholders with brand-colored backgrounds if no real images
  provided yet — easy to swap later).
- Add a contact form (name, email/phone, message) — can be non-functional
  placeholder (`action="#"`) unless a form backend is specified.

### 9. Deliverable Checklist
At the end, confirm the build includes:
- [ ] Responsive layout tested at mobile / tablet / desktop widths
- [ ] Sticky ticker bar #1 (top) + static ticker bar #2 (mid-page), both with
      KOBIS Berhad TEMP comment, inline SVG icons, critical inline CSS to
      prevent FOUC
- [ ] Footer with brand block + tagline + copyright line + 0.75in KOBIS Berhad
      credit bar with glossy gradient hover
- [ ] Working Google Maps embed(s) for every location
- [ ] 4-language toggle (or as specified) fully wired via `data-i18n` +
      `translations` + `applyLanguage`
- [ ] All copy is real/written for the client, not placeholder Lorem Ipsum
- [ ] No console errors, smooth animations, `prefers-reduced-motion` respected

## PROMPT END

---

### Notes for reuse
- This template was distilled from the live builds for KAM Motorworld,
  Hit Barber Astana, Shiraz Empire, Snow Buko Desserts, Clik Fragrance, and
  SJF Farm.
- Swap the ticker icon SVG and brand color variables per client industry —
  examples already built: gear (automotive), scissors (barber), snowflake
  (desserts), sparkle (fragrance), seedling (farm).
- Once the client pays, search the codebase for the `TEMP: KOBIS Berhad
  placeholder credit ticker` comments and replace/remove the ticker text per
  the client's wishes — but always KEEP the `.kobis-bar` credit line in the
  footer (that's a permanent agency credit, not the temporary ticker).
