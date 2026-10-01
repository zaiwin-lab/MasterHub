# Alumni UTHM Borneo · Sarawak Chapter

One-page portal for Alumni UTHM Zon Borneo (Sarawak), built around one job: collecting contributions and programme payments through ToyyibPay, with a verified PDF receipt emailed automatically.

**Stack:** Next.js 16 (App Router) · Supabase (Postgres) · ToyyibPay · Resend or Brevo · pdf-lib · Netlify

```
Visitor → form → POST /api/contributions
        → row saved as PENDING (Contribution ID AUB-2026-000001)
        → ToyyibPay bill created → redirect to ToyyibPay
        → payer pays (or cancels)
        → ToyyibPay callback  POST /api/toyyibpay/callback   ┐ both ask ToyyibPay's
        → payer returns to    /payment/return/<token>        ┘ getBillTransactions API
        → only a successful transaction with the exact amount marks the row PAID
        → PDF receipt generated + emailed (once), success screen shows Download Receipt
```

Callback and return-URL parameters are **never trusted**. They only identify which bill to check. Payment state always comes from ToyyibPay's own `getBillTransactions` API, and the PENDING → PAID update is conditional, so a repeated callback can never send two receipts. Cancelled, failed and underpaid bills never get a receipt: `/api/receipt/<token>` returns 404 unless the row is PAID.

## Editing content

All copy and numbers are in **`content/site.ts`**: tagline, about text, focus items, the commitment figures (RM15,000 / 10 Years / Anak Sarawak), links and the hero photo. Change a value, commit, and Netlify redeploys.

Amount presets, minimums (RM10 individual, RM1,000 corporate), the per-transaction cap (RM30,000) and the purpose list are in **`lib/rules.ts`**. Both the form and the server read from it.

To use a real chapter photo, put it in `public/images/` and update the import in `app/page.tsx` and `site.hero` (alt text + credit).

## Setup

### 1. Supabase
1. Create a project at supabase.com.
2. SQL Editor → paste and run `supabase/schema.sql`.
3. Project Settings → API: copy the **Project URL** and the **service_role** key.

RLS is on with no policies, so the table is reachable only by the server with the service role key. The browser never talks to Supabase.

### 2. ToyyibPay
1. Start with the sandbox at https://dev.toyyibpay.com. Create an account and a **Category**.
2. Copy your **User Secret Key** and **Category Code**.
3. For launch, repeat on https://toyyibpay.com and switch `TOYYIBPAY_BASE_URL`.

The return and callback URLs are sent with every bill, so there is nothing to register in the ToyyibPay dashboard.

### 3. Email
- **Resend:** verify your sending domain, create an API key, set `EMAIL_PROVIDER=resend`.
- **Brevo:** verify the sender, create an API key, set `EMAIL_PROVIDER=brevo`.

`EMAIL_FROM_ADDRESS` must be on the verified domain. Set `EMAIL_BCC` to give the secretariat a copy of every receipt.

### 4. Environment variables
Copy `.env.example` to `.env.local` for local work, and add the same keys in Netlify → Site configuration → Environment variables. Secrets stay server-side; only `NEXT_PUBLIC_*` values reach the browser.

### 5. Netlify
1. Add a new site from this repository.
2. **Base directory:** `alumni-uthm-borneo`. Build command and publish directory come from `netlify.toml`.
3. Add the environment variables, then deploy.
4. Set `NEXT_PUBLIC_SITE_URL` to the final domain and redeploy. ToyyibPay redirects and callbacks use it.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in sandbox keys
npm run dev                  # http://localhost:3000
npm test                     # unit + payment-flow tests (no network)
npm run build
```

ToyyibPay cannot call back to `localhost`. Locally, the return page still verifies payment when you come back from ToyyibPay. To test the callback as well, expose the dev server with a tunnel (for example `ngrok http 3000`) and set `NEXT_PUBLIC_SITE_URL` to the tunnel URL.

## Admin

`/admin` is protected by `ADMIN_PASSWORD` and uses a signed, HttpOnly, SameSite=Strict session cookie for 12 hours. It shows a searchable, filterable table (it opens on **Paid** by default), a paid total, **Download CSV** for the current filter, **Resend receipt** for paid rows, and **Re-check status** for pending rows in case a callback never arrived.

## Launch checklist

- [ ] Commitment figures in `content/site.ts` confirmed with the committee
- [ ] Corporate recognition wording approved (it says "may" on purpose)
- [ ] `NEXT_PUBLIC_CONTACT_EMAIL` set (footer Contact link)
- [ ] Privacy and Contribution Terms (`app/privacy`, `app/terms`) reviewed by the committee and KOBIS Berhad
- [ ] One full sandbox payment: success → receipt email with PDF → admin shows PAID
- [ ] One sandbox cancellation: return page says "Payment not completed", no email, no receipt
- [ ] Switch to production ToyyibPay keys and `TOYYIBPAY_BASE_URL=https://toyyibpay.com`
- [ ] One small live payment end to end
- [ ] Replace the stock hero photo with a real chapter photo when one is available

## Files

```
content/site.ts                 editable copy and figures
lib/rules.ts                    amounts, purposes, validation (shared client + server)
lib/toyyibpay.ts                createBill, getBillTransactions, verification rules
lib/payments.ts                 start → verify → mark PAID → receipt + email
lib/receipt.ts                  PDF receipt
lib/email.ts, email-template.ts Resend / Brevo delivery and message
app/page.tsx                    the one-page portal
app/components/ContributionForm.tsx
app/payment/return/[token]/     success / pending / not-completed screen
app/api/...                     contributions, ToyyibPay callback, receipt download, admin actions
app/admin/                      admin table
supabase/schema.sql             database
test/                           validation, ToyyibPay parsing, receipt, full payment flow
```

Hero photo: [alea Film on Unsplash](https://unsplash.com/photos/boats-on-river-with-distinctive-building-in-background-ZCNNcxY7AAY), Unsplash License.
