# White-labelling

Colours are runtime values, not compiled ones.

## How it works

1. `tailwind.config.ts` maps every semantic colour to a CSS custom property
   holding an `R G B` triplet — `canvas: rgb(var(--c-canvas) / <alpha-value>)`.
   Alpha modifiers (`bg-brand/10`) keep working.
2. `src/app/globals.css` defines the default values on `:root`.
3. `TenantTheme` (`src/components/shell/theme.tsx`) writes
   `TenantConfig.theme` into those properties on mount, converting hex to a
   triplet with `hexToRgbTriplet`.

The consequence: switching tenants re-skins the entire application without a
rebuild, and an administrator changing a colour in the configuration centre sees
it apply immediately across every page, chart and badge.

## Tokens

| Token | Role |
|---|---|
| `canvas` | Page background — warm off-white in the STIDC palette |
| `surface` | Cards and panels |
| `line` | Hairlines and borders |
| `navy` | Primary text, brand mark, primary buttons |
| `brand` | Wellbeing green — primary accent, positive state |
| `accent` | Lime — committed amounts, highlights |
| `gold` | Restrained gold — projections, the 75% band |
| `ink`, `ink-muted`, `ink-soft` | Text hierarchy |
| `ok`, `warn`, `risk`, `info` | State colours, used by badges, rings and charts |

Charts read the same tokens (`src/components/charts/index.tsx`), so a re-brand
carries through to every visualisation rather than leaving hard-coded series
colours behind.

## Rules

- Never hard-code a hex value in a component. Use a token.
- State colour is meaning, not decoration: the utilisation ring turns gold at
  75%, amber at 90% and red at 100% because those are the policy bands.
- Two to four characters for `logoMark`; it is rendered in a fixed square.
