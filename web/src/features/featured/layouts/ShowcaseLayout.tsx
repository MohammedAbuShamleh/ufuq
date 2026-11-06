'use client'

import { useState } from 'react'
import { DemoPill } from '@/components/DemoPill'
import { MediaImage } from '@/components/MediaImage'
import { arNum } from '@/lib/format'
import { Meta, shown, SimilarCta, Tech, Title, type LayoutProps } from '../parts'

const MAIN_SIZES = '(max-width: 1288px) calc(100vw - 3rem), 1240px'
const THUMB_SIZES = '(max-width: 960px) 33vw, 200px'

/**
 * Saiid: one large desktop screen, every desktop screen under it as a
 * thumbnail that swaps it in. The figures sit on the title row.
 */
export function ShowcaseLayout({ project, heading, linkTitle, contactHref }: LayoutProps) {
  const screens = shown(project.screens, (k) => k === 'desktop')
  const [active, setActive] = useState(0)

  return (
    <article className="fb fb1">
      <div className="fb1-copy">
        <div>
          <Meta project={project} />
          <Title project={project} heading={heading} linkTitle={linkTitle} />
        </div>
        {project.summary && <p>{project.summary}</p>}
        {project.featured_facts.length > 0 && (
          <div className="fb1-facts">
            {project.featured_facts.map((f) => (
              <span key={f.value + f.label}>
                <b>{f.value}</b> {f.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {screens.length > 0 && (
        <>
          <div className="fb1-screen">
            {screens.map((s, i) => (
              <MediaImage
                key={s.file.url}
                media={s.file}
                alt={s.alt ?? ''}
                fill
                sizes={MAIN_SIZES}
                className={i === active ? 'fb1-m on' : 'fb1-m'}
                aria-hidden={i !== active || undefined}
              />
            ))}
            {project.has_demo_data && <DemoPill />}
          </div>
          {screens.length > 1 && (
            <div className="fb1-thumbs" role="group" aria-label={`شاشات ${project.title}`}>
              {screens.map((s, i) => (
                <button key={s.file.url} type="button" aria-pressed={i === active} className={i === active ? 'on' : undefined} onClick={() => setActive(i)}>
                  <span className="fb-th">
                    <MediaImage media={s.file} alt={s.alt ?? ''} fill sizes={THUMB_SIZES} />
                  </span>
                  <span>{s.label ?? arNum(i + 1)}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <div className="fb-foot">
        <Tech project={project} />
        <SimilarCta project={project} href={contactHref} />
      </div>
    </article>
  )
}
