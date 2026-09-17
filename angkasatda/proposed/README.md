# Proposed — language switcher

Design spec and drop-in component for a site-wide **EN · BM · 中文 · Iban**
switcher. Visual spec (live demo, treatments, states, narrow-screen
behaviour): see the artifact shared alongside this.

## What already exists in the live build

Worth knowing before implementing — most of the system is already there:

- A language context persisted under `attendify:lang`
- It already accepts exactly `["en", "bm", "zh", "iban"]`, defaulting to `en`
- It already sets `document.documentElement.lang` on change
- A `t()` lookup and translated content objects shaped
  `{ en, bm, zh, iban }`

So this is a **UI** task, not an i18n build. Wire `LanguageSwitcher` to the
existing `setLang` rather than adding new state.

## Three things to do alongside the component

**1. Add a CJK font.** Plus Jakarta Sans has no CJK glyphs, so 中文 falls
back to whatever the device has. Load Noto Sans SC and add a `font-cjk`
utility:

```js
// tailwind.config.js
theme: {
  extend: {
    fontFamily: {
      cjk: ['"Noto Sans SC"', '"Plus Jakarta Sans"', "sans-serif"],
    },
  },
}
```

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet" />
```

**2. Mount it once, globally.** Put it in the shared header so it holds the
same position on all 18 routes.

**3. Close the translation gap — the real work.** Of roughly 1,136 copy
strings in the bundle, only about 120 carry translations, and those are
mostly navigation and UI chrome. Iban is largely absent from the
dictionary even though full Iban sentences exist elsewhere in the build.

A prominent four-language switcher advertises four complete languages. Until
the dictionary catches up, switching to 中文 or Iban will leave most page
content in English or Malay. Either close the gap first, or ship the
switcher with only the languages that are actually complete and add the
others as they land.

## Palette used

Read from the live stylesheet, so the component matches without guessing:

| Token | Value |
|---|---|
| `navy-900` | `#0e1a34` (also the site's `theme-color`) |
| `navy-600` | `#274071` |
| `navy-200` | `#aabddc` |
| `navy-100` | `#d5deee` |
| `navy-50` | `#eef2f9` |
| `gold-500` | `#c8952c` (focus ring) |
| `emerald-500` | `#10b981` (alternate active fill) |
