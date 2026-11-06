import type { ComponentType, ReactNode } from 'react'
import { Reveal } from '@/components/Reveal'
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

const HOW_MANY: Record<number, string> = { 2: 'منظومتان', 3: 'ثلاث منظومات', 4: 'أربع منظومات', 5: 'خمس منظومات', 6: 'ست منظومات' }

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
export function FeaturedProjects({ projects, children }: { projects: Project[]; children?: ReactNode }) {
  return (
    <section className="projects" id="projects" aria-labelledby="pj-title">
      <WordStage word="أعمالنا">
        <div className="wrap">
          <div className="pj-head">
            <div>
              <Reveal as="h2" id="pj-title" words={['أنظمة تعمل اليوم', 'في مؤسسات حقيقية.']} />
            </div>
            <p className="muted">{HOW_MANY[projects.length] ?? 'منظومات مختارة'} من بين ما بنيناه، كلٌّ منها كما يُستخدم فعلاً.</p>
          </div>
          <div className="fbw">
            {projects.map((p) => (
              <FeaturedProject key={p.slug} project={p} heading="h3" linkTitle contactHref="#contact" />
            ))}
          </div>
        </div>
      </WordStage>
      {children && <div className="wrap">{children}</div>}
    </section>
  )
}
