'use client'

import Link from 'next/link'
import { Fragment, useRef, useState, type ReactNode } from 'react'
import { Kicker } from '@/components/Kicker'
import { Reveal } from '@/components/Reveal'
import { href, type Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries/ar'
import { useLocale } from '@/i18n/LocaleProvider'
import { keepInPlace } from '@/lib/keepInPlace'
import type { ProjectCard, ProjectType } from '@/lib/types'
import './services.css'

const ICON = { viewBox: '0 0 32 32', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

// One per service, in the dictionary's order (services.items): the kind of
// project it lists under «من أعمالنا», and its icon.
const KINDS: ProjectType[] = ['website', 'system', 'finance', 'platform', 'app']

const ICONS: ReactNode[] = [
  <svg key="web" {...ICON}>
    <rect x="3" y="6" width="26" height="20" rx="3" />
    <path d="M3 11h26M7 8.5h.01M10 8.5h.01" />
    <path d="M9 16h8M9 20h12" />
  </svg>,
  <svg key="erp" {...ICON}>
    <path d="M16 4l10 5-10 5-10-5z" />
    <path d="M6 15l10 5 10-5M6 21l10 5 10-5" />
  </svg>,
  <svg key="finance" {...ICON}>
    <rect x="5" y="4" width="22" height="24" rx="3" />
    <path d="M10 10h12M10 15h12M10 20h6" />
    <path d="M20 20l2 2 3-4" />
  </svg>,
  <svg key="platform" {...ICON}>
    <rect x="4" y="4" width="10" height="10" rx="2" />
    <rect x="18" y="4" width="10" height="6" rx="2" />
    <rect x="18" y="14" width="10" height="14" rx="2" />
    <rect x="4" y="18" width="10" height="10" rx="2" />
  </svg>,
  <svg key="app" {...ICON}>
    <rect x="9" y="3" width="14" height="26" rx="3" />
    <path d="M14 25h4" />
  </svg>,
]


/**
 * Five panels, not numbered: they are kinds of work, not steps in an order.
 * The open one widens and turns dark. A mouse opens a panel by
 * hovering, touch and keyboard by pressing it. Below 960px they stack into an
 * accordion, which opens on a press only: there, opening one moves the others
 * up or down, and on hover the panel under a still pointer would keep changing.
 */
export type ServiceProject = Pick<ProjectCard, 'slug' | 'title' | 'type'>

export function Services({ copy, projects }: { copy: Dictionary['services']; projects: ServiceProject[] }) {
  const { locale } = useLocale()
  const [open, setOpen] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)
  const hoverOpens = () => matchMedia('(hover: hover) and (pointer: fine) and (min-width: 961px)').matches

  // Stacked, opening a panel closes the open one; if that one is above the
  // screen, the pressed panel is held where it was rather than sliding up
  // under the nav. Side by side the panels share one row, so nothing moves.
  const show = (i: number, pressed: Element) => {
    if (i !== open) keepInPlace(pressed, listRef.current?.children[open], () => setOpen(i))
  }

  return (
    <section className="sv" id="services" aria-labelledby="sv-title">
      <div className="wrap">
        <div className="sv-head">
          <div>
            <Kicker>{copy.kicker}</Kicker>
            <Reveal as="h2" id="sv-title" words={copy.title} />
          </div>
          <p className="muted">{copy.lead}</p>
        </div>
        <ul ref={listRef} className="sv-panels">
          {copy.items.map((s, i) => (
            <li key={s.title} className={`sv-p${open === i ? ' on' : ''}`} onMouseEnter={() => hoverOpens() && setOpen(i)}>
              <button
                type="button"
                className="sv-hit"
                aria-labelledby={`sv-t-${i}`}
                aria-expanded={open === i}
                aria-controls={`sv-more-${i}`}
                data-moves-page
                onClick={(e) => show(i, e.currentTarget)}
                onFocus={(e) => show(i, e.currentTarget)}
              />
              <div className="sv-top">
                <span className="sv-ic" aria-hidden="true">
                  {ICONS[i]}
                </span>
              </div>
              <div className="sv-bot">
                <h3 id={`sv-t-${i}`}>{s.title}</h3>
                {/* Closed, its links stay out of the tab order: focus opens a panel through its button. */}
                <div className="sv-more" id={`sv-more-${i}`} inert={open !== i}>
                  <div>
                    <p>{s.text}</p>
                    <ul>
                      {s.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                    <Examples projects={projects.filter((p) => p.type === KINDS[i])} label={copy.ourWork} separator={copy.separator} locale={locale} />
                    <span className="sv-tech">{s.tech}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** «من أعمالنا»: the projects of a service's kind, each a link to its page. */
function Examples({ projects, label, separator, locale }: { projects: ServiceProject[]; label: string; separator: string; locale: Locale }) {
  if (projects.length === 0) return null
  return (
    <div className="sv-work">
      <span>{label}</span>{' '}
      {projects.map((p, i) => (
        <Fragment key={p.slug}>
          {i > 0 && separator}
          <Link href={href(locale, `/work/${p.slug}`)}>{p.title}</Link>
        </Fragment>
      ))}
    </div>
  )
}
