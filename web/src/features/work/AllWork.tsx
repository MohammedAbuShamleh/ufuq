'use client'

import { useState } from 'react'
import { arNum } from '@/lib/format'
import type { ProjectCard, ProjectSector, ProjectType } from '@/lib/types'
import { FilterButton } from './FilterButton'
import { SECTOR_FILTERS, TYPE_FILTERS } from './labels'
import { cardTones, WorkCard } from './WorkCard'

/**
 * Every published project, filtered by kind and by sector together. Each
 * count says how many cards that choice would show given the other filter.
 */
export function AllWork({ projects }: { projects: ProjectCard[] }) {
  const [type, setType] = useState<ProjectType | null>(null)
  const [sector, setSector] = useState<ProjectSector | null>(null)
  const tones = cardTones(projects)

  const match = (p: ProjectCard, t = type, s = sector) => (!t || p.type === t) && (!s || p.sector === s)
  const count = (t: ProjectType | null, s: ProjectSector | null) => projects.filter((p) => match(p, t, s)).length
  const shown = count(type, sector)

  return (
    <>
      <div className="wk-filters">
        <div className="pj-filter" role="group" aria-label="نوع العمل">
          <FilterButton on={!type} onClick={() => setType(null)} label="كل الأنواع" count={count(null, sector)} />
          {TYPE_FILTERS.map(({ type: t, label }) => (
            <FilterButton key={t} on={type === t} onClick={() => setType(t)} label={label} count={count(t, sector)} />
          ))}
        </div>
        <div className="pj-filter" role="group" aria-label="القطاع">
          <FilterButton on={!sector} onClick={() => setSector(null)} label="كل القطاعات" count={count(type, null)} />
          {SECTOR_FILTERS.map(({ sector: s, label }) => (
            <FilterButton key={s} on={sector === s} onClick={() => setSector(s)} label={label} count={count(type, s)} />
          ))}
        </div>
      </div>
      <p className="wk-count" role="status">
        {shown ? `عدد الأعمال: ${arNum(shown)}` : 'لا أعمال بهذا التصنيف بعد.'}
      </p>
      <div className="pjt-grid">
        {projects.map((p, i) => (
          <WorkCard key={p.slug} project={p} tone={tones[i]} hidden={!match(p)} />
        ))}
      </div>
    </>
  )
}
