'use client'

import { Children, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** How much a card shrinks, and how far it darkens, for each card that lands on it. */
const SHRINK = 0.03
const DARKEN = 0.22
/** The move between the deck and the grid (ms), and how much later each card sets off than the one before. */
const GLIDE = 650
const STAGGER = 35

type View = 'deck' | 'grid'

/**
 * The rules as a deck: with motion each card sticks (approach.css) and the next
 * one slides over it. A card sinks back a little for every card that lands on
 * it, so the stack reads as depth rather than boxes piling up. A button under
 * the heading lays them out as the plain grid instead, and back. Without motion
 * the rules stay a grid, the button is hidden and nothing here runs.
 */
export function RuleDeck({ head, copy, children }: { head: ReactNode; copy: { grid: string; deck: string }; children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLOListElement>(null)
  const refresh = useRef<() => void>(null)
  const glides = useRef(0)
  const still = useReducedMotion()
  const [view, setView] = useState<View>('deck')

  useEffect(() => {
    const list = ref.current
    if (!list) return
    const cards = [...list.children] as HTMLElement[]
    const deck = wrapRef.current
    if (still || view === 'grid') {
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
    refresh.current = onScroll
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
      refresh.current = null
      sizes.disconnect()
      removeEventListener('resize', onResize)
      removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [still, view])

  // Either way the section then starts at the top of the screen, as a link to
  // it lands: the grid shows whole, or the deck starts again from its first card.
  // Held in place instead, a press from the deck's last card left the grid
  // starting halfway down the screen.
  const toggle = () => {
    const wrap = wrapRef.current
    const section = wrap?.closest('section')
    if (!wrap || !section) return
    const parts = [...wrap.querySelectorAll<HTMLElement>('.ap-head2 > :not(.ap-view), .apc')]
    const from = parts.map((el) => el.getBoundingClientRect())
    flushSync(() => setView((v) => (v === 'deck' ? 'grid' : 'deck')))
    scrollBy({ top: section.getBoundingClientRect().top, behavior: 'instant' })
    if (still) return

    // .is-gliding keeps the cards opaque while they pass over one another. The
    // deck reads where its cards are on screen, so it looks again once they
    // have arrived. A press mid-glide starts a new one; only the last cleans up.
    const run = ++glides.current
    wrap.classList.add('is-gliding')
    glide(parts, from).then(() => {
      if (run !== glides.current) return
      wrap.classList.remove('is-gliding')
      refresh.current?.()
    })
  }

  return (
    <div ref={wrapRef} className="wrap ap-deck" data-view={view}>
      <div className="ap-head2">
        {head}
        {/* The visible words are the name and say what a press does, so no pressed state. */}
        <button type="button" className="ap-view" data-moves-page onClick={toggle}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            {view === 'deck' ? (
              <path d="M2.5 2.5h4.5v4.5H2.5zM9 2.5h4.5v4.5H9zM2.5 9h4.5v4.5H2.5zM9 9h4.5v4.5H9z" />
            ) : (
              <path d="M4 2.5h8M3 5h10M2.5 7.5h11v6h-11z" />
            )}
          </svg>
          <span>{view === 'deck' ? copy.grid : copy.deck}</span>
        </button>
      </div>
      <ol ref={ref} className="apc-grid" style={{ '--n': Children.count(children) } as CSSProperties}>
        {children}
      </ol>
    </div>
  )
}

/**
 * Each part sets off from where it was on screen before the switch and glides
 * to its new place. A card also starts at about its old size: scaled about its
 * top edge, the way the deck scales it, by the ratio that keeps its old area,
 * so it neither balloons nor pinches when it turns from a wide strip into a
 * tile. Heading parts keep their size and move by the edge they read from. A
 * card that was off screen rises into place rather than crossing the page.
 */
function glide(parts: HTMLElement[], from: DOMRect[]) {
  const easing = getComputedStyle(document.documentElement).getPropertyValue('--ease').trim() || 'ease'
  let k = 0
  const moves = parts.map((el, i) => {
    for (const run of el.getAnimations()) if (run.id === 'ap-glide') run.cancel()
    const a = from[i]
    const b = el.getBoundingClientRect()
    const card = el.classList.contains('apc')
    const delay = card ? k++ * STAGGER : 0
    if (!b.width || !b.height) return null

    let x = 0
    let y = a.top - b.top
    let scale = 1
    let opacity = 1
    if (a.bottom <= 0 || a.top >= innerHeight) {
      y = 40
      opacity = 0
    } else if (card) {
      x = a.left + a.width / 2 - (b.left + b.width / 2)
      scale = Math.sqrt((a.width / b.width) * (a.height / b.height))
    } else {
      x = getComputedStyle(el).direction === 'rtl' ? a.right - b.right : a.left - b.left
    }
    if (Math.abs(x) < 0.5 && Math.abs(y) < 0.5 && Math.abs(scale - 1) < 0.005 && opacity === 1) return null

    const move = el.animate(
      [
        { translate: `${x}px ${y}px`, scale: `${scale}`, opacity, transformOrigin: '50% 0' },
        { translate: '0px 0px', scale: '1', opacity: 1, transformOrigin: '50% 0' },
      ],
      { duration: GLIDE, delay, easing, fill: 'backwards' },
    )
    move.id = 'ap-glide'
    return move.finished.catch(() => {})
  })
  return Promise.all(moves)
}
