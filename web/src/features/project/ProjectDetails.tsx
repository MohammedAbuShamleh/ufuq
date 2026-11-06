import { Kicker } from '@/components/Kicker'
import { isPending, isShown } from '@/lib/format'
import type { ProjectDetail, Testimonial } from '@/lib/types'
import { countryName, SECTOR_LABEL, TYPE_LABEL } from '../work/labels'
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
export function ProjectFacts({ project }: { project: ProjectDetail }) {
  const figures = figuresOf(project)
  const facts = [
    { label: 'العميل', value: project.client_name },
    { label: 'القطاع', value: SECTOR_LABEL[project.sector] },
    { label: 'الدولة', value: countryName(project.country) },
    { label: 'نوع العمل', value: TYPE_LABEL[project.type] },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value))

  return (
    <section className="pp-facts" aria-label="عن المشروع">
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

const STORY = [
  { key: 'challenge', title: 'التحدي', placeholder: '[التحدي: كيف كانت المؤسسة تعمل قبل النظام، وما الذي كان يتعطّل؟]' },
  { key: 'solution', title: 'الحل', placeholder: '[الحل: ما الذي بنيناه، ومن يستخدمه في المؤسسة؟]' },
  { key: 'results', title: 'النتيجة', placeholder: '[النتيجة: ما الذي تغيّر بعد الإطلاق، بالأرقام إن وُجدت.]' },
] as const

const STEP_NUM = ['١', '٢', '٣']

/**
 * Challenge, solution, result: the client fills them. A step still waiting
 * shows what it should say in a preview build and is left out on the live
 * site; with no step written, the section is left out.
 */
export function ProjectStory({ project }: { project: ProjectDetail }) {
  const steps = STORY.filter((s) => isShown(project[s.key]))
  if (steps.length === 0) return null

  return (
    <section className="pp-story" aria-labelledby="story-title">
      <div className="wrap">
        <div className="apg-sec-head">
          <Kicker>قصة المشروع</Kicker>
          <h2 id="story-title">من المشكلة إلى نظام يعمل.</h2>
        </div>
        <ol className="pp-steps">
          {steps.map((s, i) => {
            const text = project[s.key]
            const pending = isPending(text)
            return (
              <li key={s.key}>
                <span className="pp-n" aria-hidden="true">
                  {STEP_NUM[i]}
                </span>
                <h3>{s.title}</h3>
                <p className={pending ? 'pending-txt' : undefined}>{pending ? (text ?? s.placeholder) : text}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/** The client's own words about the project, when there are any (on the live site, only once written). */
export function ProjectQuote({ testimonial: t }: { testimonial: Testimonial }) {
  if (!isShown(t.quote) || !isShown(t.author_name)) return null
  const mark = (text: string | null) => (isPending(text) ? 'pending-txt' : undefined)
  return (
    <section className="pp-voice" aria-label={`شهادة ${t.organization}`}>
      <div className="wrap">
        <figure className="pp-quote">
          <blockquote className={mark(t.quote)}>{t.quote ?? '[نص الشهادة]'}</blockquote>
          <figcaption>
            <b className={mark(t.author_name)}>{t.author_name ?? '[الاسم]'}</b>
            <span>
              {isShown(t.author_title) && (
                <>
                  <span className={mark(t.author_title)}>{t.author_title ?? '[المنصب]'}</span> ·{' '}
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
