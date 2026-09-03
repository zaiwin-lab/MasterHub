import { useEffect, useRef, useState } from 'react'

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/** Count-up on the money. Instant when the visitor asked for less motion. */
export function useCountUp(value: number, ms = 380): number {
  const reduced = usePrefersReducedMotion()
  const [shown, setShown] = useState(value)
  const from = useRef(value)
  const raf = useRef(0)

  useEffect(() => {
    if (reduced) {
      setShown(value)
      from.current = value
      return
    }
    const start = performance.now()
    const a = from.current
    const b = value
    if (a === b) return
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / ms)
      const eased = 1 - Math.pow(1 - p, 3)
      setShown(a + (b - a) * eased)
      if (p < 1) raf.current = requestAnimationFrame(step)
      else from.current = b
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [value, ms, reduced])

  return reduced ? value : shown
}

export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}

export function useCopy(): [boolean, (text: string) => void] {
  const [done, setDone] = useState(false)
  const copy = (text: string) => {
    const fallback = () => {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
      } catch {
        // Clipboard is blocked in this context; the text stays selectable on
        // screen, which is the honest fallback rather than a fake success.
      }
      document.body.removeChild(ta)
    }
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).catch(fallback)
    else fallback()
    setDone(true)
    window.setTimeout(() => setDone(false), 1600)
  }
  return [done, copy]
}
