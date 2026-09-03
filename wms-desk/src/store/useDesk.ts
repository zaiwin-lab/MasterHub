import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_PACKAGE, type PackageId } from '../lib/packages'
import { clampPax } from '../lib/quote'

export type DeskState = {
  date: string
  pkg: PackageId
  pax: number
  dishes: Record<string, string>
  names: string
  phone: string
  notes: string
  benang: string
  useCredit: boolean
  lastRef: string | null
  touched: boolean
  savedAt: number | null

  setDate: (d: string) => void
  setPkg: (p: PackageId) => void
  setPax: (n: number) => void
  bumpPax: (delta: number) => void
  setDish: (courseId: string, dishId: string) => void
  setField: (k: 'names' | 'phone' | 'notes' | 'benang', v: string) => void
  setUseCredit: (v: boolean) => void
  setRef: (r: string | null) => void
  hydrateFrom: (patch: Partial<DeskState>) => void
  reset: () => void
}

const blank = {
  date: '',
  pkg: DEFAULT_PACKAGE as PackageId,
  pax: 500,
  dishes: {} as Record<string, string>,
  names: '',
  phone: '',
  notes: '',
  benang: '',
  useCredit: true,
  lastRef: null as string | null,
  touched: false,
  savedAt: null as number | null,
}

export const useDesk = create<DeskState>()(
  persist(
    (set, get) => ({
      ...blank,

      setDate: (date) => set({ date, touched: true, savedAt: Date.now() }),
      setPkg: (pkg) =>
        // Dishes are per-package (fish only exists on Keringkam), so switching
        // rebuilds the courses from scratch rather than carrying stale picks.
        set({ pkg, dishes: {}, touched: true, savedAt: Date.now() }),
      setPax: (n) => set({ pax: clampPax(n), touched: true, savedAt: Date.now() }),
      bumpPax: (delta) => set({ pax: clampPax(get().pax + delta), touched: true, savedAt: Date.now() }),
      setDish: (courseId, dishId) =>
        set({ dishes: { ...get().dishes, [courseId]: dishId }, touched: true, savedAt: Date.now() }),
      setField: (k, v) => set({ [k]: v, touched: true, savedAt: Date.now() } as Partial<DeskState>),
      setUseCredit: (useCredit) => set({ useCredit }),
      setRef: (lastRef) => set({ lastRef }),
      hydrateFrom: (patch) => set({ ...patch, touched: true, savedAt: Date.now() }),
      reset: () => set({ ...blank }),
    }),
    { name: 'wms.desk' },
  ),
)

const MY_PHONE = /^(\+?60|0)1\d[- ]?\d{3,4}[- ]?\d{4}$/

export function isValidMyPhone(p: string): boolean {
  return MY_PHONE.test(p.trim().replace(/\s+/g, ' '))
}

export function canHold(s: Pick<DeskState, 'date' | 'names' | 'phone' | 'pax'>): boolean {
  return (
    !!s.date &&
    s.names.trim().length >= 2 &&
    isValidMyPhone(s.phone) &&
    s.pax >= 500 &&
    s.pax <= 2000
  )
}
