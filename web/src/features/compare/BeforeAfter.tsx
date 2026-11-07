'use client'

import Image from 'next/image'
import { useRef, useState, type CSSProperties } from 'react'
import { Arrow } from '@/components/Button'
import { Kicker } from '@/components/Kicker'
import { Reveal } from '@/components/Reveal'
import { useInView } from '@/hooks/useInView'
import type { Dictionary } from '@/i18n/dictionaries/ar'
import { ExcelSheet } from './ExcelSheet'
import './compare.css'

/**
 * Shuaa School before and after: a range input laid over the two pictures
 * moves the dividing line. It is a real <input type=range>, so arrow keys and
 * screen readers work without extra code.
 */
export function BeforeAfter({ copy }: { copy: Dictionary['compare'] }) {
  const [pos, setPos] = useState(50)
  const stageRef = useRef<HTMLDivElement>(null)
  // One nudge of the handle the first time the stage is well in view.
  const hint = useInView(stageRef, { threshold: 0.6, once: true })

  return (
    <section className="ba" id="difference" aria-labelledby="ba-title">
      <div className="wrap">
        <div className="ba-head">
          <div>
            <Kicker>{copy.kicker}</Kicker>
            <Reveal as="h2" id="ba-title" words={copy.title} />
          </div>
          <p className="muted">{copy.lead}</p>
        </div>

        <div ref={stageRef} className={`ba-stage${hint ? ' hint' : ''}`} style={{ '--pos': `${pos}%` } as CSSProperties}>
          <div className="ba-after">
            <Image
              src="/illustrations/school-system.webp"
              width={1600}
              height={1000}
              sizes="(max-width: 1240px) 100vw, 1240px"
              alt={copy.afterAlt}
            />
            <span className="ba-tag after">{copy.afterTag}</span>
          </div>
          <div className="ba-before">
            <ExcelSheet copy={copy.sheet} />
            <span className="ba-tag before">{copy.beforeTag}</span>
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
            aria-label={copy.range}
          />
        </div>

        <div className="ba-foot">
          <span className="ba-note">{copy.note}</span>
          <a className="sx-go" href="#other-work">
            {copy.link} <Arrow />
          </a>
        </div>
      </div>
    </section>
  )
}
