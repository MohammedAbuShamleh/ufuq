'use client'

import { Fragment, useEffect, useState, type CSSProperties } from 'react'
import { Kicker } from '@/components/Kicker'
import { isPending, isShown, SHOW_PENDING } from '@/lib/format'
import type { Client, Testimonial } from '@/lib/types'
import './voices.css'

/** The letter in the avatar: the organization's name without its kind (مدرسة، جمعية…) or «ال». */
function initial(organization: string) {
  const name = organization.replace(/^(مدرسة|دار|جمعية|وزارة|شركة)\s+/, '').replace(/^ال/, '')
  return name.charAt(0)
}

/**
 * «قالوا عنّا»: one testimonial at a time, word by word; the visitor picks the
 * next one (nothing turns by itself, so a screen reader is never interrupted).
 * Then the wall of organizations we work with.
 */
export function Voices({ testimonials: all, clients }: { testimonials: Testimonial[]; clients: Client[] }) {
  // A testimonial still waiting for its text or its author stays off the live site.
  const testimonials = SHOW_PENDING ? all : all.filter((t) => !isPending(t.quote) && !isPending(t.author_name))
  const [current, setCurrent] = useState(0)
  const [leaving, setLeaving] = useState<number | null>(null)
  const draft = testimonials.some((t) => isPending(t.quote) || isPending(t.author_name))

  const show = (i: number) => {
    if (i === current) return
    setLeaving(current)
    setCurrent(i)
  }

  useEffect(() => {
    if (leaving === null) return
    const t = setTimeout(() => setLeaving(null), 450)
    return () => clearTimeout(t)
  }, [leaving])

  if (testimonials.length === 0 && clients.length === 0) return null
  // Until the first testimonial arrives the section is the wall of organizations alone.
  const quotes = testimonials.length > 0

  return (
    <section className="tm" id="voices" aria-labelledby="tm-title">
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
            <div className="tm-sels" role="group" aria-label="اختر شهادة">
              {testimonials.map((t, i) => (
                <button key={i} type="button" aria-pressed={i === current} className={`tq-sel${i === current ? ' on' : ''}`} onClick={() => show(i)}>
                  <span>{t.organization}</span>
                  <i aria-hidden="true">
                    <b />
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
