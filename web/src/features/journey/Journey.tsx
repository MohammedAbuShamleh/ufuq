'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArchClip } from '@/components/ArchClip'
import { Kicker } from '@/components/Kicker'
import { Reveal } from '@/components/Reveal'
import type { Dictionary } from '@/i18n/dictionaries/ar'
import { fillNodes } from '@/i18n/config'
import { keepInPlace } from '@/lib/keepInPlace'
import './journey.css'

// Where the camera looks in the road picture at each step (journey.steps, in order).
const VIEWS = [
  { x: '50%', y: '50%', zoom: 1 },
  { x: '48%', y: '88%', zoom: 1.6 },
  { x: '72%', y: '63%', zoom: 1.85 },
  { x: '68%', y: '46%', zoom: 2.3 },
]


/**
 * «ماذا يحدث بعدها؟»: four steps, the camera moving along the road to the one
 * the visitor opens. Nothing advances by itself.
 */
export function Journey({ copy }: { copy: Dictionary['journey'] }) {
  const { steps, ordinals } = copy
  const [active, setActive] = useState(0)
  const [caption, setCaption] = useState(0)
  const listRef = useRef<HTMLOListElement>(null)

  // Opening a step closes the open one; if that one is above the screen, the
  // pressed step is held where it was rather than sliding up under the nav.
  const open = (i: number, pressed: Element) => {
    if (i !== active) keepInPlace(pressed, listRef.current?.children[active], () => setActive(i))
  }

  // The caption fades out, changes, and fades back in.
  useEffect(() => {
    const t = setTimeout(() => setCaption(active), 250)
    return () => clearTimeout(t)
  }, [active])

  const view = VIEWS[active]
  const progress = active / (steps.length - 1)

  return (
    <section className="nx3" id="next" aria-labelledby="nx-title">
      <div className="wrap nx3-stick">
        <figure className="nx3-photo">
          <ArchClip className="nx3-clip">
            <Image
              src="/illustrations/journey-road.png"
              width={1122}
              height={1402}
              sizes="(max-width: 960px) 300px, 420px"
              alt={copy.alt}
              style={{ '--ox': view.x, '--oy': view.y, '--zs': view.zoom } as CSSProperties}
            />
          </ArchClip>
          <figcaption className={`nx3-cap${caption === active ? '' : ' swap'}`}>
            {fillNodes(copy.caption, { n: ordinals[caption], total: ordinals[steps.length - 1], title: steps[caption].title })}
          </figcaption>
          <div className="nx3-prog" aria-hidden="true">
            {steps.map((s, i) => (
              <i key={s.title} className={i <= active ? 'on' : undefined} />
            ))}
          </div>
        </figure>

        <div className="nx3-body">
          <div className="nx-head">
            <Kicker>{copy.kicker}</Kicker>
            <Reveal as="h2" id="nx-title" words={copy.title} />
            <p className="nx3-hint">{copy.hint}</p>
          </div>
          <div className="nx3-list" style={{ '--lp': progress.toFixed(3) } as CSSProperties}>
            <span className="nx3-line" aria-hidden="true">
              <i />
              <b />
            </span>
            <ol ref={listRef}>
              {steps.map((s, i) => (
                <li key={s.title} className={`nx3-step${i === active ? ' on' : ''}${i < active ? ' done' : ''}`}>
                  <button
                    type="button"
                    className="nx3-head"
                    aria-expanded={i === active}
                    aria-controls={`nx3-det-${i}`}
                    data-moves-page
                    onClick={(e) => open(i, e.currentTarget)}
                  >
                    <span className="nx-n">{ordinals[i]}</span>
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
