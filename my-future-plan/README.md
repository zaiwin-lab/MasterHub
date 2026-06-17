# My Future Plan

A free, no-login web app: tell it your dream, and AI crafts **Your Beautiful
Pathway** across three horizons — **10 years, 5 years, 1 year** — finished with a
significant motivational quote. Built to be saved and shared.

## How it works
- **`index.html` / `style.css` / `app.js`** — static single page (teal/paper,
  NotebookLM-style document). No build step.
- **`netlify/functions/generate-pathway.js`** — serverless function that calls
  the Claude API server-side. The API key never reaches the browser.
- **Email gate** — sharing/downloading asks for an email first (the only ask;
  no account). Captured via **Netlify Forms** (`pathway-emails`), exportable
  from the Netlify dashboard. Creating a pathway needs nothing.
- **Viral loop** — each shared artifact (poster image + print-to-PDF keepsake)
  carries the tool's link so recipients come make their own.

## Deploy (Netlify)
1. Point Netlify at this folder (`publish = "."`, functions auto-detected).
2. Set environment variable **`ANTHROPIC_API_KEY`** to a real Claude API key
   (`sk-ant-…`). Without it the generator returns a friendly error.
3. Optional: **`MFP_MODEL`** to override the model (default `claude-sonnet-4-6`;
   use `claude-haiku-4-5-20251001` for lower cost).

## Local dev
Run `netlify dev` so the `/.netlify/functions/*` endpoint and Netlify Forms are
available. A plain static server will load the page but can't generate or
capture emails.
