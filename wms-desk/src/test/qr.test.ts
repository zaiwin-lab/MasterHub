import { describe, expect, it } from 'vitest'
import jsQR from 'jsqr'
import { qrMatrix } from '../lib/qr'

/** Encode, rasterise with a quiet zone, and decode — the QR must survive a scan. */
function roundTrip(text: string): string | null {
  const m = qrMatrix(text)
  const quiet = 4
  const scale = 4
  const n = m.length
  const side = (n + quiet * 2) * scale
  const data = new Uint8ClampedArray(side * side * 4).fill(255)
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!m[r][c]) continue
      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          const px = ((r + quiet) * scale + dy) * side + ((c + quiet) * scale + dx)
          data[px * 4] = 0
          data[px * 4 + 1] = 0
          data[px * 4 + 2] = 0
        }
      }
    }
  }
  return jsQR(data, side, side)?.data ?? null
}

describe('share-kit QR', () => {
  it('round-trips a gift URL', () => {
    const url = 'https://wmsdesk.example/b/WMS-AINA'
    expect(roundTrip(url)).toBe(url)
  })

  it('round-trips a long origin', () => {
    const url = 'https://dewan-wisma-melayu-sarawak.netlify.app/b/WMS-K7QP'
    expect(roundTrip(url)).toBe(url)
  })
})
