import Link from 'next/link'
import { Arrow } from '@/components/Button'
import { similarHref } from '@/features/featured/similar'
import { fill, href } from '@/i18n/config'
import { getDictionary, getLocale } from '@/i18n/server'
import { isPending, isShown } from '@/lib/format'
import type { ProjectDetail, Testimonial } from '@/lib/types'
import { countryName } from '../work/labels'
import './project.css'

type Figure = { value: string; label: string | null }

/** The highlighted figures first, then the others, each figure once. */
function figuresOf(project: ProjectDetail): Figure[] {
  const seen = new Set<string>()
  return [...project.featured_facts, ...project.facts].filter((f) => {
    const key = `${f.value}\n${f.label}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/** A title this long is set a size down, so it still breaks into two lines at most. */
const LONG_TITLE = 16

/**
 * The page's opening: the name and what the work is on one side, the summary
 * and the way to ask for something similar on the other, then who it was
 * built for, where, what kind of work, and on what, in one ruled row.
 */
export async function ProjectHero({ project }: { project: ProjectDetail }) {
  const locale = await getLocale()
  const t = await getDictionary(locale)
  const { facts: label } = t.project
  const facts = [
    // «العميل: منظومة رشيد» under «منظومة رشيد» says nothing new.
    { label: label.client, value: project.client_name?.trim() === project.title.trim() ? null : project.client_name },
    { label: label.sector, value: t.work.sectors[project.sector] },
    { label: label.country, value: countryName(t.work.countries, project.country) },
    { label: label.type, value: t.work.type[project.type] },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value))
  const stack = project.tech_stack?.length ? project.tech_stack : null

  return (
    <section className="pp-hero" aria-labelledby="pp-title">
      <div className="wrap">
        <Link className="sx-go pp-back" href={href(locale, '/work')}>
          <Arrow className="ico-arrow back" /> {t.project.back}
        </Link>

        <div className="pp-head">
          <div className="pp-name">
            <h1 id="pp-title" className={project.title.length > LONG_TITLE ? 'pp-long' : undefined}>
              {project.title}
            </h1>
            {project.tag && <p className="pp-tag">{project.tag}</p>}
          </div>
          <div className="pp-lede">
            {project.summary && <p>{project.summary}</p>}
            <a className="pp-similar" href={similarHref(locale, project.type)}>
              {t.layouts.similar[project.type]} <Arrow />
            </a>
          </div>
        </div>

        <dl className="pp-ledger">
          {facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
          {stack && (
            <div className="pp-ledger-stack">
              <dt>{label.stack}</dt>
              <dd>
                <bdi dir="ltr">{stack.join(' · ')}</bdi>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  )
}

/** Whether the project has anything for the dark band: points it offers or figures. */
export const hasOffers = (project: ProjectDetail) => project.highlights.length > 0 || figuresOf(project).length > 0

/**
 * The dark band under the cover: what the work does, in its own points, and
 * its figures down the side, each on a rule rather than in a tile.
 */
export async function ProjectOffers({ project }: { project: ProjectDetail }) {
  const copy = (await getDictionary()).project
  const figures = figuresOf(project)
  const points = project.highlights

  return (
    <section className={`pp-offers${points.length === 0 ? ' pp-offers-figures' : ''}`} aria-labelledby="offers-title">
      <div className="wrap pp-offers-in">
        <div className="pp-points">
          <h2 id="offers-title">{copy.kinds[project.type].offers}</h2>
          {points.length > 0 && (
            <ul>
              {points.map((h) => (
                <li key={h}>
                  <svg className="pp-mark" viewBox="0 0 10 12" aria-hidden="true">
                    <path d="M0 12V5.3C0 2.4 2.8.7 5 0c2.2.7 5 2.4 5 5.3V12Z" />
                  </svg>
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>
        {figures.length > 0 && (
          <ul className="pp-figures" aria-label={copy.figures}>
            {figures.map((f) => (
              <li key={`${f.value}\n${f.label}`}>
                <b>{f.value}</b>
                {f.label && <span>{f.label}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

const STORY = ['challenge', 'solution', 'results'] as const

/**
 * Challenge, solution, result: the client fills them. A step still waiting
 * shows what it should say in a preview build and is left out on the live
 * site; with no step written, the section is left out. The heading holds its
 * place while the steps pass beside it.
 */
export async function ProjectStory({ project }: { project: ProjectDetail }) {
  const steps = STORY.filter((key) => isShown(project[key]))
  if (steps.length === 0) return null
  const copy = (await getDictionary()).project

  return (
    <section className="pp-story" aria-labelledby="story-title">
      <div className="wrap pp-story-in">
        <h2 id="story-title">{copy.storyTitle}</h2>
        <ol className="pp-steps">
          {steps.map((key, i) => {
            const text = project[key]
            const pending = isPending(text)
            const step = copy.story[key]
            return (
              <li key={key}>
                <span className="pp-n" aria-hidden="true">
                  {copy.stepNumbers[i]}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p className={pending ? 'pending-txt' : undefined}>{pending ? (text ?? step.pending) : text}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/** The client's own words about the project, when there are any (on the live site, only once written). */
export async function ProjectQuote({ testimonial: t }: { testimonial: Testimonial }) {
  if (!isShown(t.quote) || !isShown(t.author_name)) return null
  const copy = (await getDictionary()).project
  const mark = (text: string | null) => (isPending(text) ? 'pending-txt' : undefined)
  return (
    <section className="pp-voice" aria-label={fill(copy.quoteLabel, { organization: t.organization })}>
      <div className="wrap">
        <figure className="pp-quote">
          <blockquote className={mark(t.quote)}>{t.quote ?? copy.quotePending}</blockquote>
          <figcaption>
            <b className={mark(t.author_name)}>{t.author_name ?? copy.namePending}</b>
            <span>
              {isShown(t.author_title) && (
                <>
                  <span className={mark(t.author_title)}>{t.author_title ?? copy.rolePending}</span> ·{' '}
                </>
              )}
              {t.organization}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
