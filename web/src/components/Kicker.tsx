'use client'

import { useRef, type ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'
import './kicker.css'

/** The small label over a heading; its rule draws in when it scrolls into view. */
export function Kicker({ children, className = '', still = false }: { children: ReactNode; className?: string; still?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { threshold: 0.6, once: true })
  const motion = still ? '' : seen ? 'kp kin' : 'kp'

  return (
    <div ref={ref} className={`kicker ${motion} ${className}`.trim()}>
      {children}
    </div>
  )
}
