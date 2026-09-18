# Fix: session is lost on navigation

**Symptom.** A participant logs in, clicks "Utama", and appears logged out.

**Cause.** Two separate defects. One silently destroys the session; the
other makes a working session look broken.

---

## Bug 1 — a failed fetch signs the user out permanently

The participant provider rehydrates from `localStorage` on mount:

```js
const refresh = useCallback(async () => {
  if (!participantId) { setRecord(null); setLoading(false); return; }
  setLoading(true);
  try {
    const rec = await store.getRecord(participantId);
    setRecord(rec);
    if (!rec) setParticipantId(null);   // ← deletes the localStorage key
  } finally { setLoading(false); }
}, [participantId, setParticipantId]);
```

and `getRecord` is:

```js
async getRecord(id) {
  return (await this.listRecords()).find(r => r.participant.id === id) ?? null;
}
```

`listRecords()` runs a `Promise.all` over six Supabase queries. **If any of
them fails, or the network drops, the result is empty** — so `.find()`
returns `undefined`, `?? null` turns that into `null`, and the provider
concludes the participant no longer exists and calls
`setParticipantId(null)`, which **removes the key from localStorage**.

The code cannot tell "this record was deleted" apart from "I couldn't
reach the server". A momentary network blip logs the user out for good.
On a phone on venue wifi, that is not an edge case — it is the normal
case.

### The fix

Fetch one row, and let a failure be a failure:

```ts
async getRecord(id: string) {
  const { data, error } = await this.db
    .from("participants")
    .select("data")
    .eq("event_slug", EVENT.slug)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;        // a failed query is NOT "not found"
  return data?.data ?? null;     // null here means genuinely absent
}
```

```ts
const refresh = useCallback(async () => {
  if (!participantId) { setRecord(null); setLoading(false); return; }
  setLoading(true);
  try {
    const rec = await store.getRecord(participantId);
    if (rec) {
      setRecord(rec);
    } else {
      // The query succeeded and returned no row — really gone.
      setParticipantId(null);
      setRecord(null);
    }
  } catch (err) {
    // We do not know whether the record exists. Keep the session.
    console.warn("participant refresh failed, keeping session", err);
    setFetchError(err);
  } finally {
    setLoading(false);
  }
}, [participantId, setParticipantId]);
```

Two changes, both essential:

1. **`throw` on a query error** instead of folding it into "not found".
2. **Only sign out on a confirmed absence**, never on an exception.

Show a quiet "couldn't refresh your profile — retry" state when
`fetchError` is set, rather than silently dumping the user to logged-out.

---

## Bug 2 — a working session still looks logged out

Even when the session survives, the home page shows no sign of it. `/my`
is linked once in the entire app; `/check-in` is linked eleven times. A
participant lands on Utama, sees the same register call-to-action as a
stranger, and reasonably concludes they were logged out.

Fix with `AccountChip.tsx` in this folder — a persistent header control
showing who is signed in.

---

## Also worth fixing: `getRecord` reads the whole event

`getRecord(id)` currently loads **every participant and every related row
for the entire event** — six tables in parallel — just to find one
person, on every page load. At 19 participants that is merely wasteful;
it also widens the window where `record` is still `null` and the UI
renders as signed-out, which makes Bug 2 worse.

The `.eq("id", id).maybeSingle()` version above fixes this at the same
time: one row instead of the whole event.
