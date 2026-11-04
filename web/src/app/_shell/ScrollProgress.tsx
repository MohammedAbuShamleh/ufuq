'use client'

import { useEffect, useRef } from 'react'

/** The thin bar at the very top that fills as the page is read. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const h = document.documentElement.scrollHeight - innerHeight
      ref.current?.style.setProperty('--sp', (h > 0 ? scrollY / h : 0).toFixed(4))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} className="sprog" aria-hidden="true">
      <i />
    </div>
  )
}
