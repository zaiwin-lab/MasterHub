import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDesk } from './useDesk'
import { useBenang } from './useBenang'
import { isPackageId } from '../lib/packages'
import { clampPax } from '../lib/quote'
import { decodeCfg } from '../lib/cfg'

/**
 * Hydrates the desk from a shared link. Accepts ?benang=, and ?rujukan= /
 * ?ref= as aliases, plus the compact ?cfg= family-review draft.
 */
export function useDeepLink(): { cfgLoaded: boolean } {
  const [params] = useSearchParams()
  const desk = useDesk()
  const benang = useBenang()
  const [cfgLoaded, setCfgLoaded] = useState(false)

  useEffect(() => {
    const cfg = params.get('cfg')
    if (cfg) {
      const d = decodeCfg(cfg)
      if (d) {
        desk.hydrateFrom({
          ...(d.date ? { date: d.date } : {}),
          ...(isPackageId(d.pkg) ? { pkg: d.pkg } : {}),
          ...(d.pax ? { pax: clampPax(d.pax) } : {}),
          ...(d.dishes ? { dishes: d.dishes } : {}),
          ...(d.names ? { names: d.names } : {}),
          ...(d.notes ? { notes: d.notes } : {}),
          ...(d.benang ? { benang: d.benang } : {}),
        })
        setCfgLoaded(true)
      }
    }

    const pkg = params.get('pakej')
    if (isPackageId(pkg)) desk.setPkg(pkg)

    const pax = params.get('pax')
    if (pax && Number.isFinite(Number(pax))) desk.setPax(clampPax(Number(pax)))

    const tarikh = params.get('tarikh')
    if (tarikh && /^\d{4}-\d{2}-\d{2}$/.test(tarikh)) desk.setDate(tarikh)

    const code = params.get('benang') ?? params.get('rujukan') ?? params.get('ref')
    if (code) {
      const upper = code.toUpperCase()
      desk.setField('benang', upper)
      // A visit through someone's thread is the first stitch on their tapestry.
      if (benang.find(upper)) benang.log(upper, 'view')
    }
    // Deep links are read once, on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { cfgLoaded }
}
