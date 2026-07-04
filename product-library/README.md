# KOBIS Product Library

A single-page, Netlify-ready dashboard with three role-gated views of every real build.

## Views
- **Client** (default, public): curated showcase — category, value-led description, friendly status. No %, cost, or verdicts.
- **Team** (PIN): completion, market value, verdicts, clone families. Build-time & token cost hidden.
- **Owner** (PIN): everything, including days-to-finish and token cost.

## Set your PINs
Edit `PINS` at the top of the `<script>` in `index.html`:
```js
const PINS = { owner: "2468", team: "1357" };
```
(Client-side PINs deter casual viewing; they are not hard security. Keep the real numbers out of screenshots.)

## Keep the library live
Edit the `DATA` array in `index.html`. Each project has internal fields (completion, days, token, mv, verdict)
and client-facing fields (cat, cdesc, cval, cstatus, clientShow).

## Deploy to Netlify
- **Fastest:** drag the `product-library` folder onto https://app.netlify.com/drop
- **Git:** point a new Netlify site at this repo, set base directory to `product-library`, publish directory `.`, no build command.
