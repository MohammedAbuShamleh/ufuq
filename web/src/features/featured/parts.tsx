import Link from 'next/link'
import { Arrow } from '@/components/Button'
import type { FeaturedProject, Screen } from '@/lib/types'
import { SIMILAR } from './similar'

/**
 * What every layout gets. On the home page the title is an h3 that opens the
 * project page; on the project page it is the page's h1.
 */
export type LayoutProps = {
  project: FeaturedProject
  heading: 'h1' | 'h3'
  /** Link the title to /work/{slug}. */
  linkTitle?: boolean
  /** «أريد … مشابهاً»: #contact on the home page, /?type=…#contact elsewhere. */
  contactHref: string
}

/** A screen whose file is uploaded, with the file known to be there. */
export type Shown = Screen & { file: NonNullable<Screen['file']> }

export const shown = (screens: Screen[], kind: (k: Screen['kind']) => boolean): Shown[] =>
  screens.filter((s): s is Shown => s.file !== null && kind(s.kind))

export function Meta({ project }: { project: FeaturedProject }) {
  return project.tag ? <span className="fv-meta">{project.tag}</span> : null
}

export function Title({ project, heading: Heading, linkTitle }: Omit<LayoutProps, 'contactHref'>) {
  return <Heading>{linkTitle ? <Link href={`/work/${project.slug}`}>{project.title}</Link> : project.title}</Heading>
}

export function Tech({ project }: { project: FeaturedProject }) {
  if (!project.tech_stack?.length) return null
  return (
    <bdi dir="ltr" className="fv-tech">
      {project.tech_stack.join(' · ')}
    </bdi>
  )
}

/** The contact form listens for clicks on a[data-type] and picks that project type. */
export function SimilarCta({ project, href }: { project: FeaturedProject; href: string }) {
  const similar = SIMILAR[project.type]
  return (
    <a className="fv-cta" href={href} data-type={similar.formType}>
      {similar.label} <Arrow />
    </a>
  )
}
