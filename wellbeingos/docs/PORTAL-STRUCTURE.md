# Portal Structure

The platform has two distinct surfaces. Understanding the split is the fastest
way to know where a change belongs.

```
/                       public corporate site  ── SiteLayout
  /#overview  /#how-it-works  /#benefits  /#privacy  /#support
  /for-management                              audience page
  /for-employees                               audience page
  /signin                                      login + demo role selection

/app/*                  authenticated panels   ── AppShell
  /app/overview                                role dispatch → one of six dashboards
  /app/benefit … /app/audit                    17 capability-gated routes
```

## The public site

`src/app/(site)/layout.tsx` is a route group, so every public page inherits the
same chrome without repeating it: sticky top navigation, footer, and the two
floating assistance controls.

**Desktop is the primary layout.** `.shell` caps content at 1360px with a
generous gutter; `.band` sets the vertical rhythm between sections (16 → 28
spacing steps as the viewport grows). Tablet reduces columns; mobile stacks and
moves navigation into a right-hand drawer. Nothing is a scaled-down desktop
layout and nothing is a stretched mobile one.

### Why demo personas moved

A column of staff names beside a login form reads as a prototype. The same
personas one click behind **Explore Demo Access** read as a demonstration mode
of a real portal. `src/components/site/demo-access.tsx` groups them:

- **Primary panels** — Employee and Management, given full cards with the
  role's description and the persona who fronts it.
- **Specialist roles** — HR, Finance, Panel Clinic, Wellbeing, Administrator, in
  a compact secondary grid.

`/signin?panel=management` (or `?panel=employee`) opens role selection directly,
which is how the landing-page and audience-page CTAs hand a visitor through.

Set `NEXT_PUBLIC_ENABLE_DEMO_PERSONAS=false` and the control disappears
entirely, leaving a plain corporate login. Nothing else on the page changes.

## The authenticated panels

`AppShell` renders one shell for every role, but it *names* the destination:
the sidebar header and the breadcrumb root both read "Management Panel",
"Employee Portal", "Clinic Portal" and so on, derived from the session's primary
role (`panelKey` in `app-shell.tsx`). Navigation itself is still derived from
capability + module, so a role never sees a link it cannot open — and
`RequireCapability` refuses the route even on a direct URL.

### Collapsible sidebar

The sidebar collapses to a 76px icon rail. The state persists in
`localStorage` under `wellbeingos:v1:sidebar`. The shell publishes the current
width as a CSS variable:

```tsx
<div style={{ '--app-nav': collapsed ? '76px' : '268px' }}>
```

`.fab-left` reads that variable, so the bottom-left assistant slides with the
navigation rather than sitting on top of the profile block. On the public site
the variable is unset and the fallback keeps the control in the corner.

## The two signature controls

`src/components/shell/floating-support.tsx` renders both, on every surface:

| Position | Control | Behaviour |
|---|---|---|
| Bottom-left | **AI Help 24/7** | Opens a panel of canned question/answer pairs from `TenantConfig.support.assistantPrompts`, with an escalation link to WhatsApp. Escape closes it. |
| Bottom-right | **WhatsApp Support** | Opens `wa.me/<number>` with a prefilled message, both from tenant config. |

They are pinned to opposite corners so they can never collide, and both sit
above `env(safe-area-inset-bottom)` so neither is trapped under a phone's home
indicator. The assistant answers questions about *how the platform works* — it
has no access to records and gives no medical advice, which the panel states.

## Footer signature

`SiteFooter` carries the full three-column footer; the authenticated shell
carries a slim one-line version. Both end with:

```
© 2026 SEJAHTERA360. All Rights Reserved.    Designed & Built by KOBIS Berhad
```

`BuildCredit` renders the credit from `TenantConfig.credit`. The `.shine` class
gives it one slow light sweep on hover — a 900ms gradient traverse plus a
gradient underline, suppressed entirely under `prefers-reduced-motion`. It is
the only hover flourish in the platform, which is what keeps it feeling like a
signature rather than decoration.
