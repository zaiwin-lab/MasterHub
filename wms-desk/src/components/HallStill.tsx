import { useEffect, useState } from 'react'
import { useLang } from '../store/useLang'
import { VENUE } from '../lib/venue'

const CANDIDATES = ['/images/hero-exterior.jpg', '/images/hall-banquet.jpg', '/images/hero-dusk.jpg']

/**
 * One still, not a slideshow. If no venue photography has been dropped into
 * /public/images, fall back to a line drawing of the tengkolok roof rather
 * than generic wedding stock.
 */
export function HallStill({ src, className }: { src?: string; className?: string }) {
  const { lang } = useLang()
  const [ok, setOk] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    const list = src ? [src, ...CANDIDATES] : CANDIDATES
    const tryNext = (i: number) => {
      if (!alive || i >= list.length) return
      const img = new Image()
      img.onload = () => alive && setOk(list[i])
      img.onerror = () => tryNext(i + 1)
      img.src = list[i]
    }
    tryNext(0)
    return () => {
      alive = false
    }
  }, [src])

  if (ok) {
    return (
      <figure className={className}>
        <img
          src={ok}
          alt={VENUE.building}
          className="w-full h-auto object-cover border border-ink/15"
          style={{ aspectRatio: '4 / 3' }}
        />
        <figcaption className="mt-1.5 text-[11.5px] text-inksoft">
          {VENUE.building}, Petra Jaya
        </figcaption>
      </figure>
    )
  }

  return (
    <figure className={className}>
      <div className="border border-ink/15 bg-paper2/50" style={{ aspectRatio: '4 / 3' }}>
        <TengkolokLine />
      </div>
      <figcaption className="mt-1.5 text-[11.5px] text-inksoft">
        {lang === 'bm'
          ? `${VENUE.building} — bumbung berinspirasikan tengkolok`
          : `${VENUE.building} — a tengkolok-inspired roofline`}
      </figcaption>
    </figure>
  )
}

function TengkolokLine() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full h-full"
      role="img"
      aria-label="Wisma Melayu Sarawak"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* One continuous sweep: a broad roof that lifts to an upswept tip on the
          right, the way a tengkolok's fold sits over the crown. */}
      <g fill="none" stroke="#1A1714" strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M62 196 C 106 152, 158 112, 212 103 C 236 99, 252 94, 262 84 C 288 114, 314 154, 338 196"
          strokeWidth="1.6"
        />
        <path
          d="M92 196 C 128 162, 170 130, 214 122 C 232 119, 246 114, 254 106"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
      </g>

      {/* Colonnade sits directly under the eave — nothing floats. */}
      <g fill="none" stroke="#1A1714" strokeLinecap="square">
        <path d="M56 196 h288" strokeWidth="1.6" />
        <g strokeWidth="1" strokeOpacity="0.22">
          <path d="M92 196 v54 M133 196 v54 M174 196 v54 M215 196 v54 M256 196 v54 M297 196 v54" />
        </g>
        <path d="M70 250 h260" strokeWidth="1" strokeOpacity="0.4" />
        <path d="M56 262 h288" strokeWidth="1.6" />
      </g>

      {/* One copper accent: the finial at the tip. */}
      <g stroke="#B08A4F" fill="none" strokeWidth="1.2">
        <path d="M262 84 v-16" />
        <circle cx="262" cy="62" r="4.5" />
      </g>
    </svg>
  )
}
