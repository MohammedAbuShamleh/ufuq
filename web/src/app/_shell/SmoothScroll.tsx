'use client'

import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useEffect, useSyncExternalStore } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const MOUSE = '(hover: hover) and (pointer: fine)'

function subscribeMouse(onChange: () => void) {
  const mq = matchMedia(MOUSE)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

/**
 * Wheel and trackpad scrolling ease to a stop instead of stepping (Lenis,
 * lerp 0.1: about nine tenths of the way in 0.4s). Touch screens keep their
 * own scrolling; reduced motion and «إيقاف الحركة» turn it off. The page still
 * scrolls natively underneath, so sticky sections, scroll listeners and the
 * browser's own smooth jump to a section link all work as before.
 */
export function SmoothScroll() {
  const still = useReducedMotion()
  const mouse = useSyncExternalStore(subscribeMouse, () => matchMedia(MOUSE).matches, () => false)

  useEffect(() => {
    if (still || !mouse) return
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      stopInertiaOnNavigate: true,
      // The screen viewer is a modal: wheel over it behaves as the browser decides.
      prevent: (node) => node instanceof HTMLDialogElement,
    })
    // A section link hands the scroll to the browser's smooth jump, and a
    // control marked data-moves-page sets the scroll itself; any glide still
    // running from the wheel stops first so the two never pull against each other.
    // (stop and start in one go: the only public way to drop the glide.)
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element | null)?.closest?.('a[href*="#"], [data-moves-page]')) return
      lenis.stop()
      lenis.start()
    }
    addEventListener('click', onClick, true)
    return () => {
      removeEventListener('click', onClick, true)
      lenis.destroy()
    }
  }, [still, mouse])

  return null
}
