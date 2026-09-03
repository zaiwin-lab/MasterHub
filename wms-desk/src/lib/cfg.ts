import type { PackageId } from './packages'

export type DraftShape = {
  date: string
  pkg: PackageId
  pax: number
  dishes: Record<string, string>
  names: string
  phone: string
  notes: string
  benang: string
}

/** Compact, URL-safe encoding of a draft for the ?cfg= family-review link. */
export function encodeCfg(d: Partial<DraftShape>): string {
  const compact = {
    d: d.date ?? '',
    k: d.pkg ?? '',
    x: d.pax ?? 0,
    m: d.dishes ?? {},
    n: d.names ?? '',
    t: d.notes ?? '',
    b: d.benang ?? '',
  }
  const json = JSON.stringify(compact)
  const bytes = new TextEncoder().encode(json)
  let bin = ''
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeCfg(raw: string): Partial<DraftShape> | null {
  try {
    const b64 = raw.replace(/-/g, '+').replace(/_/g, '/')
    const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
    const o = JSON.parse(new TextDecoder().decode(bytes))
    return {
      date: typeof o.d === 'string' ? o.d : '',
      pkg: o.k || undefined,
      pax: typeof o.x === 'number' ? o.x : undefined,
      dishes: o.m && typeof o.m === 'object' ? o.m : {},
      names: typeof o.n === 'string' ? o.n : '',
      notes: typeof o.t === 'string' ? o.t : '',
      benang: typeof o.b === 'string' ? o.b : '',
    }
  } catch {
    // A hand-edited or truncated link is a normal thing to receive; the caller
    // falls back to a fresh draft rather than surfacing a parse error.
    return null
  }
}
