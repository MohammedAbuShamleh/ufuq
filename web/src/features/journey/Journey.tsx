'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArchClip } from '@/components/ArchClip'
import { Kicker } from '@/components/Kicker'
import { Reveal } from '@/components/Reveal'
import { useInView } from '@/hooks/useInView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import './journey.css'

// Where the camera looks in the road picture at each step.
const STEPS = [
  {
    title: 'جلسة أولى مجانية',
    text: 'نسمع كيف تعملون اليوم، ونقترح النظام المناسب لكم.',
    points: ['مكالمة أو لقاء لمدة ٣٠ دقيقة', 'نفهم طريقة عملكم الحالية وأين تتعبون', 'اقتراح أولي لشكل النظام'],
    view: { x: '50%', y: '50%', zoom: 1 },
  },
  {
    title: 'اتفاق واضح',
    text: 'نحدد معاً ما سيُبنى ومتى، قبل أن نبدأ.',
    points: ['قائمة مكتوبة بما سيُبنى', 'مراحل التسليم ومواعيدها', 'لا عمل قبل أن نتفق'],
    view: { x: '48%', y: '88%', zoom: 1.6 },
  },
  {
    title: 'نبني على دفعات',
    text: 'مع كل دفعة نسخة تجريبية تجربها بيدك، فلا مفاجآت في النهاية.',
    points: ['نسخة تعمل مع كل دفعة', 'ملاحظاتك تدخل الدفعة التالية', 'ترى التقدّم بعينك، لا في تقرير'],
    view: { x: '72%', y: '63%', zoom: 1.85 },
  },
  {
    title: 'نُطلق ونرافق',
    text: 'نسلّمك الكود والتوثيق كاملين، ونبقى معك حتى يستقر النظام.',
    points: ['الكود والتوثيق وبيانات الخوادم', 'دعم فني بعد الإطلاق حتى يستقر النظام'],
    view: { x: '68%', y: '46%', zoom: 2.3 },
  },
]

const ORDINALS = ['١', '٢', '٣', '٤']
const ADVANCE_MS = 4200

/**
 * «ماذا يحدث بعدها؟»: four steps that advance by themselves while the section
 * is on screen, the camera moving along the road with them. The page scrolls
 * freely; a click on a step takes over and stops the auto-advance.
 */
export function Journey() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [chosen, setChosen] = useState(false)
  const [caption, setCaption] = useState(0)
  const visible = useInView(ref, { threshold: 0.45 })
  const still = useReducedMotion()

  useEffect(() => {
    if (chosen || !visible || still) return
    const t = setTimeout(() => setActive((i) => (i + 1) % STEPS.length), ADVANCE_MS)
    return () => clearTimeout(t)
  }, [active, chosen, visible, still])

  // The caption fades out, changes, and fades back in.
  useEffect(() => {
    const t = setTimeout(() => setCaption(active), 250)
    return () => clearTimeout(t)
  }, [active])

  const view = STEPS[active].view
  const progress = active / (STEPS.length - 1)

  return (
    <section ref={ref} className="nx3" id="next" aria-labelledby="nx-title">
      <div className="wrap nx3-stick">
        <figure className="nx3-photo">
          <ArchClip className="nx3-clip">
            <Image
              src="/illustrations/journey-road.png"
              width={1122}
              height={1402}
              sizes="(max-width: 960px) 300px, 420px"
              alt="بوابة طوبية مدبّبة يمر منها طريق بين تلال الزيتون والسرو نحو الشمس عند الغروب"
              style={{ '--ox': view.x, '--oy': view.y, '--zs': view.zoom } as CSSProperties}
            />
          </ArchClip>
          <figcaption className={`nx3-cap${caption === active ? '' : ' swap'}`} aria-live="polite">
            {ORDINALS[caption]} من {ORDINALS[STEPS.length - 1]} · {STEPS[caption].title}
          </figcaption>
          <div className="nx3-prog" aria-hidden="true">
            {STEPS.map((s, i) => (
              <i key={s.title} className={i <= active ? 'on' : undefined} />
            ))}
          </div>
        </figure>

        <div className="nx3-body">
          <div className="nx-head">
            <Kicker>بعد أن تتواصل معنا</Kicker>
            <Reveal as="h2" id="nx-title" words="ماذا يحدث بعدها؟" />
            <p className="nx3-hint">اضغط على أي خطوة</p>
          </div>
          <div className="nx3-list" style={{ '--lp': progress.toFixed(3) } as CSSProperties}>
            <span className="nx3-line" aria-hidden="true">
              <i />
              <b />
            </span>
            <ol>
              {STEPS.map((s, i) => (
                <li key={s.title} className={`nx3-step${i === active ? ' on' : ''}${i < active ? ' done' : ''}`}>
                  <button
                    type="button"
                    className="nx3-head"
                    aria-expanded={i === active}
                    aria-controls={`nx3-det-${i}`}
                    onClick={() => {
                      setChosen(true)
                      setActive(i)
                    }}
                  >
                    <span className="nx-n">{ORDINALS[i]}</span>
                    <span className="nx3-t">{s.title}</span>
                  </button>
                  <div className="nx3-det" id={`nx3-det-${i}`}>
                    <div>
                      <p>{s.text}</p>
                      <ul>
                        {s.points.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
