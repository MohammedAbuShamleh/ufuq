import { DemoPill } from '@/components/DemoPill'
import { MediaImage } from '@/components/MediaImage'
import { Meta, shown, SimilarCta, Tech, Title, type LayoutProps } from '../parts'

const PHONES = 3
const SIZES = '(max-width: 960px) 31vw, 240px'

/**
 * Dar Al-Itqan: a dark band across the page with the app's first three phone
 * screens, the middle one larger, each captioned.
 */
export function PhonesLayout({ project, heading, linkTitle, contactHref }: LayoutProps) {
  const phones = shown(project.screens, (k) => k === 'mobile').slice(0, PHONES)

  return (
    <article className="fb fb2">
      <div className="fb2-copy">
        <Meta project={project} />
        <Title project={project} heading={heading} linkTitle={linkTitle} />
        {project.summary && <p>{project.summary}</p>}
      </div>

      {phones.length > 0 && (
        <div className="fb2-trio">
          {phones.map((s, i) => (
            <figure key={s.file.url} className={`fb2-ph fb2-ph${i + 1}`}>
              <div className="fb2-scr">
                <MediaImage media={s.file} alt={s.alt ?? ''} fill sizes={SIZES} />
              </div>
              {s.label && <figcaption>{s.label}</figcaption>}
            </figure>
          ))}
        </div>
      )}

      <div className="fb-foot fb2-foot">
        <Tech project={project} />
        {project.has_demo_data && <DemoPill />}
        <SimilarCta project={project} href={contactHref} />
      </div>
    </article>
  )
}
