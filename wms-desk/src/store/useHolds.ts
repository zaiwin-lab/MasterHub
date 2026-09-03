import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { OCCUPIED_SEED, VENUE } from '../lib/venue'
import type { PackageId } from '../lib/packages'
import { addDays, toISODate } from '../lib/format'
import { mintReference } from '../lib/referral'

export type HoldStatus = 'held' | 'confirmed' | 'expired'

/**
 * What a hold is allowed to persist. Couple names, phone and notes stay in the
 * client draft and in the WhatsApp message — never in shared storage.
 */
export type Hold = {
  ref: string
  date: string
  pkg: PackageId
  pax: number
  status: HoldStatus
  referralCode?: string
  createdAt: number
}

const HOLD_MS = VENUE.holdHours * 3_600_000

function seedHolds(): Hold[] {
  const now = Date.now()
  const base = new Date()
  const sat = (weeksOut: number) => {
    const d = addDays(base, 21 + weeksOut * 7)
    while (d.getDay() !== 6) d.setDate(d.getDate() + 1)
    return toISODate(d)
  }
  // Three live 48h holds with 6–40h remaining, so the calendar shows "ditahan".
  const remaining = [9, 21, 37]
  const pkgs: PackageId[] = ['seri-santubong', 'seri-keringkam', 'darul-hana']
  const pax = [900, 1400, 600]
  return remaining.map((hrsLeft, i) => ({
    ref: mintReference(new Date(now - (HOLD_MS - hrsLeft * 3_600_000))),
    date: sat(i * 2 + 1),
    pkg: pkgs[i],
    pax: pax[i],
    status: 'held' as HoldStatus,
    referralCode: i === 0 ? 'WMS-AINA' : undefined,
    createdAt: now - (HOLD_MS - hrsLeft * 3_600_000),
  }))
}

type HoldState = {
  confirmed: string[]
  holds: Hold[]
  hydrated: boolean
  seed: () => void
  isTaken: (date: string) => boolean
  statusOf: (date: string) => 'open' | 'held' | 'confirmed'
  holdFor: (date: string) => Hold | undefined
  byRef: (ref: string) => Hold | undefined
  create: (h: Omit<Hold, 'ref' | 'createdAt' | 'status'>) => { ok: boolean; hold?: Hold }
  confirmHold: (ref: string) => void
  expireStale: () => void
}

export const useHolds = create<HoldState>()(
  persist(
    (set, get) => ({
      confirmed: [...OCCUPIED_SEED],
      holds: [],
      hydrated: false,

      seed: () => {
        const s = get()
        const confirmed = Array.from(new Set([...OCCUPIED_SEED, ...s.confirmed]))
        const holds = s.holds.length ? s.holds : seedHolds()
        set({ confirmed, holds, hydrated: true })
        get().expireStale()
      },

      expireStale: () => {
        const now = Date.now()
        set({
          holds: get().holds.map((h) =>
            h.status === 'held' && now - h.createdAt > HOLD_MS ? { ...h, status: 'expired' } : h,
          ),
        })
      },

      isTaken: (date) => get().statusOf(date) !== 'open',

      statusOf: (date) => {
        if (get().confirmed.includes(date)) return 'confirmed'
        const h = get().holds.find(
          (x) => x.date === date && x.status === 'held' && Date.now() - x.createdAt <= HOLD_MS,
        )
        return h ? 'held' : 'open'
      },

      holdFor: (date) =>
        get().holds.find(
          (x) => x.date === date && x.status === 'held' && Date.now() - x.createdAt <= HOLD_MS,
        ),

      byRef: (ref) => get().holds.find((h) => h.ref === ref),

      create: (input) => {
        // One event per day — exclusive hire, so a taken date is a hard no.
        if (get().statusOf(input.date) !== 'open') return { ok: false }
        const hold: Hold = {
          ...input,
          ref: mintReference(),
          status: 'held',
          createdAt: Date.now(),
        }
        set({ holds: [...get().holds, hold] })
        return { ok: true, hold }
      },

      confirmHold: (ref) => {
        const h = get().byRef(ref)
        if (!h) return
        set({
          holds: get().holds.map((x) => (x.ref === ref ? { ...x, status: 'confirmed' } : x)),
          confirmed: Array.from(new Set([...get().confirmed, h.date])),
        })
      },
    }),
    { name: 'wms.holds' },
  ),
)
