'use client'

import { useEffect, useRef, useState } from 'react'
import { DemoPill } from '@/components/DemoPill'
import { MediaImage } from '@/components/MediaImage'
import { useInView } from '@/hooks/useInView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { arNum } from '@/lib/format'
import { isVideo } from '@/lib/media'
import type { Media } from '@/lib/types'
import { Meta, shown, SimilarCta, Tech, Title, type LayoutProps } from '../parts'

const STAGE_SIZES = '(max-width: 1288px) calc(100vw - 3rem), 1240px'

/**
 * NexaBridge: a wide dark stage that plays the site's clips, one chip per
 * clip or screen. Only the active clip plays, and only while a third of the
 * stage is on screen and motion is allowed.
 */
export function ReelLayout({ project, heading, linkTitle, contactHref }: LayoutProps) {
  const items = shown(project.screens, (k) => k !== 'mobile')
  const [active, setActive] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage, { threshold: 0.35 })
  const still = useReducedMotion()

  return (
    <article className="fb fb4">
      <div ref={stage} className="fb4-stage">
        {items.map((s, i) => {
          const on = i === active
          const cls = on ? 'fb4-m on' : 'fb4-m'
          return isVideo(s.file) ? (
            <Clip key={s.file.url} media={s.file} label={s.alt} className={cls} on={on} playing={on && inView && !still} />
          ) : (
            <MediaImage key={s.file.url} media={s.file} alt={s.alt ?? ''} fill sizes={STAGE_SIZES} className={cls} aria-hidden={!on} />
          )
        })}
        <div className="fb4-cap">
          <div>
            <Meta project={project} />
            <Title project={project} heading={heading} linkTitle={linkTitle} />
          </div>
          {project.summary && <p>{project.summary}</p>}
        </div>
      </div>

      <div className="fb4-bar">
        {items.length > 1 && (
          <div className="fb4-chips" role="group" aria-label={`مقاطع ${project.title}`}>
            {items.map((s, i) => (
              <button key={s.file.url} type="button" aria-pressed={i === active} className={i === active ? 'on' : undefined} onClick={() => setActive(i)}>
                {s.label ?? arNum(i + 1)}
              </button>
            ))}
          </div>
        )}
        <div className="fb-foot">
          <Tech project={project} />
          {project.has_demo_data && <DemoPill />}
          <SimilarCta project={project} href={contactHref} />
        </div>
      </div>
    </article>
  )
}

/** A muted loop that starts over when picked, and plays only while told to. */
function Clip({ media, label, className, on, playing }: { media: Media; label: string | null; className: string; on: boolean; playing: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (on && ref.current) ref.current.currentTime = 0
  }, [on])

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (playing) video.play().catch(() => {})
    else video.pause()
  }, [playing])

  return (
    <video ref={ref} className={className} muted loop playsInline preload="metadata" aria-label={label ?? undefined} aria-hidden={!on || undefined}>
      <source src={media.url} type={media.mime} />
    </video>
  )
}
