#!/usr/bin/env python3
"""ZAPIA 2.0 - "who did I send X to?" recipient-list exporter.

Reads ONLY through the local whatsapp-mcp bridge REST API (127.0.0.1), so it
never touches the SQLCipher key. Read-only: it cannot send anything.

Walks every chat, pages back through history until it passes the start date,
keeps outgoing messages (is_from_me) whose text/caption contains any of the
given phrases, merges LID and phone-number forms of the same person, and writes
one CSV row per recipient.

    uv run wa_sent_report.py --phrase "My Kenyalang Homes" \
        --from 2026-10-05 --to 2026-10-09 --out kenyalang.csv

Dates are inclusive and interpreted in Asia/Kuala_Lumpur (UTC+8, no DST).
Matching is case-insensitive and ignores accents and repeated whitespace.
Stdlib only; Python 3.9+.
"""
from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import re
import sys
import unicodedata
import urllib.error
import urllib.parse
import urllib.request

MYT = dt.timezone(dt.timedelta(hours=8), "MYT")
LOOPBACK = {"127.0.0.1", "localhost", "::1"}


def fold(s: str) -> str:
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", s).casefold().strip()


class Bridge:
    def __init__(self, base: str, timeout: float = 30.0):
        host = urllib.parse.urlparse(base).hostname
        if host not in LOOPBACK:
            raise SystemExit(f"refusing non-loopback bridge URL: {base}")
        self.base = base.rstrip("/")
        self.timeout = timeout
        # Bypass any system proxy: the bridge is loopback-only.
        self.opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))

    def get(self, path: str, **params):
        q = urllib.parse.urlencode({k: v for k, v in params.items() if v is not None})
        url = f"{self.base}{path}" + (f"?{q}" if q else "")
        try:
            with self.opener.open(url, timeout=self.timeout) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            raise SystemExit(f"bridge {path} -> HTTP {e.code}: {e.read()[:300]!r}")
        except urllib.error.URLError as e:
            raise SystemExit(f"bridge unreachable at {self.base} ({e.reason}). Is whatsapp-bridge.exe running?")


def bare(jid: str) -> str:
    """'60123456789:12@s.whatsapp.net' -> '60123456789@s.whatsapp.net'."""
    if "@" not in jid:
        return jid
    user, server = jid.split("@", 1)
    return user.split(":", 1)[0] + "@" + server


def phone_of(jids) -> str | None:
    for j in jids:
        j = bare(j)
        if j.endswith("@s.whatsapp.net"):
            digits = j.split("@", 1)[0]
            if digits.isdigit():
                return "+" + digits
    return None


def iter_chats(b: Bridge):
    offset = 0
    while True:
        page = b.get("/api/chats", limit=200, offset=offset).get("chats") or []
        if not page:
            return
        yield from page
        offset += len(page)


def scan_chat(b: Bridge, jid: str, start_ts: int, end_ts: int, phrases):
    """Return (hits, merged_jids, chat_row) for outgoing matches in range."""
    hits, before, merged, chat_row = [], None, [], None
    while True:
        resp = b.get("/api/messages", chat_jid=jid, limit=500, before=before)
        msgs = resp.get("messages") or []
        if chat_row is None:
            chat_row = resp.get("chat")
            merged = resp.get("merged_jids") or []
        if not msgs:
            break
        for m in msgs:
            ts = int(m.get("timestamp") or 0)
            if m.get("is_from_me") and start_ts <= ts <= end_ts:
                text = fold(m.get("content_text") or "")
                if any(p in text for p in phrases):
                    hits.append(m)
        oldest = int(msgs[-1].get("timestamp") or 0)
        if oldest < start_ts or len(msgs) < 500:
            break
        before = msgs[-1]["id"]
    return hits, merged, chat_row


def resolve_via_contacts(b: Bridge, name: str, lid_jids: set[str]) -> str | None:
    """Only accept a contact whose own JID/aliases include this LID: no guessing by name."""
    if not name or name.startswith("+"):
        return None
    resp = b.get("/api/contacts/search", q=name, limit=20)
    for c in resp.get("contacts") or []:
        forms = {bare(c.get("jid", "")), bare(c.get("lid") or "")} | {bare(a) for a in (c.get("aliases") or [])}
        if forms & lid_jids:
            ph = phone_of(forms)
            if ph:
                return ph
            digits = re.sub(r"\D", "", c.get("phone") or "")
            if digits:
                return "+" + digits
    return None


def name_via_contacts(b: Bridge, phone: str | None, forms: set[str]) -> str:
    """Look up the saved/push name for a recipient. Only accepts a contact whose
    own JID, LID or aliases overlap this recipient's JIDs."""
    if not phone:
        return ""
    resp = b.get("/api/contacts/search", q=phone.lstrip("+"), limit=20)
    for c in resp.get("contacts") or []:
        cforms = {bare(c.get("jid", "")), bare(c.get("lid") or "")} | {bare(a) for a in (c.get("aliases") or [])}
        if cforms & forms:
            for k in ("full_name", "push_name", "verified_name"):
                v = (c.get(k) or "").strip()
                if v and not v.startswith("+"):
                    return v
    return ""


def parse_day(s: str) -> dt.date:
    return dt.date.fromisoformat(s)


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--phrase", action="append", required=True, help="text to match (repeatable = OR)")
    ap.add_argument("--from", dest="date_from", required=True, type=parse_day, help="YYYY-MM-DD (MYT, inclusive)")
    ap.add_argument("--to", dest="date_to", required=True, type=parse_day, help="YYYY-MM-DD (MYT, inclusive)")
    ap.add_argument("--out", required=True, help="CSV path")
    ap.add_argument("--bridge", default="http://127.0.0.1:8080")
    ap.add_argument("--include-groups", action="store_true", help="also list group chats you posted the phrase in")
    a = ap.parse_args(argv)

    start = dt.datetime.combine(a.date_from, dt.time.min, MYT)
    end = dt.datetime.combine(a.date_to, dt.time.max, MYT)
    start_ts, end_ts = int(start.timestamp()), int(end.timestamp())
    phrases = [fold(p) for p in a.phrase if fold(p)]
    b = Bridge(a.bridge)

    status = b.get("/api/status")
    if not status.get("authenticated"):
        print("WARNING: bridge is not authenticated; results come from whatever is already stored.", file=sys.stderr)
    elif not status.get("connected"):
        print("WARNING: bridge is offline; messages after the disconnect are missing.", file=sys.stderr)

    people: dict[frozenset, dict] = {}
    seen_jids: set[str] = set()
    scanned = skipped_old = 0
    for chat in iter_chats(b):
        jid = chat["jid"]
        if bare(jid) in seen_jids:
            continue  # alias of a chat we already scanned (bridge merges history)
        lmt = int(chat.get("last_message_time") or 0)
        if lmt and lmt < start_ts:
            skipped_old += 1
            continue
        ctype = chat.get("chat_type") or ""
        if jid == "status@broadcast" or jid.endswith("@newsletter"):
            continue  # your Status posts / channels, not sends to people
        if ctype == "group" and not a.include_groups:
            continue
        hits, merged, row = scan_chat(b, jid, start_ts, end_ts, phrases)
        scanned += 1
        forms = {bare(jid)} | {bare(x) for x in merged}
        seen_jids |= forms
        if not hits:
            continue
        key = frozenset(forms)
        rec = people.setdefault(key, {
            "name": (row or chat).get("name") or "",
            "chat_type": ctype,
            "forms": forms,
            "times": [],
            "ids": [],
        })
        rec["times"] += [int(h["timestamp"]) for h in hits]
        rec["ids"] += [h["id"] for h in hits]
        print(f"  match: {rec['name'] or jid} x{len(hits)}", file=sys.stderr)

    rows, unresolved = [], []
    for rec in people.values():
        forms = rec["forms"]
        lids = {f for f in forms if f.endswith("@lid")}
        phone = phone_of(forms)
        how = "jid" if phone else ""
        if not phone and lids:
            phone = resolve_via_contacts(b, rec["name"], lids)
            how = "contact-alias" if phone else ""
        if not rec["name"] or rec["name"].startswith("+"):
            rec["name"] = name_via_contacts(b, phone, forms) or rec["name"]
        if not phone and rec["chat_type"] == "direct":
            unresolved.append(rec)
        t = sorted(rec["times"])
        rows.append({
            "name": rec["name"],
            "phone": phone or "",
            "phone_source": how or {"group": "n/a (group)",
                                     "broadcast": "BROADCAST LIST (recipients not in store)"}.get(rec["chat_type"], "UNRESOLVED"),
            "chat_type": rec["chat_type"],
            "first_sent_myt": dt.datetime.fromtimestamp(t[0], MYT).strftime("%Y-%m-%d %H:%M:%S"),
            "last_sent_myt": dt.datetime.fromtimestamp(t[-1], MYT).strftime("%Y-%m-%d %H:%M:%S"),
            "times_sent": len(t),
            "jids": " ".join(sorted(forms)),
            "message_ids": " ".join(rec["ids"]),
        })
    rows.sort(key=lambda r: r["first_sent_myt"])

    # utf-8-sig so Excel shows Malay/Chinese names correctly.
    with open(a.out, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()) if rows else
                           ["name", "phone", "phone_source", "chat_type", "first_sent_myt",
                            "last_sent_myt", "times_sent", "jids", "message_ids"])
        w.writeheader()
        w.writerows(rows)

    print(f"\nScanned {scanned} chats ({skipped_old} skipped: no activity since {a.date_from}).", file=sys.stderr)
    print(f"Recipients matched: {len(rows)}  -> {a.out}", file=sys.stderr)
    if unresolved:
        print(f"Phone number NOT resolvable for {len(unresolved)} recipient(s) (LID only, no alias known):", file=sys.stderr)
        for r in unresolved:
            print(f"  - {r['name'] or '(no name)'}  {' '.join(sorted(r['forms']))}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
