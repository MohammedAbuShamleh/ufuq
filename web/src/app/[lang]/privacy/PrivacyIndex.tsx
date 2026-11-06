'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { fillNodes } from '@/i18n/config'
import { useLocale } from '@/i18n/LocaleProvider'
import { formatNumber } from '@/lib/format'

const TWO_DIGITS = { minimumIntegerDigits: 2, useGrouping: false }

// The logo's arch as one open line, from the foot of the right side, over the
// point, down to the foot of the left: the direction an Arabic line reads.
const ARCH_LINE = 'M200 260V114C200 52 144 16 100 0 56 16 0 52 0 114V260'
// The same arch set a little inside it, filled: the niche the number sits in.
const NICHE = 'M186 260V122.8C186 64.5 137.8 30.6 100 15.6 62.2 30.6 14 64.5 14 122.8V260Z'

/**
 * Beside the policy: the arch from the logo traces how much of the text has
 * been read, the number inside names the section at the reading line, and the
 * list under it jumps to any section.
 */
export function PrivacyIndex({ sections, copy }: { sections: { id: string; heading: string }[]; copy: { label: string; of: string } }) {
  const { locale } = useLocale()
  const two = (n: number) => formatNumber(locale, n, TWO_DIGITS)
  const [current, setCurrent] = useState(0)
  const trace = useRef<SVGPathElement>(null)
  const gradient = useId()

  useEffect(() => {
    const blocks = sections.map((s) => document.getElementById(s.id))
    const text = blocks[0]?.parentElement
    if (!text) return
    let raf = 0

    const measure = () => {
      raf = 0
      // A section counts as current once its top passes a line near the top
      // of the screen, so a jump from the list lands on the section it named
      // even when the next one is short and already in view.
      const spy = Math.min(220, innerHeight * 0.3)
      let at = 0
      blocks.forEach((b, i) => {
        if (b && b.getBoundingClientRect().top <= spy) at = i
      })
      // Empty at the top of the page, full once the end of the text reaches
      // the middle of the screen, where the eye is.
      const run = text.getBoundingClientRect().bottom + scrollY - innerHeight / 2
      const read = run > 0 ? Math.min(1, scrollY / run) : 1
      trace.current?.style.setProperty('stroke-dashoffset', String(1 - read))
      setCurrent(at)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }

    measure()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
    }
  }, [sections])

  return (
    <nav className="pv-aside" aria-label={copy.label}>
      <div className="pv-arch" aria-hidden="true">
        <svg viewBox="-3 -3 206 266">
          <defs>
            <linearGradient id={gradient} x1="1" y1="0" x2="0" y2="0">
              <stop offset="0" className="pv-stop-a" />
              <stop offset="1" className="pv-stop-b" />
            </linearGradient>
          </defs>
          <path className="pv-niche" d={NICHE} />
          <path className="pv-track" d={ARCH_LINE} pathLength={1} />
          <path ref={trace} className="pv-trace" d={ARCH_LINE} pathLength={1} stroke={`url(#${gradient})`} />
        </svg>
        <div className="pv-mark">
          <span key={current} className="pv-num">
            {two(current + 1)}
          </span>
          <span className="pv-of">{fillNodes(copy.of, { total: two(sections.length) })}</span>
        </div>
      </div>
      <ol className="pv-toc">
        {sections.map((s, i) => (
          <li key={s.id}>
            <a href={`#${s.id}`} aria-current={i === current ? 'location' : undefined}>
              <span className="pv-toc-n">{two(i + 1)}</span>
              {s.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
