# Alumni UTHM Borneo · Sarawak Chapter

One-page portal for Alumni UTHM Zon Borneo (Sarawak), built around one job: collecting contributions and programme payments. Payers pay KOBIS Berhad by DuitNow QR or bank transfer, upload proof, and receive a PDF receipt by email once an admin verifies the payment against the bank statement.

**Stack:** Next.js 16 (App Router) · Supabase (Postgres + private Storage) · Resend or Brevo · pdf-lib · Netlify

```
Visitor → form → POST /api/contributions
        → row saved as PENDING (Contribution ID AUB-2026-000001)
        → /pay/<token>: QR, bank details, amount, reference to quote
        → payer pays in their banking app, uploads screenshot/PDF  POST /api/proof/<token>
        → file stored in the private `payment-proofs` bucket, row AWAITING_VERIFICATION
        → admin opens the proof, checks the KOBIS bank statement
        → Verify: row PAID, PDF receipt emailed (once)   |   Reject: reason shown + emailed, payer can re-upload
```

A screenshot is not proof on its own: receipts are issued only after an admin verifies the money on the bank statement. `/api/receipt/<token>` returns 404 unless the row is PAID, and PAID can be set only once, so a double click cannot send two receipts. Uploaded files are identified by their bytes (JPG, PNG, WEBP, PDF only, 4MB max) and are never public; admins open them through 2-minute signed links.

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

### 2. Payment details
Bank details are in `content/site.ts` (`payment`). The QR shown on the payment page is `public/images/kobis-duitnow-qr.png`, regenerated from the payload of the official KOBIS DuitNow QR; the original poster is `public/images/kobis-payment-info.webp`. If the account or QR changes, replace both and update `site.payment`.

Set `ADMIN_NOTIFY_EMAIL` to get an email each time someone uploads proof.

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
4. Set `NEXT_PUBLIC_SITE_URL` to the final domain and redeploy. Receipt and payment links in emails use it.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in sandbox keys
npm run dev                  # http://localhost:3000
npm test                     # unit + payment-flow tests (no network)
npm run build
```


## Admin

`/admin` is protected by `ADMIN_PASSWORD` and uses a signed, HttpOnly, SameSite=Strict session cookie for 12 hours. It opens on **Awaiting verification**. For each row: **View proof** opens the uploaded file, **Verify** (only after finding the amount on the KOBIS bank statement; optionally record the bank reference) marks it paid and emails the receipt, **Reject** records a reason the payer sees and lets them re-upload. Also: search, filters, paid total, **Download CSV**, and **Resend receipt** for verified rows.

## Launch checklist

- [ ] Commitment figures in `content/site.ts` confirmed with the committee
- [ ] Corporate recognition wording approved (it says "may" on purpose)
- [ ] `NEXT_PUBLIC_CONTACT_EMAIL` set (footer Contact link)
- [ ] Privacy and Contribution Terms (`app/privacy`, `app/terms`) reviewed by the committee and KOBIS Berhad
- [ ] One full sandbox payment: success → receipt email with PDF → admin shows PAID
- [ ] One sandbox cancellation: return page says "Payment not completed", no email, no receipt
- [ ] `ADMIN_PASSWORD` set, and the verifier can log in to `/admin`
- [ ] One small live payment end to end
- [ ] Replace the stock hero photo with a real chapter photo when one is available

## Files

```
content/site.ts                 editable copy and figures
lib/rules.ts                    amounts, purposes, validation (shared client + server)
lib/payments.ts                 start → proof upload → admin verify/reject → receipt + email
lib/receipt.ts                  PDF receipt
lib/email.ts, email-template.ts Resend / Brevo delivery and message
app/page.tsx                    the one-page portal
app/components/ContributionForm.tsx
app/payment/return/[token]/     success / pending / not-completed screen
app/api/...                     contributions, proof upload, receipt download, admin verify/reject/view proof
app/admin/                      admin table
supabase/schema.sql             database
test/                           validation, file checks, receipt, full payment flow
```

Hero photo: [alea Film on Unsplash](https://unsplash.com/photos/boats-on-river-with-distinctive-building-in-background-ZCNNcxY7AAY), Unsplash License.
