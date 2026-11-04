import { Kicker } from '@/components/Kicker'
import { isPending } from '@/lib/format'
import type { ProjectDetail, Testimonial } from '@/lib/types'
import { countryName, SECTOR_LABEL, TYPE_LABEL } from '../work/labels'
import './project.css'

/** Who it was built for, where, and what kind of work it is. */
export function ProjectFacts({ project }: { project: ProjectDetail }) {
  const facts = [
    { label: 'العميل', value: project.client_name },
    { label: 'القطاع', value: SECTOR_LABEL[project.sector] },
    { label: 'الدولة', value: countryName(project.country) },
    { label: 'نوع العمل', value: TYPE_LABEL[project.type] },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value))

  return (
    <section className="pp-facts" aria-label="عن المشروع">
      <div className="wrap">
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

/** Challenge, solution, result: the client fills them; until then each shows what it should say. */
export function ProjectStory({ project }: { project: ProjectDetail }) {
  return (
    <section className="pp-story" aria-labelledby="story-title">
      <div className="wrap">
        <div className="apg-sec-head">
          <Kicker>قصة المشروع</Kicker>
          <h2 id="story-title">من المشكلة إلى نظام يعمل.</h2>
        </div>
        <ol className="pp-steps">
          {STORY.map((s, i) => {
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

/** The client's own words about the project, when there are any. */
export function ProjectQuote({ testimonial: t }: { testimonial: Testimonial }) {
  const mark = (text: string | null) => (isPending(text) ? 'pending-txt' : undefined)
  return (
    <section className="pp-voice" aria-label={`شهادة ${t.organization}`}>
      <div className="wrap">
        <figure className="pp-quote">
          <blockquote className={mark(t.quote)}>{t.quote ?? '[نص الشهادة]'}</blockquote>
          <figcaption>
            <b className={mark(t.author_name)}>{t.author_name ?? '[الاسم]'}</b>
            <span>
              <span className={mark(t.author_title)}>{t.author_title ?? '[المنصب]'}</span> · {t.organization}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
