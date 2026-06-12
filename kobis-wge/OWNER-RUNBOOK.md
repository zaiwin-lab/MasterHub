# KOBIS Engine — Owner Runbook (no coding required)

This is for **you**, the owner. Plain steps, no jargon. The goal: a real
website service that runs itself and barely needs your attention.

There are only **3 one-time setup actions**, and they exist because they're tied
to **your** accounts — which is a good thing: you own everything, nothing is
locked to anyone else. After this, the system runs on its own.

You can do these yourself in ~10 minutes, or hand the two keys to your assistant
(Claude) and it will finish the wiring for you.

---

## The 3 one-time actions

### 1. Put it online — Netlify (free) · ~4 clicks
This makes your engine live at a web address with automatic security (https).

1. Go to **app.netlify.com** → **Add new site** → **Import an existing project**.
2. Pick **GitHub** → choose the **MasterHub** repository.
3. **IMPORTANT — set "Base directory" to:** `kobis-wge`
   (this keeps your other clients' folders private — only KOBIS is published).
4. Leave build command empty, publish directory `.`, then **Deploy**.

You'll get a link like `kobis-engine.netlify.app`. From now on, **every time
your engine is updated, Netlify republishes it automatically.** Zero effort.

> Optional: buy a nice domain (e.g. **kobislaunch.com**, ~RM50/year) and in
> Netlify → Domain settings → "Add a domain", follow the prompts. Netlify sets
> up the secure certificate for you.

### 2. Turn on the shared database — Supabase (free) · ~2 minutes
This is what lets a **prospect open their preview link on their own phone**, and
clients log into their dashboards from anywhere. Without it, data only lives on
your computer.

1. Go to **supabase.com** → **New project** (free tier is plenty). Pick any name
   and a region near Malaysia (e.g. Singapore).
2. When it's ready, open **SQL Editor** → **New query**.
3. Open the file `supabase-schema.sql` (in this folder), copy everything, paste
   it in, and click **Run**. (One paste. You're done with the database.)
4. Go to **Project Settings → API** and copy two values:
   - **Project URL** (looks like `https://abcd.supabase.co`)
   - **anon public key** (a long string — it's safe to share/expose)

### 3. Connect the two — paste the keys · ~1 minute
1. Open the file **`config.js`** in this folder.
2. Paste your two values between the quotes:
   ```js
   window.KOBIS_CONFIG = {
     supabaseUrl: "https://abcd.supabase.co",
     supabaseAnonKey: "paste-the-long-anon-key-here"
   };
   ```
3. Save. That's it.

> Prefer not to touch files? Just send those two values to Claude and say
> "wire these in" — it'll update `config.js` and push the change, and Netlify
> will republish automatically.

---

## After setup — what you actually do day to day

Almost nothing technical. Your real job stays the same: find good businesses,
send them their preview, close the activation over WhatsApp. The engine handles:

- **Scoring** every prospect automatically (so you focus on the best ones).
- **Generating** the website preview from their info.
- **Pre-writing** the WhatsApp messages.
- **Tracking** previews opened, activations, renewals, and referral credits.

You open your engine link, work the pipeline, and send links. Done.

---

## Costs at a glance

| Thing | Cost | Effort |
|-------|------|--------|
| Netlify hosting | Free to start | none after setup |
| Supabase database | Free tier | none after setup |
| Domain (optional) | ~RM50/year | none after setup |

Everything scales on the free tiers far beyond your first dozens of clients.
You only consider paid plans once you're clearly making money.

---

## If something looks wrong

- **A preview link says "not found" on someone else's phone** → the database
  (step 2 & 3) isn't connected yet. Check `config.js` has both values.
- **You want to wipe the demo data and start clean** → open your live site, then
  in the browser console type `localStorage.clear()` and refresh. (Or ask Claude.)
- **Anything else** → just ask Claude in a session; describe what you see.

---

## A note on security (plain English)

The "anon key" you paste is **meant** to be public — it only works together with
the security rules the SQL set up. For your early launch, the rules let your app
read and write freely, which is fine while only your team has the links. When you
grow, ask Claude to "turn on staff login and lock down writes" — there's already
a ready-to-use hardened version in `supabase-schema.sql`.
