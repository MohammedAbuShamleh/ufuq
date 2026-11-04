'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useInView } from '@/hooks/useInView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { arNum } from '@/lib/format'

/** A test run: the dots turn green one by one while the count climbs to the total. */
export function TestsGrid({ total }: { total: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const run = useInView(ref, { threshold: 0.8, once: true })
  const still = useReducedMotion()
  const [passed, setPassed] = useState(0)

  useEffect(() => {
    if (!run || still) return
    const timer = setInterval(() => {
      setPassed((n) => {
        if (n + 2 >= total) clearInterval(timer)
        return Math.min(total, n + 2)
      })
    }, 36)
    return () => clearInterval(timer)
  }, [run, still, total])

  const shown = run && still ? total : passed

  return (
    <span ref={ref} className={`tests${run ? ' run' : ''}`} role="img" aria-label={`${arNum(total)} اختباراً ناجحاً من ${arNum(total)}`}>
      <span className="tests-grid" aria-hidden="true">
        {Array.from({ length: total }, (_, d) => (
          <i key={d} style={{ '--d': d } as CSSProperties} />
        ))}
      </span>
      <b className="tests-n" aria-hidden="true">
        {arNum(shown)}/{arNum(total)} ناجحة
      </b>
    </span>
  )
}
