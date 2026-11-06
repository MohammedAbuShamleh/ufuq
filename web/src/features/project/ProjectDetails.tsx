import { Kicker } from '@/components/Kicker'
import { fill } from '@/i18n/config'
import { getDictionary } from '@/i18n/server'
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

/** The project's figures, then who it was built for, where, and what kind of work it is. */
export async function ProjectFacts({ project }: { project: ProjectDetail }) {
  const t = await getDictionary()
  const { facts: label } = t.project
  const figures = figuresOf(project)
  const facts = [
    { label: label.client, value: project.client_name },
    { label: label.sector, value: t.work.sectors[project.sector] },
    { label: label.country, value: countryName(t.work.countries, project.country) },
    { label: label.type, value: t.work.type[project.type] },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value))

  return (
    <section className="pp-facts" aria-label={t.project.factsLabel}>
      <div className="wrap">
        {figures.length > 0 && (
          <ul className="pp-figures">
            {figures.map((f) => (
              <li key={`${f.value}\n${f.label}`}>
                <b>{f.value}</b>
                {f.label && <span>{f.label}</span>}
              </li>
            ))}
          </ul>
        )}
        <dl className="pp-facts-in">
          {facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/** The story's steps, in order; their titles and placeholders are in project.story. */
const STORY = ['challenge', 'solution', 'results'] as const

/**
 * Challenge, solution, result: the client fills them. A step still waiting
 * shows what it should say in a preview build and is left out on the live
 * site; with no step written, the section is left out.
 */
export async function ProjectStory({ project }: { project: ProjectDetail }) {
  const steps = STORY.filter((key) => isShown(project[key]))
  if (steps.length === 0) return null
  const copy = (await getDictionary()).project

  return (
    <section className="pp-story" aria-labelledby="story-title">
      <div className="wrap">
        <div className="apg-sec-head">
          <Kicker>{copy.storyKicker}</Kicker>
          <h2 id="story-title">{copy.storyTitle}</h2>
        </div>
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
                <h3>{step.title}</h3>
                <p className={pending ? 'pending-txt' : undefined}>{pending ? (text ?? step.pending) : text}</p>
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
