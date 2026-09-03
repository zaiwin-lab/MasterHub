import { useEffect, useMemo, useRef, useState } from 'react'
import { useLang } from '../store/useLang'
import { useBenang } from '../store/useBenang'
import { t } from '../lib/i18n'
import { rm } from '../lib/format'
import { TIERS, creditFor, nextTier, type BenangEvent } from '../lib/referral'
import { usePrefersReducedMotion } from '../hooks'

function verb(e: BenangEvent, lang: 'bm' | 'en') {
  const map = {
    view: { bm: 'membuka benang', en: 'opened a thread' },
    draft: { bm: 'menyusun draf', en: 'started a draft' },
    hold: { bm: 'menahan tarikh', en: 'held a date' },
    confirm: { bm: 'majlis disahkan', en: 'booking confirmed' },
  }
  return map[e.kind][lang]
}

function ago(at: number, lang: 'bm' | 'en') {
  const mins = Math.max(1, Math.round((Date.now() - at) / 60000))
  if (mins < 60) return lang === 'bm' ? `${mins} min lalu` : `${mins} min ago`
  const h = Math.round(mins / 60)
  if (h < 24) return lang === 'bm' ? `${h} jam lalu` : `${h}h ago`
  const d = Math.round(h / 24)
  return lang === 'bm' ? `${d} hari lalu` : `${d}d ago`
}

/** Three anonymised events, quiet. Shares the same bus as the tapestry. */
export function BenangTicker() {
  const { lang } = useLang()
  const benang = useBenang()
  const rows = benang.recent(3)

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[12px] uppercase tracking-[0.16em] text-inksoft">
          {t('benangTitle', lang)}
        </span>
        <span className="text-[12px] text-inksoft">{t('benangTag', lang)}</span>
      </div>
      <ul className="mt-2 border-t border-ink/12">
        {rows.map((e) => (
          <li
            key={e.id}
            className="py-2 border-b border-ink/12 flex items-baseline gap-2 text-[12.5px]"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                e.kind === 'confirm'
                  ? 'bg-confirmed'
                  : e.kind === 'hold'
                    ? 'bg-hold'
                    : 'bg-ink/25'
              }`}
              aria-hidden="true"
            />
            <span className="text-ink truncate">{e.who ?? e.code}</span>
            <span className="text-inksoft truncate">{verb(e, lang)}</span>
            <span className="ml-auto shrink-0 text-inksoft tnum">{ago(e.at, lang)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------------------------------------------------------------- Tapestry */

type Node = { id: string; kind: BenangEvent['kind']; who: string; x: number; y: number }

export function Tapestry({ code }: { code: string }) {
  const { lang } = useLang()
  const benang = useBenang()
  const reduced = usePrefersReducedMotion()
  const events = benang.events.filter((e) => e.code === code.toUpperCase())

  const nodes: Node[] = useMemo(() => {
    // One node per referred party; the strongest state they reached wins.
    const byWho = new Map<string, BenangEvent>()
    const rank = { view: 0, draft: 1, hold: 2, confirm: 3 }
    for (const e of events) {
      const key = e.holdRef ?? e.who ?? e.id
      const prev = byWho.get(key)
      if (!prev || rank[e.kind] >= rank[prev.kind]) byWho.set(key, e)
    }
    const list = [...byWho.values()].slice(-10)
    const n = Math.max(6, list.length)
    return list.map((e, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2
      const radius = 78 + (i % 3) * 16
      return {
        id: e.id,
        kind: e.kind,
        who: e.who ?? (lang === 'bm' ? 'Tetamu' : 'Visitor'),
        x: 160 + Math.cos(angle) * radius,
        y: 130 + Math.sin(angle) * radius * 0.82,
      }
    })
  }, [events, lang])

  const stroke = (k: BenangEvent['kind']) =>
    k === 'confirm' ? '#B08A4F' : k === 'hold' ? '#C45C26' : '#1A1714'

  return (
    <svg viewBox="0 0 320 260" className="w-full h-auto" role="img" aria-label={`Benang ${code}`}>
      {nodes.map((n, i) => (
        <line
          key={`l${n.id}`}
          x1="160"
          y1="130"
          x2={n.x}
          y2={n.y}
          stroke={stroke(n.kind)}
          strokeOpacity={n.kind === 'view' ? 0.18 : n.kind === 'draft' ? 0.4 : 0.85}
          strokeWidth={n.kind === 'confirm' ? 1.6 : 1}
          strokeDasharray={n.kind === 'draft' ? '3 4' : undefined}
          className={n.kind === 'confirm' && !reduced ? 'stitch' : undefined}
          style={{ animationDelay: `${i * 60}ms` }}
        />
      ))}

      {nodes.map((n) => (
        <g key={n.id}>
          <circle
            cx={n.x}
            cy={n.y}
            r={n.kind === 'confirm' ? 5 : 4}
            fill={n.kind === 'confirm' ? '#B08A4F' : n.kind === 'hold' ? '#C45C26' : 'none'}
            fillOpacity={n.kind === 'confirm' ? 1 : 0.9}
            stroke={stroke(n.kind)}
            strokeOpacity={n.kind === 'view' ? 0.35 : 1}
            className={n.kind === 'hold' && !reduced ? 'pulse-hold' : undefined}
          />
          <text
            x={n.x}
            y={n.y - 9}
            textAnchor="middle"
            fontSize="7.5"
            fill="#5A534A"
            fontFamily="Schibsted Grotesk, sans-serif"
          >
            {n.who}
          </text>
        </g>
      ))}

      <circle cx="160" cy="130" r="26" fill="#F7F4EE" stroke="#1A1714" />
      <text
        x="160"
        y="128"
        textAnchor="middle"
        fontSize="10"
        fill="#1A1714"
        fontFamily="Newsreader, serif"
      >
        {code.replace(/^(WMS|YBMS)-/, '')}
      </text>
      <text
        x="160"
        y="140"
        textAnchor="middle"
        fontSize="7"
        fill="#5A534A"
        fontFamily="Schibsted Grotesk, sans-serif"
      >
        duta
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ Ledger */

export function Ledger({ code }: { code: string }) {
  const { lang } = useLang()
  const benang = useBenang()
  const rows = benang.ledgerOf(code)
  const { credit, confirmed } = benang.creditOf(code)
  const next = nextTier(confirmed)

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[12px] uppercase tracking-[0.16em] text-inksoft">
          {t('ledger', lang)}
        </span>
        <span className="tnum display text-[22px]">{rm(credit, lang)}</span>
      </div>

      <div className="mt-2 border-t border-ink/12">
        {rows.length === 0 && (
          <p className="py-3 text-[13px] text-inksoft">
            {lang === 'bm'
              ? 'Belum ada majlis disahkan. Kredit terbuka selepas kakitangan sahkan.'
              : 'No confirmed bookings yet. Credit unlocks once staff confirm one.'}
          </p>
        )}
        {rows.map((r, i) => (
          <div
            key={`${r.at}-${i}`}
            className="py-2 border-b border-ink/12 flex items-baseline gap-3 text-[13px]"
          >
            <span className="tnum text-inksoft shrink-0">{i + 1}</span>
            <span className="truncate">{r.who}</span>
            {r.amount > 0 ? (
              <span className="ml-auto shrink-0 tnum text-confirmed">+ {rm(r.amount, lang)}</span>
            ) : (
              // Credit is a tier ladder, so a confirmation between rungs adds
              // nothing yet. Say that, rather than printing "+ RM 0".
              <span className="ml-auto shrink-0 text-[11.5px] text-inksoft">
                {lang === 'bm' ? 'menuju tahap seterusnya' : 'counts toward the next tier'}
              </span>
            )}
          </div>
        ))}
      </div>

      <TierBar confirmed={confirmed} />

      {next && (
        <p className="mt-2 text-[12.5px] text-inksoft">
          {lang === 'bm'
            ? `${next.confirmed - confirmed} lagi disahkan → ${
                next.perkBm === '—' ? rm(next.credit, lang) : next.perkBm
              }`
            : `${next.confirmed - confirmed} more confirmed → ${
                next.perkEn === '—' ? rm(next.credit, lang) : next.perkEn
              }`}
        </p>
      )}
    </div>
  )
}

export function TierBar({ confirmed }: { confirmed: number }) {
  const { lang } = useLang()
  const max = TIERS[TIERS.length - 1].confirmed
  const pct = Math.min(1, confirmed / max)

  return (
    <div className="mt-3">
      <div className="relative h-[2px] bg-ink/15">
        <div
          className="absolute inset-y-0 left-0 bg-copper"
          style={{ width: `${pct * 100}%`, transition: 'width 200ms cubic-bezier(0.2,0.8,0.2,1)' }}
        />
        {TIERS.map((tier) => (
          <span
            key={tier.confirmed}
            className={`absolute -top-[3px] h-2 w-2 rounded-full -translate-x-1/2 ${
              confirmed >= tier.confirmed ? 'bg-copperhot' : 'bg-ink/25'
            }`}
            style={{ left: `${(tier.confirmed / max) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-inksoft tnum">
        {TIERS.map((tier) => (
          <span key={tier.confirmed} className={confirmed >= tier.confirmed ? 'text-copperhot' : ''}>
            {tier.confirmed} · {rm(tier.credit, lang)}
          </span>
        ))}
      </div>
      <ul className="mt-2 space-y-0.5 text-[12px] text-inksoft">
        {TIERS.filter((x) => (lang === 'bm' ? x.perkBm : x.perkEn) !== '—').map((tier) => (
          <li key={tier.confirmed} className={confirmed >= tier.confirmed ? 'text-confirmed' : ''}>
            {tier.confirmed}+ · {lang === 'bm' ? tier.perkBm : tier.perkEn}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function creditSummary(confirmed: number) {
  return creditFor(confirmed)
}

/* --------------------------------------------------------------- Presence */

export function Presence({ code }: { code: string }) {
  const { lang } = useLang()
  const benang = useBenang()
  const n = benang.presence[code.toUpperCase()] ?? 0
  const ref = useRef<HTMLSpanElement>(null)
  const [bump, setBump] = useState(false)

  useEffect(() => {
    setBump(true)
    const id = window.setTimeout(() => setBump(false), 240)
    return () => window.clearTimeout(id)
  }, [n])

  return (
    <span ref={ref} className={`text-[12px] text-inksoft tnum ${bump ? 'rise' : ''}`}>
      {n} {t('presence', lang)}
    </span>
  )
}
