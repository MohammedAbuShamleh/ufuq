import Link from 'next/link'
import { imgAttrs, isVideo } from '@/lib/media'
import type { ProjectCard } from '@/lib/types'
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

function cardClass(project: ProjectCard, tone: number) {
  if (project.cover?.file) return project.cover.kind === 'mobile' ? 'pjt tall has-img' : 'pjt w2 has-img'
  return ['pjt', project.title.length > LONG_TITLE && 'w2', TONES[tone % TONES.length]].filter(Boolean).join(' ')
}

/**
 * A project in the mixed grid. The title links to the project page and its
 * hit area covers the card, so the whole card opens it.
 */
export function WorkCard({ project, tone, hidden }: { project: ProjectCard; tone: number; hidden?: boolean }) {
  const cover = project.cover?.file

  return (
    <article className={cardClass(project, tone)} hidden={hidden}>
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
          <Link className="pjt-link" href={`/work/${project.slug}`}>
            {project.title}
          </Link>
        </h3>
        {project.summary && <p>{project.summary}</p>}
        {project.tech_stack && <span className="pjt-tech">{project.tech_stack.join(' · ')}</span>}
      </div>
    </article>
  )
}
