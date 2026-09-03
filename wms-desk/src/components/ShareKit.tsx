import { useEffect, useRef, useState } from 'react'
import { useLang } from '../store/useLang'
import { t } from '../lib/i18n'
import { drawQr } from '../lib/qr'
import { REFERRAL_CAP, REFERRAL_RATE } from '../lib/quote'
import { VENUE } from '../lib/venue'
import { useCopy } from '../hooks'
import { rm } from '../lib/format'

type Ratio = '9:16' | '1:1' | '4:5'

const SIZES: Record<Ratio, [number, number]> = {
  '9:16': [1080, 1920],
  '1:1': [1080, 1080],
  '4:5': [1080, 1350],
}

export function ShareKit({ code, name }: { code: string; name: string }) {
  const { lang } = useLang()
  const [ratio, setRatio] = useState<Ratio>('9:16')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copiedUrl, copyUrl] = useCopy()
  const [copiedCode, copyCode] = useCopy()

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const giftUrl = `${origin}/b/${code}`
  const deskUrl = `${origin}/tempah?benang=${code}`

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const [w, h] = SIZES[ratio]
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pad = Math.round(w * 0.09)

    ctx.fillStyle = '#F7F4EE'
    ctx.fillRect(0, 0, w, h)

    // Frame hairline
    ctx.strokeStyle = 'rgba(26,23,20,0.18)'
    ctx.lineWidth = 2
    ctx.strokeRect(pad * 0.45, pad * 0.45, w - pad * 0.9, h - pad * 0.9)

    ctx.fillStyle = '#5A534A'
    ctx.font = `${Math.round(w * 0.028)}px "Schibsted Grotesk", system-ui, sans-serif`
    ctx.textAlign = 'left'
    ctx.fillText(lang === 'bm' ? 'BENANG EMAS' : 'BENANG EMAS', pad, pad + w * 0.03)

    // Names
    ctx.fillStyle = '#1A1714'
    const nameSize = Math.round(w * (name.length > 22 ? 0.072 : 0.092))
    ctx.font = `italic ${nameSize}px Newsreader, Georgia, serif`
    wrap(ctx, name, pad, pad + h * (ratio === '1:1' ? 0.19 : 0.16), w - pad * 2, nameSize * 1.16)

    // Copper rule — one line, used as a tool
    const ruleY = pad + h * (ratio === '1:1' ? 0.3 : 0.27)
    ctx.strokeStyle = '#B08A4F'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(pad, ruleY)
    ctx.lineTo(pad + w * 0.18, ruleY)
    ctx.stroke()

    // Invitation line
    ctx.fillStyle = '#1A1714'
    const bodySize = Math.round(w * 0.038)
    ctx.font = `${bodySize}px "Schibsted Grotesk", system-ui, sans-serif`
    const invite =
      lang === 'bm'
        ? `menjemput anda tempah ${VENUE.hall}, Petra Jaya.`
        : `invites you to book ${VENUE.hall}, Petra Jaya.`
    wrap(ctx, invite, pad, ruleY + bodySize * 1.9, w - pad * 2, bodySize * 1.42)

    // The offer, stated as an amount — never as a campaign percentage badge
    ctx.fillStyle = '#8E6A32'
    ctx.font = `${Math.round(w * 0.042)}px "Schibsted Grotesk", system-ui, sans-serif`
    const offerY = ruleY + h * (ratio === '9:16' ? 0.14 : 0.16)
    ctx.fillText(
      lang === 'bm'
        ? `Potongan ${REFERRAL_RATE * 100}% · had ${rm(REFERRAL_CAP, lang)}`
        : `${REFERRAL_RATE * 100}% off · capped at ${rm(REFERRAL_CAP, lang)}`,
      pad,
      offerY,
    )

    // QR of the gift URL
    const qrSize = Math.round(w * 0.3)
    const qrX = pad
    const qrY = h - pad - qrSize - Math.round(h * 0.055)
    ctx.strokeStyle = 'rgba(26,23,20,0.2)'
    ctx.lineWidth = 2
    ctx.strokeRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16)
    drawQr(ctx, giftUrl, qrX, qrY, qrSize)

    // Code + wordmark
    ctx.fillStyle = '#1A1714'
    ctx.font = `${Math.round(w * 0.05)}px "Schibsted Grotesk", system-ui, sans-serif`
    ctx.fillText(code, qrX + qrSize + Math.round(w * 0.06), qrY + qrSize * 0.44)
    ctx.fillStyle = '#5A534A'
    ctx.font = `${Math.round(w * 0.026)}px "Schibsted Grotesk", system-ui, sans-serif`
    ctx.fillText(
      lang === 'bm' ? 'Imbas atau taip kod ini' : 'Scan or type this code',
      qrX + qrSize + Math.round(w * 0.06),
      qrY + qrSize * 0.44 + Math.round(w * 0.045),
    )

    ctx.fillStyle = '#5A534A'
    ctx.font = `${Math.round(w * 0.024)}px "Schibsted Grotesk", system-ui, sans-serif`
    ctx.fillText('Yayasan Budaya Melayu Sarawak · YBMS', pad, h - pad * 0.75)
  }, [ratio, code, name, lang, giftUrl])

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.download = `benang-${code}-${ratio.replace(':', 'x')}.png`
    a.href = canvas.toDataURL('image/png')
    a.click()
  }

  const waText =
    lang === 'bm'
      ? `${name} menjemput anda tempah ${VENUE.hall}.\n\nGuna kod ${code} untuk potongan ${
          REFERRAL_RATE * 100
        }% (had ${rm(REFERRAL_CAP, lang)}).\n${giftUrl}`
      : `${name} invites you to book ${VENUE.hall}.\n\nUse code ${code} for ${
          REFERRAL_RATE * 100
        }% off (capped at ${rm(REFERRAL_CAP, lang)}).\n${giftUrl}`

  const btn =
    'ctl min-h-[44px] px-3 border border-ink/25 hover:border-ink text-[13px] transition-colors duration-150'

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(SIZES) as Ratio[]).map((r) => (
          <button
            key={r}
            onClick={() => setRatio(r)}
            aria-pressed={ratio === r}
            className={`ctl min-h-[40px] px-3 border text-[13px] tnum transition-colors duration-150 ${
              ratio === r ? 'border-ink bg-ink text-paper' : 'border-ink/25 hover:border-ink'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="mt-3 max-w-[280px]">
        <canvas ref={canvasRef} className="w-full h-auto border border-ink/15" />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(waText)}`}
          target="_blank"
          rel="noreferrer"
          className="ctl min-h-[44px] px-3 bg-ink text-paper text-[13px] inline-flex items-center hover:bg-black transition-colors duration-150"
        >
          WhatsApp
        </a>
        <button onClick={() => copyUrl(giftUrl)} className={btn}>
          {copiedUrl ? t('copied', lang) : lang === 'bm' ? 'Salin pautan hadiah' : 'Copy gift link'}
        </button>
        <button onClick={() => copyCode(code)} className={btn}>
          {copiedCode ? t('copied', lang) : lang === 'bm' ? 'Salin kod' : 'Copy code'}
        </button>
        <button onClick={download} className={btn}>
          {lang === 'bm' ? 'Muat turun' : 'Download'}
        </button>
      </div>

      <dl className="mt-3 text-[12px] text-inksoft grid gap-1">
        <div className="flex gap-2">
          <dt className="shrink-0">{lang === 'bm' ? 'Pautan hadiah' : 'Gift link'}:</dt>
          <dd className="truncate text-ink">{giftUrl}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0">{lang === 'bm' ? 'Pautan desk' : 'Desk link'}:</dt>
          <dd className="truncate text-ink">{deskUrl}</dd>
        </div>
      </dl>
    </div>
  )
}

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ')
  let line = ''
  let cursor = y
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cursor)
      line = w
      cursor += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, cursor)
}
