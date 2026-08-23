# Design system & white-labelling

Two presentation modes, one component set, zero component-level knowledge of
which mode is showing.

## Visual direction — "Sihat Sejahtera"

Vitality, clarity, calm. Geometric sans throughout (Space Grotesk for display,
Inter for text), radial gauges with a soft bloom, meter bars for rankings, and
a faint engineering grid behind hero panels — a command-deck read rather than
an editorial one.

This is a deliberate departure from the sibling deployment in this portfolio,
which uses a warm cream canvas, emerald and gold, and a serif display face. Two
products for the same client must not be mistaken for one another.

## Modes

**Light is the default.** The platform is presented in lit meeting rooms and on
projectors, where a dark interface washes out. Dark is a full alternate, not an
afterthought — both palettes ship per tenant and both are white-labellable.

The toggle sits in the top bar and on the sign-in screen. The choice is stored
per browser (`wellbeingos:v1:mode`), because presentation is a viewing
preference rather than an account setting.

| | Light | Dark |
|---|---|---|
| Canvas | Mint-tinted white `#F2F7F7` | Midnight indigo `#080D1A` |
| Primary | Deep teal `#0E9F8C` | Aqua `#00D4B8` |
| Second accent | Indigo violet `#6355D8` | Violet `#7C6CFF` |
| Card sheen | White along the top edge | A hairline of light |
| Gauge bloom | 2–2.5px | 5–6px |

## How it works

1. `tailwind.config.ts` maps every semantic colour to a CSS custom property
   holding an `R G B` triplet — `brand: rgb(var(--c-brand) / <alpha-value>)`.
   Alpha modifiers (`bg-brand/10`) keep working.
2. `globals.css` defines the light palette on `:root` and the mode-dependent
   surface treatment (`--card-sheen`, `--card-shadow`, `--field-alpha`), with a
   `[data-mode='dark']` block overriding it.
3. `TenantTheme` writes the tenant's palette for the active mode into those
   properties and stamps `data-mode` on the root element.

Switching tenant or mode re-skins the whole application without a rebuild.

## Tokens are semantic, not literal

| Token | Role |
|---|---|
| `canvas` | Page background |
| `surface` / `raised` | Cards; inputs, hover rows and inner tiles |
| `line` | Hairlines and borders |
| `head` | Headings and the strongest foreground |
| `ink` / `ink-muted` / `ink-soft` | Text hierarchy |
| `primary` / `onPrimary` | Action fill and the text on it |
| `tint` | Neutral wash for hovers, overlays and grids — light on dark, dark on light |
| `brand` / `violet` / `gold` | Accents; `brand` carries the identity |
| `ok` / `warn` / `risk` / `info` | State |

`head`, `primary` and `tint` are what let one component set render correctly on
either canvas. A literal palette (`navy`, `cream`) cannot do that.

## Rules

- Never hard-code a hex value in a component. Use a token.
- State colour is meaning, not decoration: the utilisation ring turns gold at
  75%, amber at 90% and red at 100% because those are the policy bands.
- Each band stays within its own hue. Blending gold into teal smears into an
  unreadable olive on a light canvas.
- Charts read the same tokens, so a re-brand carries through to every
  visualisation rather than leaving hard-coded series colours behind.
- SVG filter attributes take numbers, not CSS variables — `usePresentationMode`
  supplies the bloom radius, and keeps presentational primitives independent of
  application state.
