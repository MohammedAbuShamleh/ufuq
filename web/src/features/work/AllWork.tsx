'use client'

import { useState } from 'react'
import { fill } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries/ar'
import { useLocale } from '@/i18n/LocaleProvider'
import { formatNumber } from '@/lib/format'
import type { ProjectCard, ProjectSector, ProjectType } from '@/lib/types'
import { FilterButton } from './FilterButton'
import { SECTORS, TYPES } from './labels'
import { cardTones, gridSpans, WorkCard } from './WorkCard'

/**
 * Every published project, filtered by kind and by sector together. Each
 * count says how many cards that choice would show given the other filter.
 */
export function AllWork({ projects, copy }: { projects: ProjectCard[]; copy: Dictionary['work'] }) {
  const { locale } = useLocale()
  const [type, setType] = useState<ProjectType | null>(null)
  const [sector, setSector] = useState<ProjectSector | null>(null)
  const tones = cardTones(projects)

  const match = (p: ProjectCard, t = type, s = sector) => (!t || p.type === t) && (!s || p.sector === s)
  const count = (t: ProjectType | null, s: ProjectSector | null) => projects.filter((p) => match(p, t, s)).length
  const shown = count(type, sector)
  const spans = gridSpans(projects.filter((p) => match(p)))

  return (
    <>
      <div className="wk-filters">
        <div className="pj-filter" role="group" aria-label={copy.typeGroup}>
          <FilterButton on={!type} onClick={() => setType(null)} label={copy.allTypes} count={count(null, sector)} />
          {TYPES.map((t) => (
            <FilterButton key={t} on={type === t} onClick={() => setType(t)} label={copy.types[t]} count={count(t, sector)} />
          ))}
        </div>
        <div className="pj-filter" role="group" aria-label={copy.sectorGroup}>
          <FilterButton on={!sector} onClick={() => setSector(null)} label={copy.allSectors} count={count(type, null)} />
          {SECTORS.map((s) => (
            <FilterButton key={s} on={sector === s} onClick={() => setSector(s)} label={copy.sectors[s]} count={count(type, s)} />
          ))}
        </div>
      </div>
      <p className="wk-count" role="status">
        {shown ? fill(copy.count, { count: formatNumber(locale, shown) }) : copy.none}
      </p>
      <div className="pjt-grid">
        {projects.map((p, i) => (
          <WorkCard key={p.slug} project={p} tone={tones[i]} hidden={!match(p)} spans={spans.get(p.slug)} locale={locale} />
        ))}
      </div>
    </>
  )
}
