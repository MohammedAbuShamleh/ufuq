'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { isMotionOff, MOTION_EVENT, MOTION_KEY } from '@/lib/motion'

function subscribe(onChange: () => void) {
  addEventListener(MOTION_EVENT, onChange)
  return () => removeEventListener(MOTION_EVENT, onChange)
}

/** The «إيقاف الحركة» switch: a class on <html>, remembered in localStorage. */
export function useMotionToggle() {
  const off = useSyncExternalStore(subscribe, isMotionOff, () => false)

  const toggle = useCallback(() => {
    const next = !isMotionOff()
    document.documentElement.classList.toggle('motion-off', next)
    try {
      localStorage.setItem(MOTION_KEY, next ? 'off' : 'on')
    } catch {
      // Storage blocked: the choice still holds until the tab closes.
    }
    dispatchEvent(new Event(MOTION_EVENT))
  }, [])

  return { off, toggle }
}
