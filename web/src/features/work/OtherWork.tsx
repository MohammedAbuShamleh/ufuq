'use client'

import { useState } from 'react'
import { arNum } from '@/lib/format'
import { imgAttrs } from '@/lib/media'
import type { ProjectCard, ProjectType } from '@/lib/types'
import './work.css'

const FILTERS: { type: ProjectType; label: string }[] = [
  { type: 'system', label: 'أنظمة' },
  { type: 'website', label: 'مواقع' },
  { type: 'platform', label: 'منصات' },
  { type: 'app', label: 'تطبيقات' },
]

// Cards without a screenshot get a tone, in turn, and the client's initial
// («موقع دار الإتقان» shows د, not م).
const TONES = ['t-olive', 't-terra', 't-ink', 't-stone']
const LONG_TITLE = 22

function cardClass(project: ProjectCard, tone: number) {
  const cover = project.cover?.file
  if (cover) return project.cover!.kind === 'mobile' ? 'pjt tall has-img' : 'pjt w2 has-img'
  return ['pjt', project.title.length > LONG_TITLE && 'w2', TONES[tone % TONES.length]].filter(Boolean).join(' ')
}

/** The rest of the work: a grid of mixed card sizes with a filter by kind. */
export function OtherWork({ projects }: { projects: ProjectCard[] }) {
  const [filter, setFilter] = useState<ProjectType | 'all'>('all')
  const counts = Object.fromEntries(FILTERS.map(({ type }) => [type, projects.filter((p) => p.type === type).length]))
  let tone = 0

  return (
    <>
      <h3 className="pj-sub" id="other-work">
        مشاريع أخرى
      </h3>
      <p className="pj-sample">ما تراه هنا عيّنة من أكثر من ٥٠ نظاماً بنيناها منذ ٢٠٢٢.</p>
      <div className="pj-filter" role="group" aria-label="تصفية الأعمال">
        <FilterButton on={filter === 'all'} onClick={() => setFilter('all')} label="الكل" count={projects.length} />
        {FILTERS.filter(({ type }) => counts[type] > 0).map(({ type, label }) => (
          <FilterButton key={type} on={filter === type} onClick={() => setFilter(type)} label={label} count={counts[type]} />
        ))}
      </div>
      <div className="pjt-grid">
        {projects.map((p) => {
          const cover = p.cover?.file
          const cls = cardClass(p, cover ? 0 : tone++)
          return (
            <article key={p.slug} className={cls} hidden={filter !== 'all' && p.type !== filter}>
              {cover ? (
                <div className={`pjt-media${p.cover!.kind === 'mobile' ? ' ph' : ''}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- the API already serves the webp widths (see imgAttrs) */}
                  <img {...imgAttrs(cover, '(max-width: 600px) 100vw, 50vw')} alt="" loading="lazy" decoding="async" />
                </div>
              ) : (
                <span className="pjt-big" aria-hidden="true">
                  {(p.client_name ?? p.title).charAt(0)}
                </span>
              )}
              <div className="pjt-body">
                {p.tag && <span className="pjt-tag">{p.tag}</span>}
                <h3>{p.title}</h3>
                {p.summary && <p>{p.summary}</p>}
                {p.tech_stack && <span className="pjt-tech">{p.tech_stack.join(' · ')}</span>}
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}

function FilterButton({ on, onClick, label, count }: { on: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button type="button" className={on ? 'on' : undefined} aria-pressed={on} onClick={onClick}>
      {label} <i>{arNum(count)}</i>
    </button>
  )
}
