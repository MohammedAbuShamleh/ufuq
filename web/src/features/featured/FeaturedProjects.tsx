import type { ComponentType, ReactNode } from 'react'
import { Reveal } from '@/components/Reveal'
import { fillNodes } from '@/i18n/config'
import { getDictionary, getLocale } from '@/i18n/server'
import type { FeaturedLayout, FeaturedProject as Project } from '@/lib/types'
import { PhonesLayout } from './layouts/PhonesLayout'
import { ReelLayout } from './layouts/ReelLayout'
import { SheetLayout } from './layouts/SheetLayout'
import { ShowcaseLayout } from './layouts/ShowcaseLayout'
import type { LayoutProps } from './parts'
import { WordStage } from './WordStage'
import './featured.css'

const LAYOUTS: Record<FeaturedLayout, ComponentType<LayoutProps>> = {
  showcase: ShowcaseLayout,
  phones: PhonesLayout,
  sheet: SheetLayout,
  reel: ReelLayout,
}

/**
 * A project drawn in its own layout. A project page for one that is not
 * featured (no layout chosen) shows its phones if phones are all it has, and
 * its desktop screens otherwise.
 */
export function FeaturedProject(props: LayoutProps) {
  const { project } = props
  const onlyPhones = project.screens.length > 0 && project.screens.every((s) => s.kind === 'mobile')
  const Layout = LAYOUTS[project.featured_layout ?? (onlyPhones ? 'phones' : 'showcase')]
  return <Layout {...props} />
}

/**
 * «أعمالنا»: the featured systems, each as it is used; the rest of the work
 * follows as children. The giant word stands in for the section's kicker.
 */
export async function FeaturedProjects({ projects, children }: { projects: Project[]; children?: ReactNode }) {
  const locale = await getLocale()
  const t = await getDictionary(locale)
  const copy = t.featured
  return (
    <section className="projects" id="projects" aria-labelledby="pj-title">
      <WordStage word={copy.word}>
        <div className="wrap">
          <div className="pj-head">
            <div>
              <Reveal as="h2" id="pj-title" words={copy.title} />
            </div>
            <p className="muted">{fillNodes(copy.lead, { count: copy.howMany[projects.length] ?? copy.someSystems })}</p>
          </div>
          <div className="fbw">
            {projects.map((p) => (
              <FeaturedProject key={p.slug} project={p} heading="h3" linkTitle contactHref="#contact" locale={locale} copy={t.layouts} />
            ))}
          </div>
        </div>
      </WordStage>
      {children && <div className="wrap">{children}</div>}
    </section>
  )
}
