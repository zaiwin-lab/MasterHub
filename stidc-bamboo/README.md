# Bamboo Sarawak — Portal Agenda Buluh (STIDC / PUSAKA)

A pro bono digital portal built for the **Sarawak Timber Industry Development
Corporation (STIDC / PUSAKA)** bamboo programme. It presents the state bamboo
agenda, explains why bamboo matters to Sarawak, and turns the two official
PUSAKA application forms into a guided four-step online journey — with a
management dashboard for officers.

**Status:** working demonstration, ready for STIDC review. Not an official
government system until STIDC adopts and publishes it.

---

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Main portal — agenda hero, why bamboo, programme routes, process, application portal, FAQ, offices |
| `bamboo.html` | **Tentang Buluh** — dedicated knowledge page: fundamentals, species, downstream uses, agenda timeline |
| `pengurusan.html` | Management dashboard (password gated) |

## Scripts

| File | Purpose |
|------|---------|
| `app.js` | Shared layer — 4-language i18n engine, navigation, reveal animations, WhatsApp + assistant bubbles, assistant knowledge base |
| `portal.js` | Application engine — form schemas, validation, drafts, Document Box, signature pad, submission |
| `bamboo.js` | Content and copy for the About Bamboo page |
| `admin.js` | Dashboard — KPIs, filtering, sorting, detail drawer, status workflow, CSV export |

---

## What the portal does

### Two official tracks, one agenda
The hero and navigation lead with the **bamboo agenda itself**, not with the
forms. The forms appear as a step in the process, which is how the programme
actually works.

- **Projek Buluh Komuniti** (Form `STIDC.01`) — community, school and
  institution groups. Enforces the **minimum ten participants** rule, land-use
  consent when the land is not the applicant's, and the leader's details.
- **Ladang Buluh Komersial** (Form `STIDC.10.SH.01.37`) — registered companies
  and cooperatives. Company standing, contact officer, project site, soil type
  and the nine-item document checklist.

Both were transcribed from the official PDF forms. Office-use-only sections
(approval, endorsement, inspection dates) are deliberately kept out of the
applicant flow.

### Campaign / poster deep links
Separate QR-poster links continue to work:

- `/?project=community` → opens the community form directly
- `/?project=commercial` → opens the commercial form directly

### Applicant experience
- Four guided steps with a progress sidebar
- **Automatic draft saving** in the browser; each track keeps its own draft
- Inline validation (required fields, email, phone, IC format)
- **Kotak Dokumen** — drag-and-drop upload, 10 MB per-file cap, per-file removal
- Filename-based document-type suggestion, always editable before submitting
- Full review summary, applicant declaration, electronic signature pad
- Unique reference number (`BSA-<A|B>-YYMM-XXXX`) and printable receipt

### Four languages
Bahasa Malaysia (default), English, 中文 and Iban — covering every page, the
entire form, the dashboard and the assistant. The choice persists across visits.

### Two bubbles
- **24/7 digital assistant** — an offline, rule-based helper covering
  eligibility, documents, participants, species, cost, process, timelines, land
  rules, offices, seedlings, privacy and drafts, answering in whichever of the
  four languages is active.
- **WhatsApp** — `011-2846 5813` (`wa.me/601128465813`).

### Management dashboard
`pengurusan.html`, password `123456`.

- KPI tiles: total applications, awaiting review, area applied for (normalised
  to hectares), community participants
- Search, route and status filters, sortable columns
- Detail drawer: full application, members, documents, checklist, signature
- Status workflow: Baharu → Dalam semakan → Disokong / Tidak disokong
- Officer notes, record deletion, print, and **CSV export** of the current view
- **Load sample data** button so the dashboard can be demonstrated before any
  real submissions exist (sample rows are labelled *Contoh*)

---

## Design

**Contemporary Sarawak eco-premium.** Deep rainforest and canopy greens, river
teal, bamboo leaf, Sarawak ochre and muted clay on warm paper. Editorial serif
(Newsreader) for headings, humanist sans (Inter) for everything readable.
Bamboo culm-and-node linework provides the decorative rhythm without competing
with form usability.

Track A (community) reads warm and grounded; Track B (commercial) reads deep
and institutional — related, but distinct at a glance.

Accessibility and performance: keyboard navigable, visible focus states, skip
link, `aria` roles on the step and radio groups, contrast held on both light
and dark surfaces, no horizontal scroll down to 320 px, and full
`prefers-reduced-motion` support. No build step, no framework, no runtime
dependencies — three HTML pages, one stylesheet, four scripts.

---

## Deployment

Static. `netlify.toml` publishes the folder as-is with security headers, and
`pengurusan.html` is marked `noindex`.

```bash
# local preview
python3 -m http.server 8080
```

---

## Before STIDC uses this for real

These are deliberate limits of a demonstration build, not oversights:

1. **Storage is browser-local.** Applications are saved in the visitor's own
   browser via `localStorage`; nothing reaches a server. A production release
   needs a real backend (database + document storage) and the dashboard
   repointed at it. `portal.js` writes through a single store function, so this
   is a contained change.
2. **Uploaded files are recorded, not stored.** The Document Box captures each
   file's name, size and classification; the file bytes are not persisted.
   Document storage arrives with the backend.
3. **The management password is front-end only.** `123456` sits in `app.js` and
   protects nothing. Officer access must move to server-side authentication
   with individual accounts and an audit trail.
4. **Document classification is filename-based**, and is labelled as such in the
   interface. It is not OCR or AI content extraction, and the applicant confirms
   every suggestion. Do not describe it as AI in any client-facing material.
5. **Figures need STIDC's sign-off.** The 30,000 ha target, ~4,900 ha planted,
   17 companies, 200+ community participants and the USD 68 billion global
   export value are drawn from public STIDC statements and Sarawak media
   reports (2023–2025). They are labelled as indicative references on the page
   and should be replaced with STIDC's own current numbers before launch.
6. **The Iban translation needs a native review.** It was written carefully but
   should be checked by an Iban speaker before publication.
7. **Branding.** No STIDC or PUSAKA logo is used, since no official asset was
   supplied. Real logos, the privacy notice, consent wording and the document
   retention period all need STIDC's decision.
8. **Contact numbers** were transcribed from the official PDF forms — worth
   confirming they are current.

---

*This digital experience is part of the [KOBIS Berhad](https://www.kobisberhad.com)
innovation ecosystem.*
