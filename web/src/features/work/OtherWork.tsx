'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Arrow } from '@/components/Button'
import { href } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries/ar'
import { useLocale } from '@/i18n/LocaleProvider'
import type { ProjectCard, ProjectType } from '@/lib/types'
import { FilterButton } from './FilterButton'
import { TYPES } from './labels'
import { cardTones, gridSpans, WorkCard } from './WorkCard'

/** The rest of the work: a grid of mixed card sizes with a filter by kind. */
export type OtherWorkCopy = Dictionary['otherWork'] & { types: Dictionary['work']['types'] }

export function OtherWork({ projects, copy }: { projects: ProjectCard[]; copy: OtherWorkCopy }) {
  const { locale } = useLocale()
  const [filter, setFilter] = useState<ProjectType | 'all'>('all')
  const count = (type: ProjectType) => projects.filter((p) => p.type === type).length
  const tones = cardTones(projects)
  const match = (p: ProjectCard) => filter === 'all' || p.type === filter
  const spans = gridSpans(projects.filter(match))

  return (
    <>
      <h3 className="pj-sub" id="other-work">
        {copy.title}
      </h3>
      <p className="pj-sample">{copy.sample}</p>
      <div className="pj-filter" role="group" aria-label={copy.filter}>
        <FilterButton on={filter === 'all'} onClick={() => setFilter('all')} label={copy.all} count={projects.length} />
        {TYPES.filter((type) => count(type) > 0).map((type) => (
          <FilterButton key={type} on={filter === type} onClick={() => setFilter(type)} label={copy.types[type]} count={count(type)} />
        ))}
      </div>
      <div className="pjt-grid">
        {projects.map((p, i) => (
          <WorkCard key={p.slug} project={p} tone={tones[i]} hidden={!match(p)} spans={spans.get(p.slug)} locale={locale} />
        ))}
      </div>
      <Link className="sx-go pj-all" href={href(locale, '/work')}>
        {copy.allWork} <Arrow />
      </Link>
    </>
  )
}
