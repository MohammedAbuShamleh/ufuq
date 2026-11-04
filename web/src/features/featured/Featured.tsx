import type { ReactNode } from 'react'
import { Kicker } from '@/components/Kicker'
import { Reveal } from '@/components/Reveal'
import type { FeaturedProject } from '@/lib/types'
import { FeaturedCard } from './FeaturedCard'
import { FeaturedStack } from './FeaturedStack'
import './featured.css'

const HOW_MANY: Record<number, string> = { 2: 'منظومتان', 3: 'ثلاث منظومات', 4: 'أربع منظومات', 5: 'خمس منظومات', 6: 'ست منظومات' }

/** «أعمالنا»: the featured systems as stacking cards; the rest of the work follows as children. */
export function Featured({ projects, children }: { projects: FeaturedProject[]; children?: ReactNode }) {
  return (
    <section className="projects" id="projects" aria-labelledby="pj-title">
      <div className="wrap">
        <div className="pj-head">
          <div>
            <Kicker>أعمالنا</Kicker>
            <Reveal as="h2" id="pj-title" words={['أنظمة تعمل اليوم', 'في مؤسسات حقيقية.']} />
          </div>
          <p className="muted">
            {HOW_MANY[projects.length] ?? 'منظومات مختارة'} من بين ما بنيناه، بلقطاتها الحقيقية. مرّر لتتصفّحها.
          </p>
        </div>
        <FeaturedStack>
          {projects.map((p, i) => (
            <FeaturedCard key={p.slug} project={p} place={{ index: i, total: projects.length }} />
          ))}
        </FeaturedStack>
        {children}
      </div>
    </section>
  )
}
