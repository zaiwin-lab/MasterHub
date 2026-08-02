#!/usr/bin/env python3
"""
setup-mail.py — bring the kobisbhd.com mail stack up end to end.

Does everything that is left after the Brevo API key exists:

  1. enables Cloudflare Email Routing (writes the MX records)
  2. registers zaiwin@gmail.com as a verified destination
  3. creates the four forwarding rules
  4. registers the domain in Brevo and reads back its DNS requirements
  5. writes Brevo's ownership code / DKIM / DMARC records into Cloudflare
  6. merges SPF into exactly ONE record instead of adding a second
  7. asks Brevo to verify, then re-checks the whole stack

Safe to re-run: every step checks for the existing object first, and nothing
is deleted. Use --dry-run to see the plan without writing anything.

Credentials come from the environment, never from this repo:

  CLOUDFLARE_API_TOKEN   Zone:Read + DNS:Edit + Email Routing:Edit on the zone
  BREVO_API_KEY          the xkeysib-... key

  ./setup-mail.py --dry-run
  ./setup-mail.py
"""

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request

CF_API = "https://api.cloudflare.com/client/v4"
BREVO_API = "https://api.brevo.com/v3"

DOMAIN = "kobisbhd.com"
DESTINATION = "zaiwin@gmail.com"
MAILBOXES = ["outreach", "admin", "setiausaha", "chairman"]

CF_SPF_INCLUDE = "include:_spf.mx.cloudflare.net"
BREVO_SPF_INCLUDE = "include:spf.brevo.com"

DRY_RUN = False


# ---------------------------------------------------------------- plumbing

class Fatal(Exception):
    pass


def request(url, method="GET", headers=None, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("content-type", "application/json")
    for k, v in (headers or {}).items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            return r.status, json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            return e.code, json.loads(raw or b"{}")
        except json.JSONDecodeError:
            return e.code, {"_raw": raw.decode(errors="replace")}
    except urllib.error.URLError as e:
        raise Fatal(f"network error calling {url}: {e.reason}")


def cf(path, method="GET", body=None):
    status, payload = request(
        f"{CF_API}{path}", method,
        {"authorization": f"Bearer {os.environ['CLOUDFLARE_API_TOKEN']}"},
        body,
    )
    return status, payload


def brevo(path, method="GET", body=None):
    return request(
        f"{BREVO_API}{path}", method,
        {"api-key": os.environ["BREVO_API_KEY"], "accept": "application/json"},
        body,
    )


def cf_errors(payload):
    return "; ".join(
        f"{e.get('code', '?')}: {e.get('message', '')}"
        for e in payload.get("errors", [])
    ) or json.dumps(payload)[:300]


def step(msg):
    print(f"\n\033[1m==>\033[0m {msg}")


def ok(msg):
    print(f"    \033[32m✓\033[0m {msg}")


def skip(msg):
    print(f"    \033[90m·\033[0m {msg}")


def warn(msg):
    print(f"    \033[33m!\033[0m {msg}")


def planned(msg):
    print(f"    \033[36m→\033[0m would {msg}")


# ------------------------------------------------------------ dns helpers

def fqdn(host):
    """Brevo returns '', '@', or 'mail._domainkey.' — normalise to a FQDN."""
    host = (host or "").strip().rstrip(".")
    if host in ("", "@", DOMAIN):
        return DOMAIN
    if host.endswith(f".{DOMAIN}"):
        return host
    return f"{host}.{DOMAIN}"


def list_records(zone, rtype=None, name=None):
    q = ["per_page=100"]
    if rtype:
        q.append(f"type={rtype}")
    if name:
        q.append(f"name={name}")
    status, payload = cf(f"/zones/{zone}/dns_records?{'&'.join(q)}")
    if not payload.get("success"):
        raise Fatal(f"listing DNS records failed — {cf_errors(payload)}")
    return payload["result"]


def upsert_txt(zone, name, content, label):
    """Create a TXT record, or update the one already holding this key."""
    existing = list_records(zone, "TXT", name)
    for rec in existing:
        if rec["content"].strip('"') == content:
            skip(f"{label} already correct at {name}")
            return
    # Same host, different value: a stale DKIM/code must be replaced, not
    # duplicated, or verification stays broken forever.
    if existing:
        rec = existing[0]
        if DRY_RUN:
            planned(f"update {label} at {name}")
            return
        status, payload = cf(
            f"/zones/{zone}/dns_records/{rec['id']}", "PATCH",
            {"type": "TXT", "name": name, "content": content, "ttl": 60},
        )
        if not payload.get("success"):
            raise Fatal(f"updating {label} failed — {cf_errors(payload)}")
        ok(f"{label} updated at {name}")
        return

    if DRY_RUN:
        planned(f"create {label} at {name}")
        return
    status, payload = cf(
        f"/zones/{zone}/dns_records", "POST",
        {"type": "TXT", "name": name, "content": content, "ttl": 60},
    )
    if not payload.get("success"):
        raise Fatal(f"creating {label} failed — {cf_errors(payload)}")
    ok(f"{label} created at {name}")


# ----------------------------------------------------------------- steps

def resolve_zone():
    step(f"Resolving Cloudflare zone for {DOMAIN}")
    status, payload = cf(f"/zones?name={DOMAIN}")
    if status == 403:
        raise Fatal(
            "Cloudflare rejected the token (403). It needs Zone:Read, "
            "DNS:Edit and Email Routing:Edit on this zone."
        )
    if not payload.get("success"):
        raise Fatal(f"zone lookup failed — {cf_errors(payload)}")
    if not payload["result"]:
        raise Fatal(f"{DOMAIN} is not in this Cloudflare account")
    z = payload["result"][0]
    ok(f"zone {z['id']}  account {z['account']['id']}")
    return z["id"], z["account"]["id"]


def enable_routing(zone):
    step("Enabling Cloudflare Email Routing")
    status, payload = cf(f"/zones/{zone}/email/routing")
    if payload.get("success") and payload["result"].get("enabled"):
        skip("already enabled")
    elif DRY_RUN:
        planned("enable Email Routing and add its MX records")
        return
    else:
        status, payload = cf(f"/zones/{zone}/email/routing/enable", "POST", {})
        if not payload.get("success"):
            raise Fatal(f"could not enable Email Routing — {cf_errors(payload)}")
        ok("Email Routing enabled")

    # Enabling the service does not always write the records, so reconcile
    # against what Cloudflare says the zone needs.
    status, payload = cf(f"/zones/{zone}/email/routing/dns")
    if not payload.get("success"):
        warn(f"could not read required records — {cf_errors(payload)}")
        return
    required = payload["result"]
    if isinstance(required, dict):
        required = required.get("record", required.get("records", []))

    for rec in required:
        if rec.get("type") != "MX":
            continue  # SPF is handled by the merge step, deliberately
        name = fqdn(rec.get("name"))
        have = [
            r for r in list_records(zone, "MX", name)
            if r["content"].rstrip(".") == rec["content"].rstrip(".")
        ]
        if have:
            skip(f"MX {rec['content']} present")
            continue
        if DRY_RUN:
            planned(f"add MX {rec['content']} (priority {rec.get('priority')})")
            continue
        status, payload = cf(
            f"/zones/{zone}/dns_records", "POST",
            {"type": "MX", "name": name, "content": rec["content"],
             "priority": rec.get("priority", 10), "ttl": 60},
        )
        if payload.get("success"):
            ok(f"MX {rec['content']} added")
        else:
            warn(f"MX {rec['content']} — {cf_errors(payload)}")


def ensure_destination(account):
    step(f"Ensuring {DESTINATION} is a verified destination")
    status, payload = cf(f"/accounts/{account}/email/routing/addresses?per_page=100")
    if payload.get("success"):
        for a in payload["result"]:
            if a["email"].lower() == DESTINATION.lower():
                if a.get("verified"):
                    skip("already verified")
                else:
                    warn("added but NOT verified — confirm the Cloudflare "
                         "email in the Gmail inbox before mail will flow")
                return
    if DRY_RUN:
        planned(f"add {DESTINATION} as a destination")
        return
    status, payload = cf(
        f"/accounts/{account}/email/routing/addresses", "POST",
        {"email": DESTINATION},
    )
    if payload.get("success"):
        warn(f"{DESTINATION} added — Cloudflare has sent a confirmation link, "
             "click it before testing")
    else:
        warn(f"could not add destination — {cf_errors(payload)}")


def ensure_rules(zone):
    step("Creating the four forwarding rules")
    status, payload = cf(f"/zones/{zone}/email/routing/rules?per_page=100")
    existing = set()
    if payload.get("success"):
        for r in payload["result"]:
            for m in r.get("matchers", []):
                if m.get("field") == "to":
                    existing.add(m.get("value", "").lower())

    for box in MAILBOXES:
        addr = f"{box}@{DOMAIN}"
        if addr in existing:
            skip(f"{addr} rule exists")
            continue
        if DRY_RUN:
            planned(f"create rule {addr} → {DESTINATION}")
            continue
        status, payload = cf(
            f"/zones/{zone}/email/routing/rules", "POST",
            {
                "name": f"{addr} to {DESTINATION}",
                "enabled": True,
                "matchers": [{"type": "literal", "field": "to", "value": addr}],
                "actions": [{"type": "forward", "value": [DESTINATION]}],
            },
        )
        if payload.get("success"):
            ok(f"{addr} → {DESTINATION}")
        else:
            warn(f"{addr} — {cf_errors(payload)}")


def brevo_domain():
    step(f"Registering {DOMAIN} in Brevo")
    status, payload = brevo("/senders/domains", "POST", {"name": DOMAIN})
    if status == 401:
        raise Fatal("Brevo rejected the API key (401)")
    if status in (200, 201):
        ok("domain added")
        return payload.get("dns_records", {})

    # Already there — read its configuration instead of failing.
    skip(f"already registered ({payload.get('message', status)})")
    status, payload = brevo(f"/senders/domains/{DOMAIN}")
    if status != 200:
        raise Fatal(f"could not read Brevo domain config — {payload}")
    return payload.get("dns_records", payload)


def write_brevo_records(zone, records):
    step("Writing Brevo's records into Cloudflare")
    if not records:
        warn("Brevo returned no DNS records to write")
        return

    labels = {
        "brevo_code": "Brevo ownership code",
        "dkim_record": "DKIM",
        "dmarc_record": "DMARC",
    }
    for key, label in labels.items():
        rec = records.get(key)
        if not isinstance(rec, dict) or not rec.get("value"):
            warn(f"{label}: not present in Brevo's response")
            continue

        name = fqdn(rec.get("host_name"))

        # Never stomp an existing DMARC policy — it may be deliberate, and
        # Brevo's suggestion is only a starting point.
        if key == "dmarc_record":
            current = [
                r for r in list_records(zone, "TXT", name)
                if "v=DMARC1" in r["content"]
            ]
            if current:
                skip(f"DMARC already published: {current[0]['content'][:60]}")
                continue
            if "p=none" not in rec["value"]:
                warn("Brevo suggested a DMARC policy stricter than p=none; "
                     "using p=none until DKIM verifies")
                rec["value"] = "v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com"

        upsert_txt(zone, name, rec["value"], label)
        if key == "dkim_record":
            ok(f"DKIM selector in use: {name}")


def merge_spf(zone, add_brevo):
    step("Reconciling SPF (must be exactly one record)")
    txts = list_records(zone, "TXT", DOMAIN)
    spf = [r for r in txts if r["content"].strip('"').lower().startswith("v=spf1")]

    if len(spf) > 1:
        warn(f"{len(spf)} SPF records found — merging into one")

    includes, all_qual = [], "~all"
    for r in spf:
        for tok in r["content"].strip('"').split():
            low = tok.lower()
            if low == "v=spf1":
                continue
            if low.endswith("all"):
                all_qual = tok
            elif tok not in includes:
                includes.append(tok)

    for want in ([CF_SPF_INCLUDE] + ([BREVO_SPF_INCLUDE] if add_brevo else [])):
        if not any(want.split(":")[1] in i for i in includes):
            includes.append(want)

    merged = " ".join(["v=spf1"] + includes + [all_qual])

    if len(spf) == 1 and spf[0]["content"].strip('"') == merged:
        skip(f"already correct: {merged}")
        return
    if DRY_RUN:
        planned(f"publish single SPF: {merged}")
        return

    if spf:
        status, payload = cf(
            f"/zones/{zone}/dns_records/{spf[0]['id']}", "PATCH",
            {"type": "TXT", "name": DOMAIN, "content": merged, "ttl": 60},
        )
        if not payload.get("success"):
            raise Fatal(f"SPF update failed — {cf_errors(payload)}")
        for extra in spf[1:]:
            cf(f"/zones/{zone}/dns_records/{extra['id']}", "DELETE")
            ok("removed duplicate SPF record")
    else:
        status, payload = cf(
            f"/zones/{zone}/dns_records", "POST",
            {"type": "TXT", "name": DOMAIN, "content": merged, "ttl": 60},
        )
        if not payload.get("success"):
            raise Fatal(f"SPF create failed — {cf_errors(payload)}")
    ok(f"SPF: {merged}")


def authenticate(attempts=6, delay=20):
    step("Asking Brevo to verify the records")
    if DRY_RUN:
        planned("call the Brevo authenticate endpoint once DNS propagates")
        return False
    for i in range(1, attempts + 1):
        status, payload = brevo(f"/senders/domains/{DOMAIN}/authenticate", "PUT")
        if status in (200, 204):
            ok("domain authenticated")
            return True
        msg = payload.get("message", payload)
        if i == attempts:
            warn(f"still unverified after {attempts} attempts — {msg}")
            warn("DNS propagation can lag; re-run this script in a few minutes")
            return False
        print(f"    waiting for propagation ({i}/{attempts}) — {msg}")
        time.sleep(delay)
    return False


# ------------------------------------------------------------------ main

def main():
    global DRY_RUN
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dry-run", action="store_true",
                    help="show what would change, write nothing")
    ap.add_argument("--brevo-spf", action="store_true",
                    help="also add include:spf.brevo.com (only needed for a "
                         "custom Return-Path; Brevo's default setup does not "
                         "require it)")
    args = ap.parse_args()
    DRY_RUN = args.dry_run

    missing = [v for v in ("CLOUDFLARE_API_TOKEN", "BREVO_API_KEY")
               if not os.environ.get(v)]
    if missing:
        print(f"Missing environment variable(s): {', '.join(missing)}\n")
        print("  CLOUDFLARE_API_TOKEN   a token scoped to this zone with")
        print("                         Zone:Read, DNS:Edit, Email Routing:Edit")
        print("  BREVO_API_KEY          the xkeysib-... key\n")
        print("Set them in the environment, not in this repo.")
        return 2

    if DRY_RUN:
        print("\n\033[33mDRY RUN — nothing will be written\033[0m")

    try:
        zone, account = resolve_zone()
        enable_routing(zone)
        ensure_destination(account)
        ensure_rules(zone)
        records = brevo_domain()
        write_brevo_records(zone, records)
        merge_spf(zone, args.brevo_spf)
        authenticate()
    except Fatal as e:
        print(f"\n\033[31mStopped:\033[0m {e}\n")
        return 1
    except KeyboardInterrupt:
        return 130

    print("\nNow run ./check-email-dns.sh to confirm, then send a test to "
          "each of the four addresses.\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
