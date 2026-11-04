'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const STACKS = '(min-width: 961px) and (min-height: 560px)'

/**
 * The featured cards stick one over another. Each card's sticky top is set
 * from its own height so a tall card is never cut off, and the card being
 * covered shrinks and dims as the next one rises over it.
 */
export function FeaturedStack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const still = useReducedMotion()

  // Screens settle into place the first time a card shows.
  useEffect(() => {
    const cards = [...(ref.current?.querySelectorAll<HTMLElement>('.feat') ?? [])]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('seen')
          io.unobserve(e.target)
        }
      },
      { threshold: 0.15 },
    )
    cards.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const cards = [...(ref.current?.querySelectorAll<HTMLElement>('.feat') ?? [])]
    const mq = matchMedia(STACKS)
    let tops: number[] = []
    let raf = 0

    const reset = () => cards.forEach((c) => ((c.style.transform = ''), (c.style.filter = '')))
    const measure = () => {
      tops = cards.map((c, i) => {
        const top = Math.min(88 + i * 14, innerHeight - c.offsetHeight - 16)
        c.style.setProperty('--st', `${top}px`)
        return top
      })
    }
    const update = () => {
      raf = 0
      if (still || !mq.matches) return reset()
      cards.forEach((card, i) => {
        const next = cards[i + 1]
        if (!next) return
        const p = Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - tops[i]) / card.offsetHeight))
        card.style.transform = `scale(${(1 - p * 0.06).toFixed(4)})`
        card.style.filter = `brightness(${(1 - p * 0.28).toFixed(3)})`
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const onResize = () => {
      measure()
      update()
    }

    cards.forEach((c, i) => c.style.setProperty('--i', String(i)))
    onResize()
    // Screens load after first layout and change the cards' heights.
    const resized = new ResizeObserver(onResize)
    cards.forEach((c) => resized.observe(c))
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onResize)
    return () => {
      resized.disconnect()
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
      reset()
    }
  }, [still])

  // A slight 3D turn of the screens toward the pointer.
  useEffect(() => {
    if (still || !matchMedia('(hover: hover)').matches) return
    const cards = [...(ref.current?.querySelectorAll<HTMLElement>('.feat') ?? [])]
    const off = cards.map((card) => {
      const visual = card.querySelector<HTMLElement>('.feat-visual')
      if (!visual) return () => {}
      let raf = 0
      const move = (e: MouseEvent) => {
        const r = card.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => (visual.style.transform = `perspective(1400px) rotateY(${x * 7}deg) rotateX(${-y * 5}deg)`))
      }
      const leave = () => {
        cancelAnimationFrame(raf)
        visual.style.transform = ''
      }
      card.addEventListener('mousemove', move)
      card.addEventListener('mouseleave', leave)
      return () => {
        card.removeEventListener('mousemove', move)
        card.removeEventListener('mouseleave', leave)
        leave()
      }
    })
    return () => off.forEach((f) => f())
  }, [still])

  return (
    <div ref={ref} className="feats">
      {children}
    </div>
  )
}
