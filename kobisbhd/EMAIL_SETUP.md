# kobisbhd.com — Mail Stack Runbook

Status: **inbound and outbound mail are both down.** Everything below is
verified against live DNS, not assumed. Re-run `./check-email-dns.sh` after
each change.

`kobisberhad.com` is a separate zone (Rumahweb nameservers, Titan email) and
is **not touched by any step here**.

---

## 0. Automated path

Steps 2–6 are scripted. With both credentials in the environment:

```bash
export CLOUDFLARE_API_TOKEN=...
export BREVO_API_KEY=xkeysib-...

./setup-mail.py --dry-run   # show the plan, write nothing
./setup-mail.py             # do it
./check-email-dns.sh        # verify
```

Cloudflare token scope — **Create Custom Token**, not a global key:

| Scope | Permission | Resource |
|---|---|---|
| Zone | Zone → **Read** | Specific zone → `kobisbhd.com` |
| Zone | DNS → **Edit** | Specific zone → `kobisbhd.com` |
| Zone | Email Routing Rules → **Edit** | Specific zone → `kobisbhd.com` |
| Account | Email Routing Addresses → **Edit** | the KOBIS account *(optional)* |

The account-level row is only needed to add a new forwarding destination.
`zaiwin@gmail.com` is already verified, so without it the script warns and
carries on. Restricting the zone resource to `kobisbhd.com` means the token
cannot touch `kobisberhad.com` or any other zone.

It enables Email Routing, writes the MX records, adds the destination and
the four rules, registers the domain in Brevo, writes the ownership code /
DKIM / DMARC into Cloudflare using whatever selector Brevo returns, merges
SPF into a single record, and polls Brevo to verify. Re-running is safe —
every step checks for the existing object first and nothing is deleted.

**The Brevo API key alone is not enough.** Every remaining write is a
Cloudflare DNS change; Brevo's API can only tell you *which* records are
wanted. Without a Cloudflare token the script stops at the zone lookup.

Two things stay manual either way: clicking Cloudflare's destination
confirmation link in Gmail (step 2), and Gmail send-as (step 7).

The rest of this document is the same work done by hand, and the reference
for why each step is ordered the way it is.

---

## 1. Verified current state

Checked live via DNS-over-HTTPS:

| Record | Value | Meaning |
|---|---|---|
| NS | `aiden` / `joyce.ns.cloudflare.com` | zone is on Cloudflare ✅ |
| A `@` | `75.2.60.5` | Netlify, site is up ✅ |
| CNAME `www` | `kobisbhd.netlify.app` | site is up ✅ |
| **MX** | **none** | inbound mail is dead ❌ |
| **TXT `@`** | **none** | no SPF, no Brevo ownership code ❌ |
| **TXT `mail._domainkey`** | **none** | Brevo cannot sign as this domain ❌ |
| **TXT `_dmarc`** | **none** | no alignment policy ❌ |

This confirms the two failures:

1. **Cloudflare Email Routing was never enabled.** The four rules
   (`outreach@`, `admin@`, `setiausaha@`, `chairman@` → `zaiwin@gmail.com`)
   exist in the dashboard but no MX record points at Cloudflare, so no mail
   server on the internet knows where to deliver. The rules are inert — not
   misconfigured, just unreachable.
2. **Brevo has neither the domain nor a key.** `kobisbhd.com` is
   unauthenticated (no DKIM, no ownership code) and the SMTP & API page shows
   **zero API keys**, so nothing — no agent, no MCP client, no script — can
   authenticate against the account at all.

These are independent, but **order matters**: do Cloudflare first. Brevo's
sender-validation email is sent *to* `outreach@kobisbhd.com`, which cannot
arrive until routing works.

---

## 2. Enable Cloudflare Email Routing (fixes inbound)

Cloudflare → `kobisbhd.com` → **Email** → **Email Routing** → **Enable**.

The wizard writes three MX records (`route1/2/3.mx.cloudflare.net`) and one
SPF TXT. Accept them. The four existing rules go live the moment MX
propagates — usually seconds, since the zone is already on Cloudflare.

Destination `zaiwin@gmail.com` is already verified, so no extra confirmation
step.

Then send a test to each of the four addresses and confirm all four land in
`zaiwin@gmail.com`. Do not proceed until they do.

---

## 3. Keep SPF to a single record ⚠️

Cloudflare adds:

```
v=spf1 include:_spf.mx.cloudflare.net ~all
```

Brevo's default setup does **not** need an SPF include — it sends with its
own Return-Path, so SPF aligns on Brevo's domain and DKIM does the work for
`kobisbhd.com`. Only add `include:spf.brevo.com` if you later configure a
custom Return-Path.

If you do add it — or if any other tool asks for an include — **edit the
existing record**, never add a second one:

```
v=spf1 include:_spf.mx.cloudflare.net include:spf.brevo.com ~all
```

A domain may publish **exactly one** SPF record. Two TXT records both
starting `v=spf1` is a `permerror`, and receivers treat a permerror as *no*
SPF at all. Every CIDB outreach mail then lands in spam, and neither
dashboard reports a problem. `setup-mail.py` merges rather than appends for
exactly this reason.

Keep `~all` (softfail) during warm-up; move to `-all` only after a clean
send history.

---

## 4. Authenticate kobisbhd.com in Brevo (fixes outbound)

Brevo → **Settings → Senders, Domains & Dedicated IPs → Domains → Add
domain** → `kobisbhd.com`.

Brevo generates three account-specific values. Copy each **verbatim** from
the Brevo UI — do not retype, and do not copy the values from any older
KOBIS runbook, they are per-domain:

| Type | Name in Cloudflare | Value |
|---|---|---|
| TXT | `@` (the root) | the `brevo-code:…` string Brevo shows |
| TXT | `mail._domainkey` | the `k=rsa; p=…` public key Brevo shows |
| TXT | `_dmarc` | start at `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` |

**Use the selector Brevo actually shows you.** Current accounts get
`mail._domainkey`; older ones get `brevo._domainkey`. Don't assume — read it
off the screen. `setup-mail.py` takes it from the API response, and
`check-email-dns.sh` probes both.

Cloudflare gotchas:

- Cloudflare **auto-appends the zone**. Enter `mail._domainkey`, not
  `mail._domainkey.kobisbhd.com` — the latter silently becomes
  `mail._domainkey.kobisbhd.com.kobisbhd.com` and never verifies.
- The DKIM key is long and Cloudflare's field trims nothing. Paste as one
  line, no added spaces or line breaks inside `p=`.
- Leave DMARC at `p=none` until Brevo reports authenticated sends. Setting
  `p=reject` before DKIM verifies will bounce the entire first CIDB batch.

Click **Verify** in Brevo, then run `./check-email-dns.sh` — it should come
back all-pass.

---

## 5. Generate the Brevo keys

The screenshot shows an empty key list on **API keys & MCP**. There are two
different credentials and they are not interchangeable:

| Credential | Where | Used for |
|---|---|---|
| **API key** (`xkeysib-…`) | SMTP & API → **API keys & MCP** → Generate API key | Brevo REST API, the Brevo MCP server, ZKB-02 / ZKB-03 agent automation, contact import |
| **SMTP key** (`xsmtpsib-…`) | SMTP & API → **SMTP** tab | SMTP relay on `smtp-relay.brevo.com:587` — Gmail send-as, transactional mail from the site |

Generate both. Name them by purpose (`zkb-agents`, `gmail-relay`) so a single
leak can be revoked without taking everything down.

**Never commit either to this repo.** Put them in the environment /
credential store the agents read from. The key is shown once; if it scrolls
away, revoke and regenerate rather than guessing.

Leave *Authorized IPs* off for now — the agents run from changing addresses
and IP blocking will lock them out mid-batch. Revisit once the sending
surface is stable.

---

## 6. Validate the sending addresses

Brevo → Senders → add `outreach@kobisbhd.com` (and `admin@` if it will send).
Brevo emails a validation code to that address; it arrives in
`zaiwin@gmail.com` via the routing from step 2. This is why step 2 comes
first.

---

## 7. Make replies come from the right address

Cloudflare Email Routing is **forward-only** — it receives, it does not send.
Without this step, replying to a CIDB contractor from Gmail goes out as
`zaiwin@gmail.com`, which breaks the outreach entirely.

Gmail → Settings → Accounts → **Send mail as** → Add
`outreach@kobisbhd.com`:

```
SMTP server:  smtp-relay.brevo.com
Port:         587
Username:     the SMTP login shown on Brevo's SMTP tab
Password:     the SMTP key from step 5
Security:     TLS
```

Set it as the default reply address for outreach threads.

---

## 8. Before the first CIDB batch

- `kobisbhd.com` has **no sending reputation** — it has never sent a single
  message. A cold blast of a full contractor database from a fresh domain is
  the fastest route to a blocklist.
- Warm up: ~20–50/day for the first few days, roughly doubling while bounces
  stay under 2% and complaints under 0.1%.
- Clean the CIDB import before sending — a fresh domain has no margin for a
  bad-address bounce rate.
- Confirm the contractor list has a lawful basis under PDPA and that every
  send carries a working unsubscribe.

---

## 9. Verify

```bash
./check-email-dns.sh
```

All eight checks pass = DNS side is complete. It flags the double-SPF case
explicitly, since that is the failure mode neither dashboard surfaces, and
it probes both DKIM selectors so it works whichever one Brevo issued.

---

## Order of operations

```
Enable Cloudflare Email Routing   →  inbound works, 4 rules go live
Test all four addresses           →  confirm at zaiwin@gmail.com
Merge SPF into ONE record         →  avoid permerror
Add Brevo TXT / DKIM / DMARC      →  domain authenticated
Generate API key + SMTP key       →  agents and relay can authenticate
Validate outreach@ as a sender    →  needs inbound from step 1
Gmail send-as via Brevo relay     →  replies keep the domain
Warm up, then CIDB batch
```
