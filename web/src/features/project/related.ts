import type { ProjectCard, ProjectDetail } from '@/lib/types'

/**
 * Up to three other projects to read next: the same sector first (an
 * organisation like yours), then the same kind of work, then the rest, each
 * group in the API's order.
 */
export function relatedProjects(all: ProjectCard[], project: ProjectDetail, limit = 3) {
  const rank = (p: ProjectCard) => (p.sector === project.sector ? 0 : p.type === project.type ? 1 : 2)
  return all
    .filter((p) => p.slug !== project.slug)
    .map((p, i) => ({ p, i, r: rank(p) }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .slice(0, limit)
    .map(({ p }) => p)
}
