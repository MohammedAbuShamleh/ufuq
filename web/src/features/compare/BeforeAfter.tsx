'use client'

import Image from 'next/image'
import { useRef, useState, type CSSProperties } from 'react'
import { Arrow } from '@/components/Button'
import { Kicker } from '@/components/Kicker'
import { Reveal } from '@/components/Reveal'
import { useInView } from '@/hooks/useInView'
import { ExcelSheet } from './ExcelSheet'
import './compare.css'

/**
 * Shuaa School before and after: a range input laid over the two pictures
 * moves the dividing line. It is a real <input type=range>, so arrow keys and
 * screen readers work without extra code.
 */
export function BeforeAfter() {
  const [pos, setPos] = useState(50)
  const stageRef = useRef<HTMLDivElement>(null)
  // One nudge of the handle the first time the stage is well in view.
  const hint = useInView(stageRef, { threshold: 0.6, once: true })

  return (
    <section className="ba" id="difference" aria-labelledby="ba-title">
      <div className="wrap">
        <div className="ba-head">
          <div>
            <Kicker>الفرق الذي نصنعه</Kicker>
            <Reveal as="h2" id="ba-title" words={['من ٥٨ ورقة Excel', 'إلى نظام واحد.']} />
          </div>
          <p className="muted">هكذا كانت مدرسة شعاع تدير رسومها ورواتبها ومخزنها، وهكذا تديرها اليوم. اسحب الخط لترى الفرق.</p>
        </div>

        <div ref={stageRef} className={`ba-stage${hint ? ' hint' : ''}`} style={{ '--pos': `${pos}%` } as CSSProperties}>
          <div className="ba-after">
            <Image
              src="/illustrations/school-system.webp"
              width={1600}
              height={1000}
              sizes="(max-width: 1240px) 100vw, 1240px"
              alt="لوحة نظام إدارة المدارس الذي يعمل اليوم في مدرسة شعاع"
            />
            <span className="ba-tag after">بعد — نظام واحد</span>
          </div>
          <div className="ba-before">
            <ExcelSheet />
            <span className="ba-tag before">قبل — ٥٨ ورقة</span>
          </div>
          <div className="ba-handle" aria-hidden="true">
            <span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
              </svg>
            </span>
          </div>
          <input
            className="ba-range"
            type="range"
            min={0}
            max={100}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label="قارن بين ملف Excel والنظام: حرّك الخط لليسار لرؤية الملف، ولليمين لرؤية النظام"
          />
        </div>

        <div className="ba-foot">
          <span className="ba-note">صورة ملف Excel توضيحية، والشاشة على اليسار من النظام الفعلي ببيانات تجريبية.</span>
          <a className="sx-go" href="#other-work">
            النظام في قائمة أعمالنا <Arrow />
          </a>
        </div>
      </div>
    </section>
  )
}
