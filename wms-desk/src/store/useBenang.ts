import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useHolds } from './useHolds'
import {
  AMBASSADOR_SEED,
  anonymise,
  creditFor,
  mintAmbassadorCode,
  type Ambassador,
  type BenangEvent,
  type BenangEventKind,
} from '../lib/referral'

type BenangState = {
  directory: Ambassador[]
  events: BenangEvent[]
  presence: Record<string, number>
  /** The visitor's own ambassador identity, once minted. */
  mine: Ambassador | null
  hydrated: boolean

  seed: () => void
  find: (code: string) => Ambassador | undefined
  mint: (name: string, phone: string) => Ambassador
  log: (code: string, kind: BenangEventKind, extra?: { holdRef?: string; who?: string }) => void
  confirmOne: (code: string, holdRef?: string) => void
  funnel: (code: string) => { view: number; draft: number; hold: number; confirm: number }
  creditOf: (code: string) => { credit: number; tier: number; confirmed: number }
  ledgerOf: (code: string) => { at: number; who: string; amount: number; ref?: string }[]
  recent: (n: number) => BenangEvent[]
  tick: () => void
}

let counter = 0
const evId = () => `e${Date.now().toString(36)}${(counter++).toString(36)}`

function seedEvents(): BenangEvent[] {
  const now = Date.now()
  const h = 3_600_000
  const mk = (
    code: string,
    kind: BenangEventKind,
    hoursAgo: number,
    who?: string,
    holdRef?: string,
  ): BenangEvent => ({ id: evId(), code, kind, who, holdRef, at: now - hoursAgo * h })

  return [
    // WMS-AINA — 2 confirmed, 1 hold, several views
    mk('WMS-AINA', 'view', 96),
    mk('WMS-AINA', 'view', 88),
    mk('WMS-AINA', 'draft', 80, anonymise('Nadia & Syafiq')),
    mk('WMS-AINA', 'hold', 74, anonymise('Nadia & Syafiq'), 'YBMS-260714-K7QP'),
    mk('WMS-AINA', 'confirm', 60, anonymise('Nadia & Syafiq'), 'YBMS-260714-K7QP'),
    mk('WMS-AINA', 'view', 40),
    mk('WMS-AINA', 'draft', 33, anonymise('Farah & Zul')),
    mk('WMS-AINA', 'hold', 30, anonymise('Farah & Zul'), 'YBMS-260801-M4RT'),
    mk('WMS-AINA', 'confirm', 22, anonymise('Farah & Zul'), 'YBMS-260801-M4RT'),
    mk('WMS-AINA', 'view', 9),
    mk('WMS-AINA', 'hold', 5, anonymise('Sofea & Danial'), 'YBMS-260902-T9WX'),
    // WMS-DAYA — 1 confirmed
    mk('WMS-DAYA', 'view', 50),
    mk('WMS-DAYA', 'draft', 44, anonymise('Iman & Haziq')),
    mk('WMS-DAYA', 'hold', 41, anonymise('Iman & Haziq'), 'YBMS-260620-P3KL'),
    mk('WMS-DAYA', 'confirm', 20, anonymise('Iman & Haziq'), 'YBMS-260620-P3KL'),
    // YBMS-PL-IRFAN — 4 holds
    mk('YBMS-PL-IRFAN', 'hold', 70, anonymise('Aisyah & Rizal'), 'YBMS-260710-W2ND'),
    mk('YBMS-PL-IRFAN', 'hold', 52, anonymise('Liyana & Amir'), 'YBMS-260722-J8QS'),
    mk('YBMS-PL-IRFAN', 'hold', 28, anonymise('Hana & Zaki'), 'YBMS-260815-R5TV'),
    mk('YBMS-PL-IRFAN', 'hold', 11, anonymise('Balqis & Naim'), 'YBMS-260828-C6MB'),
  ]
}

export const useBenang = create<BenangState>()(
  persist(
    (set, get) => ({
      directory: [...AMBASSADOR_SEED],
      events: [],
      presence: { 'WMS-AINA': 2, 'WMS-DAYA': 1, 'YBMS-PL-IRFAN': 1 },
      mine: null,
      hydrated: false,

      seed: () => {
        const s = get()
        const directory = s.directory.length ? s.directory : [...AMBASSADOR_SEED]
        const merged = [...AMBASSADOR_SEED]
        for (const a of directory) if (!merged.some((m) => m.code === a.code)) merged.push(a)
        set({
          directory: merged,
          events: s.events.length ? s.events : seedEvents(),
          hydrated: true,
        })
      },

      find: (code) => get().directory.find((a) => a.code.toUpperCase() === code.toUpperCase()),

      mint: (name, phone) => {
        const existing = get().mine
        if (existing) return existing
        let code = mintAmbassadorCode()
        while (get().find(code)) code = mintAmbassadorCode()
        const amb: Ambassador = { code, name, phone, kind: 'couple' }
        set({ directory: [...get().directory, amb], mine: amb })
        return amb
      },

      log: (code, kind, extra) => {
        if (!code) return
        const ev: BenangEvent = {
          id: evId(),
          code: code.toUpperCase(),
          kind,
          holdRef: extra?.holdRef,
          who: extra?.who,
          at: Date.now(),
        }
        set({ events: [...get().events, ev] })
      },

      confirmOne: (code, holdRef) => {
        const evs = get().events.filter((e) => e.code === code.toUpperCase())
        const target =
          (holdRef && evs.find((e) => e.kind === 'hold' && e.holdRef === holdRef)) ??
          evs
            .filter(
              (e) =>
                e.kind === 'hold' &&
                !evs.some((c) => c.kind === 'confirm' && c.holdRef === e.holdRef),
            )
            .sort((a, b) => a.at - b.at)[0]
        if (!target) return
        get().log(code, 'confirm', { holdRef: target.holdRef, who: target.who })
      },

      funnel: (code) => {
        const evs = get().events.filter((e) => e.code === code.toUpperCase())
        return {
          view: evs.filter((e) => e.kind === 'view').length,
          draft: evs.filter((e) => e.kind === 'draft').length,
          hold: evs.filter((e) => e.kind === 'hold').length,
          confirm: evs.filter((e) => e.kind === 'confirm').length,
        }
      },

      creditOf: (code) => {
        const confirmed = get().funnel(code).confirm
        return { ...creditFor(confirmed), confirmed }
      },

      ledgerOf: (code) => {
        const confirms = get()
          .events.filter((e) => e.code === code.toUpperCase() && e.kind === 'confirm')
          .sort((a, b) => a.at - b.at)
        // Credit is a tier ladder, so each row shows what that confirmation
        // moved the running total by — not a flat per-referral bounty.
        let running = 0
        return confirms.map((e, i) => {
          const next = creditFor(i + 1).credit
          const delta = next - running
          running = next
          return { at: e.at, who: e.who ?? '—', amount: delta, ref: e.holdRef }
        })
      },

      recent: (n) => [...get().events].sort((a, b) => b.at - a.at).slice(0, n),

      tick: () => {
        // A light heartbeat so the ticker and tapestry feel alive without
        // pretending to be a real-time backend.
        const codes = get().directory.map((a) => a.code)
        const code = codes[Math.floor(Math.random() * codes.length)]
        if (!code) return
        const kinds: BenangEventKind[] = ['view', 'view', 'view', 'draft']
        get().log(code, kinds[Math.floor(Math.random() * kinds.length)])
        const presence = { ...get().presence }
        presence[code] = Math.max(0, Math.min(6, (presence[code] ?? 1) + (Math.random() > 0.5 ? 1 : -1)))
        set({ presence })
      },
    }),
    { name: 'wms.benang' },
  ),
)

/** Cross-tab sync: another tab's hold shows up on this tab's tapestry. */
export function attachBenangBus() {
  if (typeof window === 'undefined') return () => {}
  const onStorage = (e: StorageEvent) => {
    if (e.key === 'wms.benang') useBenang.persist.rehydrate()
    if (e.key === 'wms.holds') useHolds.persist.rehydrate()
  }
  window.addEventListener('storage', onStorage)
  const interval = window.setInterval(
    () => useBenang.getState().tick(),
    9000 + Math.random() * 7000,
  )
  return () => {
    window.removeEventListener('storage', onStorage)
    window.clearInterval(interval)
  }
}
