# ProgramOS Lite — improvement roadmap

Findings from analysing the live production bundle (deploy `6aa8add7e…`,
15 Sep 2026) and the live HTTP surface, 17 Sep 2026.

Everything below is evidence-based: each item cites what was observed.
Nothing here has been implemented — the source is not yet available
(see `CHECKLIST.md`).

---

## P0 — Authentication and access control 🔴

The single biggest area for improvement, and the thing to fix first.

### 1. The admin panel is not really protected

**Observed.** The admin gate is a client-side check:

```js
const KEY = "attendify:adminAuthed";
function AdminRoute() {
  const [ok, setOk] = useState(() => sessionStorage.getItem(KEY) === "1");
  return ok ? <AdminPanel/> : <PassCodePrompt onOk={() => setOk(true)}/>;
}
```

and the passcode prompt compares the typed value against **a constant
compiled into the JavaScript bundle**. `/admin/participant/:id` guards
itself with the same `sessionStorage` flag.

**Why it matters.** The passcode ships to every visitor inside a public
549 KB file — anyone who opens the bundle can read it. And even without
it, setting one `sessionStorage` value in devtools opens the panel, which
lists participant names, mobile numbers, emails, cooperative names and
attendance, with CSV export.

**Fix.** Move the check server-side. Use Supabase Auth with a real admin
account, gate the admin tables behind Row Level Security keyed on that
user, and treat the client-side check as cosmetic only. A UI gate that no
server enforces is not a gate.

### 2. Participant "login" is a lookup, not authentication

**Observed.** Participants sign in by entering mobile number and email
("Anda akan guna nombor telefon dan e-mel untuk log masuk"), matched with
`.eq("mobile", …)` against the `participants` table. The result is stashed
in `attendify:currentParticipantId`. There is no Supabase Auth session —
`supabase.auth.*` appears only inside the library, never in app code.

**Why it matters.** Anyone who knows a participant's phone and email — or
who changes that stored id — can read and write that participant's
records: assessment results, action plans, reflections, attendance.

**Fix — recommended: email or SMS OTP.** Supabase Auth's
`signInWithOtp()` fits this audience well: no password to remember, and
it uses the same phone/email the participant already registered with.
The flow barely changes for the user — they enter their email, get a
6-digit code, and are in — but the session becomes a real, verifiable
JWT that RLS can enforce against.

Options considered:

| Approach | Friction | Security | Verdict |
|---|---|---|---|
| Phone + email lookup (current) | lowest | none | replace |
| **Email OTP / magic link** | low | strong | **recommended** |
| SMS OTP | low | strong | good, but per-message cost |
| Password accounts | high | strong | wrong fit for a one-day programme |

### 3. Verify Row Level Security — do this today

**This is the unknown that determines how urgent items 1 and 2 are.**

The app reads and writes all six tables with no authenticated session, so
it is doing so with the public anon key. If RLS is permissive on those
tables, the participant data is reachable directly from anywhere,
regardless of what the UI shows — and fixing the UI gate would change
nothing.

Check each of `participants`, `company_profiles`, `attendance`,
`assessment_results`, `action_plans`, `reflections` in the Supabase
dashboard → Authentication → Policies. If RLS is off or the policies are
`USING (true)`, treat participant PII as currently exposed and prioritise
accordingly.

### 4. Add the missing security headers

**Observed.** The live site sends only `strict-transport-security`. There
is no `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
`Permissions-Policy` or CSP.

The `netlify.toml` in this folder already adds the first two; it takes
effect on the next deploy from here. Consider adding a CSP and
`Referrer-Policy: strict-origin-when-cross-origin` too.

---

## P1 — Event-day reliability

These matter because the app is used live, in a room, on participants'
own phones.

- **Offline-tolerant QR check-in.** There is no service worker or
  manifest (`/sw.js`, `/manifest.webmanifest` both absent). Venue wifi is
  the usual failure point on the day. Queue check-ins locally and sync
  when the connection returns.
- **Installable PWA.** Add a web app manifest so participants can add it
  to their home screen — useful for a programme with a 90-day follow-on.
- **Offline fallback for the Prompt Hub.** ~60 prompts is reference
  material people will want without a connection.
- **Admin: manual check-in override.** If a QR scan fails, staff need to
  mark attendance by name without breaking the flow.

## P2 — Performance

- **Split the bundle.** One 549 KB JavaScript chunk is served to every
  visitor; there is no code splitting. The admin panel, the full prompt
  library and every route load before the landing page paints. Route-level
  `React.lazy()` would cut first load substantially — the biggest
  single win available, and low risk.
- **Self-host the fonts.** Plus Jakarta Sans loads from Google Fonts,
  costing a third-party connection on first paint.
- **Add `robots.txt` and `sitemap.xml`.** Neither exists (both fall
  through to the SPA handler).

## P3 — Product and UX

- **Finish the trilingual coverage.** The site already carries Malay,
  English and Iban (`attendify:lang`) — a real strength for a Sarawak
  programme. Worth auditing that all three are complete across every
  route, since coverage looked uneven in the extracted copy.
- **E-certificate delivery.** Certificates are promised in the copy
  ("e-sijil selepas program"). Consider emailing them automatically on
  programme completion rather than relying on participants returning.
- **90-day journey nudges.** The journey is the stated point of the
  programme, but nothing prompts participants to come back. Scheduled
  email nudges at day 7/30/60/90 would lift completion.
- **Admin analytics.** Attendance rate, readiness-score distribution and
  action-plan completion would show whether the programme worked —
  currently the admin view is a list plus CSV export.
- **Accessibility pass.** Worth a keyboard and screen-reader audit before
  the next cohort.

## P4 — Operations

- Get the source into Git and attach it to Netlify (see `CHECKLIST.md`)
- Deploy previews on pull requests
- Back up the Supabase schema into this repo
- Error tracking (Sentry or similar) — there is none today
- Privacy notice covering what participant data is stored and for how
  long, given the PII involved

---

## Suggested order

1. Check RLS on all six tables *(today — it sets the urgency of 2 and 3)*
2. Real admin authentication
3. Participant OTP login
4. Security headers *(ships free with the next deploy from this folder)*
5. Bundle splitting
6. Offline check-in, ahead of the next cohort
7. Everything in P3
