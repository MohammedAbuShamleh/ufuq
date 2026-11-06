'use client'

import { Children, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** How much a card shrinks, and how far it darkens, for each card that lands on it. */
const SHRINK = 0.03
const DARKEN = 0.22

/**
 * The rules as a deck: with motion each card sticks (approach.css) and the next
 * one slides over it. A card sinks back a little for every card that lands on
 * it, so the stack reads as depth rather than boxes piling up. Without motion
 * the rules stay a grid and nothing here runs.
 */
export function RuleDeck({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLOListElement>(null)
  const still = useReducedMotion()

  useEffect(() => {
    const list = ref.current
    if (!list) return
    const cards = [...list.children] as HTMLElement[]
    const deck = list.parentElement
    if (still) {
      for (const c of cards) {
        c.style.removeProperty('transform')
        c.style.removeProperty('--dim')
      }
      deck?.style.removeProperty('--deck-h')
      return
    }

    // Where each card sticks, and its height before any scaling. --deck-h is
    // the finished stack's height, which the heading beside it takes on.
    let stick: number[] = []
    let height: number[] = []
    const measure = () => {
      stick = cards.map((c) => parseFloat(getComputedStyle(c).top) || 0)
      height = cards.map((c) => c.offsetHeight)
      const last = cards.length - 1
      deck?.style.setProperty('--deck-h', `${stick[last] - stick[0] + height[last]}px`)
    }

    let raf = 0
    const update = () => {
      raf = 0
      const box = list.getBoundingClientRect()
      if (box.bottom < -innerHeight || box.top > innerHeight * 2) return
      // landed[j]: 0 while card j is below card j-1, 1 once it rests on it.
      const landed = cards.map((c, j) => {
        if (j === 0) return 0
        const span = height[j - 1] - (stick[j] - stick[j - 1])
        const covered = stick[j - 1] + height[j - 1] - c.getBoundingClientRect().top
        return span > 0 ? Math.min(1, Math.max(0, covered / span)) : 0
      })
      let depth = 0
      for (let i = cards.length - 1; i >= 0; i--) {
        cards[i].style.transform = `scale(${(1 - SHRINK * depth).toFixed(4)})`
        cards[i].style.setProperty('--dim', Math.min(2, depth) * DARKEN + '')
        depth += landed[i]
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    // Card heights change with the width and the fonts arriving (the list's
    // own size catches those); where they stick changes with the window's height.
    const onResize = () => {
      measure()
      onScroll()
    }
    const sizes = new ResizeObserver(onResize)
    sizes.observe(list)
    addEventListener('resize', onResize)
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      sizes.disconnect()
      removeEventListener('resize', onResize)
      removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [still])

  return (
    <ol ref={ref} className="apc-grid" style={{ '--n': Children.count(children) } as CSSProperties}>
      {children}
    </ol>
  )
}
