You are running a **Lighthouse performance audit** and implementing fixes.

Target scores: Performance ≥90 | Accessibility ≥95 | Best Practices ≥95 | SEO ≥95

---

## Audit Protocol

### Step 1 — Run the Audit
If browser tools available: navigate to the page and run Lighthouse.
Otherwise: audit the HTML/CSS/JS directly against the checklist below.

---

## Performance Checklist (targeting 90+)

### Critical (each costs 10–30 points)
- [ ] **Largest Contentful Paint (LCP) < 2.5s** — is the hero image/text loading fast?
  - Fix: Preload the LCP element: `<link rel="preload" as="image" href="hero.jpg">`
- [ ] **No render-blocking resources** — scripts in `<head>` without `defer`/`async`
  - Fix: Add `defer` to all non-critical `<script>` tags
- [ ] **Images sized correctly** — no 2000px image displayed at 400px
  - Fix: Use correct dimensions + `loading="lazy"` for below-fold images
- [ ] **Images in modern format** — JPEG/PNG instead of WebP
  - Fix: Convert to WebP (80% smaller, same quality)

### Important
- [ ] **Total page weight < 1MB** (ideally < 500KB)
- [ ] **Google Fonts** loaded with `&display=swap`
- [ ] **No unused CSS** — large CSS frameworks loaded but barely used
- [ ] **Minified CSS and JS** in production

---

## Accessibility Checklist (targeting 95+)
- [ ] All images have `alt` text
- [ ] Colour contrast ≥ 4.5:1 (body text) and ≥ 3:1 (large text)
- [ ] All form inputs have associated `<label>`
- [ ] All buttons have accessible names
- [ ] `lang` attribute on `<html>` element
- [ ] No autoplaying audio/video

---

## SEO Checklist (targeting 95+)
- [ ] `<title>` tag present and descriptive (50–60 chars)
- [ ] Meta description present (150–160 chars)
- [ ] All links have descriptive text (no "click here")
- [ ] `hreflang` set if multilingual
- [ ] Page is crawlable (no `noindex` accidentally set)
- [ ] Canonical URL set

---

## Output Format

**Current estimated scores:**
| Category | Score | Status |
|----------|-------|--------|
| Performance | — | |
| Accessibility | — | |
| Best Practices | — | |
| SEO | — | |

**Fixes by priority:**

| Priority | Fix | Estimated Score Gain |
|----------|-----|---------------------|
| 1 | | +X pts |
| 2 | | +X pts |

**Code fixes:** Provide the exact HTML/CSS changes needed.
