'use client'

import { useEffect, useState, type RefObject } from 'react'

type Options = {
  threshold?: number
  rootMargin?: string
  /** Stop watching after the first time it shows (reveals). */
  once?: boolean
}

export function useInView(ref: RefObject<Element | null>, { threshold = 0, rootMargin, once = false }: Options = {}) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (once && entry.isIntersecting) io.disconnect()
      },
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold, rootMargin, once])

  return inView
}
