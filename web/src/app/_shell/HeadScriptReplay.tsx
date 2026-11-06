'use client'

import { useLayoutEffect } from 'react'
import { MOTION_EVENT, MOTION_SCRIPT } from '@/lib/motion'
import { THEME_SCRIPT } from '@/lib/theme'

/**
 * Runs the layout's head script when the browser, not the server, drew the
 * page. That happens on a 404: Next answers a thrown notFound() with an empty
 * shell and the page is built in the browser, where a script React inserts
 * never runs. Without this a saved theme and «إيقاف الحركة» would be ignored.
 * The `js` class shows the head script already ran, so a normal page skips it.
 */
export function HeadScriptReplay() {
  useLayoutEffect(() => {
    if (document.documentElement.classList.contains('js')) return
    const script = document.createElement('script')
    script.text = THEME_SCRIPT + MOTION_SCRIPT
    document.head.append(script)
    script.remove()
    dispatchEvent(new Event(MOTION_EVENT))
  }, [])
  return null
}
