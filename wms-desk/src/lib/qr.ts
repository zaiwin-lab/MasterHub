import qrcode from 'qrcode-generator'

/** Boolean module grid for a payload. Type 0 = auto-fit, EC level M. */
export function qrMatrix(text: string): boolean[][] {
  const qr = qrcode(0, 'M')
  qr.addData(text)
  qr.make()
  const n = qr.getModuleCount()
  return Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => qr.isDark(r, c)),
  )
}

/** Draws the grid into a canvas context as crisp ink squares on paper. */
export function drawQr(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  ink = '#1A1714',
  paper = '#F7F4EE',
) {
  const m = qrMatrix(text)
  const n = m.length
  const cell = size / n
  ctx.fillStyle = paper
  ctx.fillRect(x, y, size, size)
  ctx.fillStyle = ink
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (m[r][c]) ctx.fillRect(x + c * cell, y + r * cell, Math.ceil(cell), Math.ceil(cell))
    }
  }
}
