"""Run: python3 -m unittest discover -s zapia/tests  (stdlib only)."""
import csv, datetime as dt, http.server, json, os, sys, tempfile, threading, unittest, urllib.parse

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import wa_sent_report as r

MYT = dt.timezone(dt.timedelta(hours=8))
def ts(d, h=12): return int(dt.datetime(2026, 10, d, h, tzinfo=MYT).timestamp())
P = "Promo My Kenyalang Homes!"

ALIASES = {"111@lid": "60111@s.whatsapp.net"}  # Ali: LID + PN rows, merged
CHATS = [
    {"jid": "111@lid", "chat_type": "direct", "name": "Ali", "last_message_time": ts(9)},
    {"jid": "60111@s.whatsapp.net", "chat_type": "direct", "name": "Ali", "last_message_time": ts(8)},
    {"jid": "60222@s.whatsapp.net", "chat_type": "direct", "name": "Siti", "last_message_time": ts(7)},
    {"jid": "333@lid", "chat_type": "direct", "name": "Chong", "last_message_time": ts(6)},
    {"jid": "444@lid", "chat_type": "direct", "name": "Unknown LID", "last_message_time": ts(6)},
    {"jid": "60555@s.whatsapp.net", "chat_type": "direct", "name": "Incoming only", "last_message_time": ts(6)},
    {"jid": "g1@g.us", "chat_type": "group", "name": "Grp", "last_message_time": ts(6)},
    {"jid": "status@broadcast", "chat_type": "broadcast", "name": "", "last_message_time": ts(6)},
    {"jid": "60666@s.whatsapp.net", "chat_type": "direct", "name": "Old", "last_message_time": ts(1)},
]
def m(i, chat, t, text, me=True): return {"id": i, "chat_jid": chat, "timestamp": t, "content_text": text, "is_from_me": me}
MSGS = [
    m("a1", "111@lid", ts(9, 10), "hi"),
    m("a2", "60111@s.whatsapp.net", ts(6), "  promo   MY kenyalang homes "),  # PN half of Ali
    m("a3", "111@lid", ts(8), P),                                            # LID half of Ali
    m("s1", "60222@s.whatsapp.net", ts(4), P),        # before range
    m("s2", "60222@s.whatsapp.net", ts(7, 23), P),    # in range, late evening MYT
    m("c1", "333@lid", ts(5, 0), P),                  # start-of-day boundary
    m("u1", "444@lid", ts(6), P),
    m("i1", "60555@s.whatsapp.net", ts(6), P, me=False),  # incoming: excluded
    m("g1", "g1@g.us", ts(6), P),
    m("st", "status@broadcast", ts(6), P),
    m("o1", "60666@s.whatsapp.net", ts(1), P),
]
# Siti also has 1200 filler messages in range, newer than s2, to force pagination.
MSGS += [m(f"f{i}", "60222@s.whatsapp.net", ts(7, 23) + 1 + i, "filler") for i in range(1200)]
CONTACTS = [{"jid": "60333@s.whatsapp.net", "lid": "333@lid", "push_name": "Chong", "aliases": []}]

def group(j):
    s = {j}
    for a, b in ALIASES.items():
        if j in (a, b): s |= {a, b}
    return s

class H(http.server.BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        u = urllib.parse.urlparse(self.path); q = dict(urllib.parse.parse_qsl(u.query))
        if u.path == "/api/status": body = {"authenticated": True, "connected": True}
        elif u.path == "/api/chats":
            o, l = int(q.get("offset", 0)), int(q.get("limit", 20)); body = {"chats": CHATS[o:o + l]}
        elif u.path == "/api/messages":
            js = group(q["chat_jid"]); lim = min(int(q.get("limit", 20)), 500)
            ms = sorted([x for x in MSGS if x["chat_jid"] in js], key=lambda x: (x["timestamp"], x["id"]), reverse=True)
            if "before" in q:
                anc = next(x for x in ms if x["id"] == q["before"])
                ms = [x for x in ms if (x["timestamp"], x["id"]) < (anc["timestamp"], anc["id"])]
            chat = next(c for c in CHATS if c["jid"] == q["chat_jid"])
            body = {"messages": ms[:lim], "chat": chat, "merged_jids": sorted(js) if len(js) > 1 else []}
        elif u.path == "/api/contacts/search":
            body = {"contacts": [c for c in CONTACTS if q["q"].lower() in c["push_name"].lower()]}
        else: self.send_response(404); self.end_headers(); return
        b = json.dumps(body).encode(); self.send_response(200)
        self.send_header("Content-Type", "application/json"); self.end_headers(); self.wfile.write(b)

class T(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), H)
        threading.Thread(target=cls.srv.serve_forever, daemon=True).start()
    @classmethod
    def tearDownClass(cls): cls.srv.shutdown()

    def run_report(self, *extra):
        out = os.path.join(tempfile.mkdtemp(), "o.csv")
        r.main(["--phrase", "my kenyalang homes", "--from", "2026-10-05", "--to", "2026-10-09",
                "--out", out, "--bridge", f"http://127.0.0.1:{self.srv.server_port}", *extra])
        with open(out, encoding="utf-8-sig") as f: return {row["name"]: row for row in csv.DictReader(f)}

    def test_recipients(self):
        rows = self.run_report()
        self.assertEqual(set(rows), {"Ali", "Siti", "Chong", "Unknown LID"})
        self.assertEqual(rows["Ali"]["phone"], "+60111"); self.assertEqual(rows["Ali"]["times_sent"], "2")
        self.assertEqual(rows["Siti"]["phone"], "+60222"); self.assertEqual(rows["Siti"]["times_sent"], "1")
        self.assertEqual(rows["Siti"]["first_sent_myt"], "2026-10-07 23:00:00")
        self.assertEqual(rows["Chong"]["phone"], "+60333"); self.assertEqual(rows["Chong"]["phone_source"], "contact-alias")
        self.assertEqual(rows["Unknown LID"]["phone"], ""); self.assertEqual(rows["Unknown LID"]["phone_source"], "UNRESOLVED")

    def test_groups_opt_in(self):
        self.assertIn("Grp", self.run_report("--include-groups"))

    def test_refuses_remote_bridge(self):
        with self.assertRaises(SystemExit): r.Bridge("http://example.com:8080")

if __name__ == "__main__": unittest.main()
