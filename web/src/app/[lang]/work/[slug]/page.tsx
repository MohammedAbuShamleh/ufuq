import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Arrow, Button } from '@/components/Button'
import { SupportStrip } from '@/features/contact/SupportStrip'
import { hasOffers, ProjectHero, ProjectOffers, ProjectQuote, ProjectStory } from '@/features/project/ProjectDetails'
import { ProjectMedia } from '@/features/project/ProjectMedia'
import { relatedProjects } from '@/features/project/related'
import { splitScreens } from '@/features/project/screens'
import { cardTones, gridSpans, WorkCard } from '@/features/work/WorkCard'
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

/**
 * A project as a visitor reads it: the name and what it is, the work itself
 * across the page, what it offers, every other screen, the story once the
 * client writes it, and organisations like this one.
 */
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

  const { cover, wide, phones } = splitScreens(project.screens)
  const related = relatedProjects(projects, project)
  const tones = cardTones(related)
  const spans = gridSpans(related)

  return (
    <>
      <main id="top" className="inner project-page">
        <ProjectHero project={project} />

        <ProjectMedia
          title={project.title}
          cover={cover}
          wide={wide}
          phones={phones}
          demo={project.has_demo_data ? t.layouts.demoData : null}
          inside={copy.kinds[project.type].inside}
          copy={copy.media}
        >
          {hasOffers(project) ? <ProjectOffers project={project} /> : null}
        </ProjectMedia>

        <ProjectStory project={project} />
        {project.testimonial && <ProjectQuote testimonial={project.testimonial} />}

        {related.length > 0 && (
          <section className="pp-more" aria-labelledby="more-title">
            <div className="wrap">
              <div className="pp-head2">
                <h2 id="more-title">{copy.moreTitle}</h2>
                <Link className="sx-go" href={href(locale, '/work')}>
                  {copy.allWork} <Arrow />
                </Link>
              </div>
              <div className="pjt-grid">
                {related.map((p, i) => (
                  <WorkCard key={p.slug} project={p} tone={tones[i]} spans={spans.get(p.slug)} locale={locale} />
                ))}
              </div>
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
