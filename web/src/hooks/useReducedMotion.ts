'use client'

import { useSyncExternalStore } from 'react'
import { isMotionOff, MOTION_EVENT } from '@/lib/motion'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  const mq = matchMedia(QUERY)
  mq.addEventListener('change', onChange)
  addEventListener(MOTION_EVENT, onChange)
  return () => {
    mq.removeEventListener('change', onChange)
    removeEventListener(MOTION_EVENT, onChange)
  }
}

const snapshot = () => matchMedia(QUERY).matches || isMotionOff()

/**
 * True when the system asks for less motion or the visitor pressed «إيقاف الحركة».
 * Scroll effects, auto-rotation and video playback all stop on it.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, snapshot, () => false)
}
