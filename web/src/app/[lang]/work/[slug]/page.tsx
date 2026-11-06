import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Arrow, Button } from '@/components/Button'
import { Kicker } from '@/components/Kicker'
import { SupportStrip } from '@/features/contact/SupportStrip'
import { FeaturedProject } from '@/features/featured/FeaturedProjects'
import { similarHref } from '@/features/featured/similar'
import { ProjectFacts, ProjectQuote, ProjectStory } from '@/features/project/ProjectDetails'
import { relatedProjects } from '@/features/project/related'
import { cardTones, WorkCard } from '@/features/work/WorkCard'
import { href } from '@/i18n/config'
import { getDictionary, getLocale } from '@/i18n/server'
import { getProject, getProjects, getSettings } from '@/lib/api'
import { pageMetadata } from '@/lib/seo'
import { PageCta } from '../../../_shell/PageCta'

// The page waits for its project rather than showing a shell first, so an
// unpublished slug still answers with a real 404 (a streamed shell would
// already have sent 200). Published projects are prerendered below anyway.
export const instant = false

/** Every published project is built ahead; one published later renders on its first visit. */
export async function generateStaticParams() {
  const projects = await getProjects(await getLocale())
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<'/[lang]/work/[slug]'>) {
  const { slug } = await params
  const locale = await getLocale()
  const [t, project] = await Promise.all([getDictionary(locale), getProject(locale, slug)])
  if (!project) return {}
  // The share image is ./opengraph-image: the project's first screen.
  return pageMetadata({
    locale,
    t,
    title: project.title,
    description: project.summary ?? t.meta.description,
    path: `/work/${project.slug}`,
    ownImage: true,
  })
}

export default async function ProjectPage({ params }: PageProps<'/[lang]/work/[slug]'>) {
  const { slug } = await params
  const locale = await getLocale()
  const [t, project, projects, settings] = await Promise.all([
    getDictionary(locale),
    getProject(locale, slug),
    getProjects(locale),
    getSettings(locale),
  ])
  if (!project) notFound()
  const copy = t.project

  const related = relatedProjects(projects, project)
  const tones = cardTones(related)

  return (
    <>
      <main id="top" className="inner project-page">
        <section className="pp-top">
          <div className="wrap">
            <Link className="sx-go pp-back" href={href(locale, '/work')}>
              <Arrow className="ico-arrow back" /> {copy.back}
            </Link>
            {/* Every figure, the highlighted ones first, is listed once in ProjectFacts below,
                so the title row here does not repeat them. */}
            <FeaturedProject
              project={{ ...project, featured_facts: [] }}
              heading="h1"
              contactHref={similarHref(locale, project.type)}
              locale={locale}
              copy={t.layouts}
            />
          </div>
        </section>

        <ProjectFacts project={project} />
        <ProjectStory project={project} />
        {project.testimonial && <ProjectQuote testimonial={project.testimonial} />}

        {related.length > 0 && (
          <section className="pp-more" aria-labelledby="more-title">
            <div className="wrap">
              <div className="apg-sec-head">
                <Kicker>{copy.moreKicker}</Kicker>
                <h2 id="more-title">{copy.moreTitle}</h2>
              </div>
              <div className="pjt-grid">
                {related.map((p, i) => (
                  <WorkCard key={p.slug} project={p} tone={tones[i]} locale={locale} />
                ))}
              </div>
              <Link className="sx-go pj-all" href={href(locale, '/work')}>
                {copy.allWork} <Arrow />
              </Link>
            </div>
          </section>
        )}

        <PageCta title={copy.cta}>
          <Button variant="line" href={href(locale, '/work')}>
            {copy.ctaWork}
          </Button>
        </PageCta>
      </main>
      <SupportStrip whatsapp={settings.whatsapp_number} />
    </>
  )
}
