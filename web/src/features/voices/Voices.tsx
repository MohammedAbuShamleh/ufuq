'use client'

import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Kicker } from '@/components/Kicker'
import { useInView } from '@/hooks/useInView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { isPending, isShown, SHOW_PENDING } from '@/lib/format'
import type { Client, Testimonial } from '@/lib/types'
import './voices.css'

const DURATION = 7000

/** The letter in the avatar: the organization's name without its kind (مدرسة، جمعية…) or «ال». */
function initial(organization: string) {
  const name = organization.replace(/^(مدرسة|دار|جمعية|وزارة|شركة)\s+/, '').replace(/^ال/, '')
  return name.charAt(0)
}

/**
 * «قالوا عنّا»: one testimonial at a time, word by word, moving on every
 * seven seconds while the section is on screen. Hovering pauses it; without
 * motion it waits for a click. Then the wall of organizations we work with.
 */
export function Voices({ testimonials: all, clients }: { testimonials: Testimonial[]; clients: Client[] }) {
  // A testimonial still waiting for its text or its author stays off the live site.
  const testimonials = SHOW_PENDING ? all : all.filter((t) => !isPending(t.quote) && !isPending(t.author_name))
  const ref = useRef<HTMLElement>(null)
  const [current, setCurrent] = useState(0)
  const [leaving, setLeaving] = useState<number | null>(null)
  const [hover, setHover] = useState(false)
  // Bumps on every change so the progress bar restarts even on the same tab.
  const [round, setRound] = useState(0)
  const visible = useInView(ref, { threshold: 0.3 })
  const still = useReducedMotion()
  const draft = testimonials.some((t) => isPending(t.quote) || isPending(t.author_name))

  const show = useCallback(
    (i: number) => {
      setRound((r) => r + 1)
      if (i === current) return
      setLeaving(current)
      setCurrent(i)
    },
    [current],
  )

  useEffect(() => {
    if (leaving === null) return
    const t = setTimeout(() => setLeaving(null), 450)
    return () => clearTimeout(t)
  }, [leaving])

  const rotating = visible && !hover && !still && testimonials.length > 1
  useEffect(() => {
    if (!rotating) return
    const t = setTimeout(() => show((current + 1) % testimonials.length), DURATION)
    return () => clearTimeout(t)
  }, [rotating, current, round, show, testimonials.length])

  if (testimonials.length === 0 && clients.length === 0) return null
  // Until the first testimonial arrives the section is the wall of organizations alone.
  const quotes = testimonials.length > 0

  return (
    <section
      ref={ref}
      className={`tm${rotating ? '' : ' paused'}`}
      id="voices"
      aria-labelledby="tm-title"
      style={{ '--dur': `${DURATION}ms` } as CSSProperties}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="wrap tm-in">
        <div className="tm-top">
          <h2 id="tm-title" className="sr-only">
            {quotes ? 'قالوا عنّا: شهادات من يستخدم أنظمتنا' : 'مؤسسات تعمل فيها أنظمتنا'}
          </h2>
          <Kicker>{quotes ? 'قالوا عنّا' : 'من نعمل معهم'}</Kicker>
          {draft && <span className="tm-draft">مسودة · بانتظار نصوص العملاء</span>}
        </div>

        {quotes && (
          <>
            <div className="tm-stage" aria-live="polite">
              <span className="tm-q" aria-hidden="true">
                ”
              </span>
              {testimonials.map((t, i) => (
                <Quote key={i} testimonial={t} state={i === current ? 'on' : i === leaving ? 'out' : null} />
              ))}
            </div>
            <div className="tm-sels" role="tablist" aria-label="شهادات العملاء">
              {testimonials.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === current}
                  className={`tq-sel${i === current ? ' on' : ''}`}
                  onClick={() => show(i)}
                >
                  <span>{t.organization}</span>
                  <i>
                    <b key={i === current ? round : undefined} />
                  </i>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {clients.length > 0 && (
        <div className="wrap cw">
          {quotes && <span className="cw-t">مؤسسات تعمل فيها أنظمتنا</span>}
          <ul className="cw-grid">
            {clients.map((c) => (
              <li key={c.name}>
                <b>{c.name}</b>
                <span>
                  {c.sector_label} · {c.location}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function Quote({ testimonial: t, state }: { testimonial: Testimonial; state: 'on' | 'out' | null }) {
  const quote = t.quote ?? '[نص الشهادة]'
  return (
    <figure className={`tq${state ? ` ${state}` : ''}`} aria-hidden={state !== 'on'}>
      <blockquote aria-label={quote}>
        {quote.split(/\s+/).map((w, k) => (
          <Fragment key={k}>
            {k > 0 && ' '}
            <span className="w" aria-hidden="true" style={{ '--k': k } as CSSProperties}>
              {w}
            </span>
          </Fragment>
        ))}
      </blockquote>
      <figcaption>
        <span className="tq-av" aria-hidden="true">
          {initial(t.organization)}
        </span>
        <span>
          <b>{t.author_name ?? '[الاسم]'}</b>
          <small>
            {isShown(t.author_title) && <>{t.author_title ?? '[المنصب]'} · </>}
            {t.organization}
          </small>
        </span>
      </figcaption>
    </figure>
  )
}
