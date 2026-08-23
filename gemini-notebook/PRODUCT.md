# Product

## Register

product

## Status

Concept demonstration — dual-language (BI/BM) marketing site pattern.
Not affiliated with or endorsed by Google LLC; the Gemini Notebook name and
mark appear here only as the subject of a design demonstration.

## Users

Malaysian knowledge workers, students, lecturers, researchers and small teams
who work across both Bahasa Inggeris and Bahasa Melayu and are trying to make
sense of a large pile of documents. Most arrive on mobile, skim, and decide in
under a minute whether the tool understands their problem.

## Product Purpose

Gemini Notebook is an AI research notebook: you add your own sources (PDFs,
docs, slides, links, transcripts, audio) and it answers questions grounded in
those sources, with citations back to the exact passage. This site explains the
idea, shows the workflow, and converts visitors into walkthrough requests.

## Brand Personality

Calm, precise, Google-adjacent. Soft paper-white surfaces, generous whitespace,
one confident blue as the action colour, with violet/teal/green appearing only
as the "converging sources" motif taken from the logo. Trustworthy rather than
loud — the opposite end of the spectrum from the agency's consumer builds.

## Design System

- Surfaces: `--paper #F5F5F7`, `--paper-2 #FFFFFF`, ink `#0F1626`.
- Accents: `--blue #1B6EF3` (primary action), `--violet #B39DF3`, `--teal #12A5A0`,
  `--green #1E9E5A` — the four source-line colours from the brand mark.
- Type: Plus Jakarta Sans (display) + Inter (body).
- Signature motif: coloured source lines converging into the arc mark, rendered
  as a masked inline SVG behind the hero card so it continues the logo artwork.

## Languages

Two languages, per the brief:

- `en` — Bahasa Inggeris, shown in the switcher as **BI**
- `bm` — Bahasa Melayu, shown as **BM**

Every user-facing string carries `data-i18n` (or `data-i18n-ph` for input
placeholders); the dictionaries live in `app.js`. Selection persists in
`localStorage` under `gemini-notebook-lang`, defaults to Bahasa Melayu when the
browser language is `ms`/`id`, otherwise English. `<html lang>` is set to `ms`
for BM so screen readers pronounce the page correctly.

## Anti-references

- Dark, neon "AI startup" landing pages — this is a reading tool, not a demo reel.
- Dense enterprise SaaS grids with a feature table above the fold.
- Stock-photo people at laptops.

## Accessibility & Inclusion

- WCAG AA contrast on body text against the light palette.
- Full keyboard operation: visible focus ring, `<details>`-based FAQ, real form
  labels, `aria-expanded` on the mobile menu toggle.
- `prefers-reduced-motion` disables the float, pulse, marquee and ticker
  animations and renders reveals in their final state.

## Deliverable Notes

- Sticky KOBIS ticker at the top, blended ticker mid-page, both marked with the
  `TEMP: KOBIS Berhad placeholder credit ticker` comment.
- Footer carries the permanent `.kobis-bar` credit with the glossy gradient hover
  built from this site's own accents.
- Google Maps embed (no API key) in the contact section.
- The contact form is a placeholder (`action="#"`) with a client-side thank-you;
  wire it to a backend before launch.
