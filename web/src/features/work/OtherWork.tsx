'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Arrow } from '@/components/Button'
import type { ProjectCard, ProjectType } from '@/lib/types'
import { FilterButton } from './FilterButton'
import { TYPE_FILTERS } from './labels'
import { cardTones, gridSpans, WorkCard } from './WorkCard'

/** The rest of the work: a grid of mixed card sizes with a filter by kind. */
export function OtherWork({ projects }: { projects: ProjectCard[] }) {
  const [filter, setFilter] = useState<ProjectType | 'all'>('all')
  const count = (type: ProjectType) => projects.filter((p) => p.type === type).length
  const tones = cardTones(projects)
  const match = (p: ProjectCard) => filter === 'all' || p.type === filter
  const spans = gridSpans(projects.filter(match))

  return (
    <>
      <h3 className="pj-sub" id="other-work">
        مشاريع أخرى
      </h3>
      <p className="pj-sample">ما تراه هنا عيّنة من أكثر من ٥٠ نظاماً بنيناها منذ ٢٠٢٢.</p>
      <div className="pj-filter" role="group" aria-label="تصفية الأعمال">
        <FilterButton on={filter === 'all'} onClick={() => setFilter('all')} label="الكل" count={projects.length} />
        {TYPE_FILTERS.filter(({ type }) => count(type) > 0).map(({ type, label }) => (
          <FilterButton key={type} on={filter === type} onClick={() => setFilter(type)} label={label} count={count(type)} />
        ))}
      </div>
      <div className="pjt-grid">
        {projects.map((p, i) => (
          <WorkCard key={p.slug} project={p} tone={tones[i]} hidden={!match(p)} spans={spans.get(p.slug)} />
        ))}
      </div>
      <Link className="sx-go pj-all" href="/work">
        كل الأعمال <Arrow />
      </Link>
    </>
  )
}
