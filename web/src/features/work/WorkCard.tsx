import Link from 'next/link'
import type { CSSProperties } from 'react'
import { href, type Locale } from '@/i18n/config'
import { imgAttrs, isVideo } from '@/lib/media'
import type { ProjectCard } from '@/lib/types'
import { packGrid, type Cell, type Span } from './packGrid'
import './work.css'

// Cards without a screenshot get a tone, in turn, and the client's initial
// («موقع دار الإتقان» shows د, not م).
const TONES = ['t-olive', 't-terra', 't-ink', 't-stone']
const LONG_TITLE = 22
const SIZES = '(max-width: 600px) 100vw, 50vw'

/** Each card's tone index: only cards without a screenshot take one. */
export function cardTones(projects: ProjectCard[]) {
  let tone = 0
  return projects.map((p) => (p.cover?.file ? 0 : tone++))
}

/**
 * The size a card asks for: a screenshot takes two columns, a phone two rows
 * (one where the grid has two columns), and a card without one is a single
 * cell unless its title is long.
 */
function cardCell(project: ProjectCard, cols: 4 | 2): Cell {
  const kind = project.cover?.file ? project.cover.kind : null
  if (kind === 'mobile') return { w: 1, h: cols === 4 ? 2 : 1, image: true, phone: true }
  if (kind) return { w: 2, h: 1, image: true, phone: false }
  return { w: project.title.length > LONG_TITLE ? 2 : 1, h: 1, image: false, phone: false }
}

/** A card's size where the grid has four columns and where it has two. */
export type CardSpans = { c4: Span; c2: Span }

/** Sizes for the cards that show, in order, so the grid has no empty cell at four or at two columns. */
export function gridSpans(shown: ProjectCard[]): Map<string, CardSpans> {
  const c4 = packGrid(shown.map((p) => cardCell(p, 4)), 4)
  const c2 = packGrid(shown.map((p) => cardCell(p, 2)), 2)
  return new Map(shown.map((p, i) => [p.slug, { c4: c4[i], c2: c2[i] }]))
}

/**
 * A project in the mixed grid. The title links to the project page and its
 * hit area covers the card, so the whole card opens it. Without `spans` the
 * card takes the size it asks for.
 */
export function WorkCard({
  project,
  tone,
  hidden,
  spans,
  locale,
}: {
  project: ProjectCard
  tone: number
  hidden?: boolean
  spans?: CardSpans
  /** The page's language, for the link (the card renders on the server and in the client lists). */
  locale: Locale
}) {
  const cover = project.cover?.file
  const { c4, c2 } = spans ?? { c4: cardCell(project, 4), c2: cardCell(project, 2) }
  const size = { '--w4': c4.w, '--h4': c4.h, '--w2': c2.w, '--h2': c2.h } as CSSProperties
  // A phone that had to widen sits beside the text, at the column counts where it did.
  const phone = cover && project.cover!.kind === 'mobile'
  const cls = cover
    ? ['pjt has-img', phone && c4.w > 1 && 'ph-side4', phone && c2.w > 1 && 'ph-side2'].filter(Boolean).join(' ')
    : `pjt ${TONES[tone % TONES.length]}`

  return (
    <article className={cls} style={size} hidden={hidden}>
      {cover ? (
        <div className={`pjt-media${project.cover!.kind === 'mobile' ? ' ph' : ''}`}>
          {isVideo(cover) ? (
            // A still from one second in: no autoplay in a grid of cards.
            <video src={`${cover.url}#t=1`} muted playsInline preload="metadata" aria-hidden="true" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- the API already serves the webp widths (see imgAttrs)
            <img {...imgAttrs(cover, SIZES)} alt="" loading="lazy" decoding="async" />
          )}
        </div>
      ) : (
        <span className="pjt-big" aria-hidden="true">
          {(project.client_name ?? project.title).charAt(0)}
        </span>
      )}
      <div className="pjt-body">
        {project.tag && <span className="pjt-tag">{project.tag}</span>}
        <h3>
          <Link className="pjt-link" href={href(locale, `/work/${project.slug}`)}>
            {project.title}
          </Link>
        </h3>
        {project.summary && <p>{project.summary}</p>}
        {project.tech_stack && <span className="pjt-tech">{project.tech_stack.join(' · ')}</span>}
      </div>
    </article>
  )
}
