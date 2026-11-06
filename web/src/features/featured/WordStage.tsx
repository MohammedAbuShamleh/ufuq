'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * A giant word that holds still in the middle of the screen while the content
 * after it rises over it. The word is masked from the content's top edge down,
 * so it sinks behind the content instead of running into its text, and the
 * horizon lines keep showing through. Without motion it is a plain title.
 */
export function WordStage({ word, children }: { word: string; children: ReactNode }) {
  const wordRef = useRef<HTMLParagraphElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const still = useReducedMotion()

  useEffect(() => {
    const el = wordRef.current
    const sheet = sheetRef.current
    if (!el || !sheet) return
    if (still) {
      el.style.removeProperty('--edge')
      return
    }
    let raf = 0
    // --edge: how far below the word's top the content starts. Past twice the
    // word's height the mask has nothing left to hide, so it stops changing.
    const update = () => {
      raf = 0
      const edge = sheet.getBoundingClientRect().top - el.getBoundingClientRect().top
      const max = el.offsetHeight * 2
      el.style.setProperty('--edge', `${Math.max(0, Math.min(edge, max)).toFixed(1)}px`)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    update()
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [still])

  return (
    <div className="ws">
      <p ref={wordRef} className="ws-word" aria-hidden="true">
        {word}
      </p>
      <div ref={sheetRef} className="ws-sheet">
        {children}
      </div>
    </div>
  )
}
