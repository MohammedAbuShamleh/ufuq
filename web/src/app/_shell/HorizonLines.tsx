'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** "#4e4c34" → "78,76,52", for rgba() in canvas gradients. */
const channels = (hex: string) => {
  const n = parseInt(hex.trim().replace('#', ''), 16)
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`
}

/**
 * Slow wave lines behind the page, in the horizon colors of the current mode.
 * They wait until the browser is idle, so the first screen paints without
 * them, then fade in. On a desktop they move at ~30fps; on phones and touch
 * screens they are drawn once and stay still, as they do when the tab is
 * hidden or motion is stopped.
 */
export function HorizonLines() {
  const ref = useRef<HTMLCanvasElement>(null)
  const still = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const dpr = Math.min(devicePixelRatio || 1, 2)
    const moving = !still && matchMedia('(pointer: fine)').matches && innerWidth >= 700
    const t0 = performance.now()
    let w = 0
    let h = 0
    let a = ''
    let b = ''
    let last = 0
    let raf = 0

    const readColors = () => {
      const css = getComputedStyle(document.documentElement)
      a = channels(css.getPropertyValue('--horizon-a'))
      b = channels(css.getPropertyValue('--horizon-b'))
    }

    const draw = (now: number) => {
      const t = (now - t0) / 1000
      const lines = w < 700 ? 5 : 7
      const drift = scrollY * 0.00035
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < lines; i++) {
        const k = i / (lines - 1)
        const base = h * (0.4 + k * 0.52)
        const amp = 8 + k * 34
        const f1 = 0.0015 + 0.0006 * (1 - k)
        const f2 = 0.0039 - 0.001 * k
        const speed = 0.08 + 0.06 * k
        const alpha = 0.075 + k * 0.09
        const g = ctx.createLinearGradient(0, 0, w, 0)
        g.addColorStop(0, `rgba(${a},${(alpha * 0.35).toFixed(3)})`)
        g.addColorStop(0.5, `rgba(${b},${alpha.toFixed(3)})`)
        g.addColorStop(1, `rgba(${a},${(alpha * 0.35).toFixed(3)})`)
        ctx.strokeStyle = g
        ctx.lineWidth = 1
        ctx.beginPath()
        for (let x = 0; x <= w + 8; x += 8) {
          const y =
            base + Math.sin(x * f1 + t * speed + i * 1.7 + drift * (1 + k * 2)) * amp + Math.sin(x * f2 - t * speed * 0.7 + i) * amp * 0.35
          if (x) ctx.lineTo(x, y)
          else ctx.moveTo(x, y)
        }
        ctx.stroke()
      }
    }

    const loop = (now: number) => {
      if (now - last > 33) {
        draw(now)
        last = now
      }
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      cancelAnimationFrame(raf)
      if (moving && !document.hidden) raf = requestAnimationFrame(loop)
    }

    const size = () => {
      w = innerWidth
      h = innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(performance.now())
    }
    const repaint = () => {
      readColors()
      draw(performance.now())
    }

    const begin = () => {
      readColors()
      size()
      canvas.classList.add('on')
      start()
      addEventListener('resize', size)
      document.addEventListener('visibilitychange', start)
    }
    // Safari has no requestIdleCallback; a short timeout stands in for it.
    const hasIdle = typeof window.requestIdleCallback === 'function'
    const idle = hasIdle ? requestIdleCallback(begin, { timeout: 2500 }) : window.setTimeout(begin, 1200)
    const themeWatch = new MutationObserver(repaint)
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    const scheme = matchMedia('(prefers-color-scheme: dark)')
    scheme.addEventListener('change', repaint)

    return () => {
      if (hasIdle) cancelIdleCallback(idle)
      else clearTimeout(idle)
      cancelAnimationFrame(raf)
      removeEventListener('resize', size)
      document.removeEventListener('visibilitychange', start)
      themeWatch.disconnect()
      scheme.removeEventListener('change', repaint)
    }
  }, [still])

  return <canvas ref={ref} id="hz" aria-hidden="true" />
}
