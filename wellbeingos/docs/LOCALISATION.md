# Localisation

Four languages ship: **English**, **Bahasa Malaysia**, **中文** and **Iban**.

The audience is a Sarawak state agency. English and Bahasa Malaysia are the
working languages, Chinese is widely read in the commercial sector, and Iban is
the largest indigenous language in the state — a portal that omits it is not a
Sarawak portal.

## How it works

```
src/core/i18n/
  languages.ts    LanguageKey, endonyms, BCP-47 locales
  dictionary.ts   en (reference) + ms / zh / iba partial maps
  index.ts        translate(), coverage()
src/lib/use-t.ts  the useT() hook every component uses
```

A component never touches the dictionary or the active language:

```tsx
const t = useT();
<h1>{t('hero.titleLead')}</h1>
<p>{t('signin.tenantHint')}</p>
```

`translate()` resolves in three steps: **the requested language → English → the
key itself.** English is typed as the reference, so `TranslationKey` is derived
from it and a typo fails the build. A language that has not yet supplied a
string falls through to readable English rather than rendering a developer key,
which means translation can be completed incrementally without ever breaking a
page.

Interpolation uses `{name}` placeholders so a translated sentence can carry
tenant values without the translator needing to fix word order in advance:

```ts
translate('ms', 'app.period', { year: 2026 });
```

## What is translated

- The entire public site: navigation, hero, all seven workflow steps, the
  capability grid, both audience panels, the privacy section, support and the
  footer.
- The sign-in page and the demo role selector.
- The authenticated chrome: every navigation item, group heading, panel name,
  breadcrumb, notification panel, sidebar controls and the assistant.

Dashboard analytics copy — chart captions, computed hints, seeded record text —
remains English and falls through the chain above. That boundary is deliberate:
those strings are generated from data and are the right place to stop for a
demonstration build. Extending coverage is adding keys to `dictionary.ts`; no
component changes.

## Where language lives

Language is a **viewing preference**, like light/dark mode — it belongs to the
person at the screen, not to the tenant. Two people in the same organisation can
read the same record in different languages. It is held in the store, persisted
to `wellbeingos:v1:language`, and `ThemeRoot` mirrors it onto `<html lang>` so
screen readers and browser translation behave correctly.

## Selector

`LanguageSelector` is a globe button with a four-item listbox. Four options is
few enough to show every choice at once — a native `<select>` would hide the
choice behind a picker that looks different on every platform. Each option is
labelled with its **endonym** (中文, not "Chinese") and carries its own `lang`
attribute.

It appears in the public header, the public mobile drawer, the authenticated top
bar and the authenticated mobile bar.

## Before a live client launch

The Chinese and Iban copy is production-shaped and structurally complete, but it
should be reviewed by a native speaker before a real deployment. Getting a
reviewed string in is a one-line change to `dictionary.ts` — no code, no build
configuration, no component touched.

Run `coverage('iba')` to report a language's completeness against the English
reference.
