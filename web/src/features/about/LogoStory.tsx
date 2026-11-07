'use client'

import { useRef, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import type { Dictionary, MarkPart } from '@/i18n/dictionaries/ar'

/** The notes around the mark, in order; their words are in logoStory.notes. */
const PARTS: MarkPart[] = ['arch', 'key', 'road']

// The mark: an arch with a keyhole, and the road through it.
const MARK =
  'M42 236 L42 124 A108 108 0 0 1 128 18.26 A108 108 0 0 1 214 124 L214 236 Z M56 236 L56 124 A94 94 0 0 1 128 32.61 A94 94 0 0 1 200 124 L200 236 Z M103.52 236 L68 236 L68 124 A82 82 0 0 1 128 45.01 A82 82 0 0 1 188 124 L188 236 L152.48 236 L132 159.55 A18 18 0 1 0 124 159.55 Z'
const OUTLINE = 'M42 236 L42 124 A108 108 0 0 1 128 18.26 A108 108 0 0 1 214 124 L214 236'
const ARCH = 'M42 236 L42 124 A108 108 0 0 1 128 18.26 A108 108 0 0 1 214 124 L214 236 Z M56 236 L56 124 A94 94 0 0 1 128 32.61 A94 94 0 0 1 200 124 L200 236 Z'
const ROAD = 'M124 160 L132 160 L152.48 236 L103.52 236 Z'

/**
 * «قصة الاسم»: the mark draws itself when it comes into view, and each note
 * lights up its part of the mark on hover, focus or tap.
 */
export function LogoStory({ copy }: { copy: Dictionary['logoStory'] }) {
  const ref = useRef<HTMLElement>(null)
  const seen = useInView(ref, { threshold: 0.3, once: true })
  const [lit, setLit] = useState<MarkPart | null>(null)

  return (
    <figure ref={ref} className={`ab-mark${seen ? ' in' : ''}`} aria-label={copy.label}>
      <div className="ab-stage" onMouseLeave={() => setLit(null)}>
        <svg className={`ab-svg${lit ? ` h-${lit}` : ''}`} viewBox="20 0 216 252" aria-hidden="true">
          <defs>
            <clipPath id="abL">
              <rect x="0" y="0" width="128" height="260" />
            </clipPath>
            <clipPath id="abR">
              <rect x="128" y="0" width="140" height="260" />
            </clipPath>
          </defs>
          <g className="ab-fill">
            <path clipPath="url(#abL)" fill="var(--mark-a)" fillRule="evenodd" d={MARK} />
            <path clipPath="url(#abR)" fill="var(--mark-b)" fillRule="evenodd" d={MARK} />
          </g>
          <path className="ab-draw" pathLength={1} d={OUTLINE} />
          <path className="hl hl-arch" d={ARCH} fillRule="evenodd" />
          <circle className="hl hl-key" cx="128" cy="142" r="22" />
          <path className="hl hl-road" d={ROAD} />
        </svg>
        {PARTS.map((part, i) => (
          <button
            key={part}
            type="button"
            className={`ab-note n${i + 1}${lit === part ? ' on' : ''}`}
            aria-pressed={lit === part}
            onMouseEnter={() => setLit(part)}
            onFocus={() => setLit(part)}
            // Not a toggle: focus (or the hover) has already lit it, so a tap must not undo that.
            onClick={() => setLit(part)}
          >
            <b>{copy.notes[part].title}</b>
            <span>{copy.notes[part].text}</span>
          </button>
        ))}
      </div>
      <figcaption>{copy.caption}</figcaption>
    </figure>
  )
}
