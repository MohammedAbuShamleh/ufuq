import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Arrow, Button } from '@/components/Button'
import { SupportStrip } from '@/features/contact/SupportStrip'
import { hasOffers, ProjectHero, ProjectOffers, ProjectQuote, ProjectStory } from '@/features/project/ProjectDetails'
import { ProjectMedia } from '@/features/project/ProjectMedia'
import { relatedProjects } from '@/features/project/related'
import { KIND_WORDS, splitScreens } from '@/features/project/screens'
import { cardTones, gridSpans, WorkCard } from '@/features/work/WorkCard'
import { getProject, getProjects, getSettings } from '@/lib/api'
import { pageMetadata, SITE_DESCRIPTION } from '@/lib/seo'
import { PageCta } from '../../_shell/PageCta'

// The page waits for its project rather than showing a shell first, so an
// unpublished slug still answers with a real 404 (a streamed shell would
// already have sent 200). Published projects are prerendered below anyway.
export const instant = false

/** Every published project is built ahead; one published later renders on its first visit. */
export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return {}
  // The share image is ./opengraph-image: the project's first screen.
  return pageMetadata({ title: project.title, description: project.summary ?? SITE_DESCRIPTION, path: `/work/${project.slug}`, ownImage: true })
}

/**
 * A project as a visitor reads it: the name and what it is, the work itself
 * across the page, what it offers, every other screen, the story once the
 * client writes it, and organisations like this one.
 */
export default async function ProjectPage({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params
  const [project, projects, settings] = await Promise.all([getProject(slug), getProjects(), getSettings()])
  if (!project) notFound()

  const { cover, wide, phones } = splitScreens(project.screens)
  const words = KIND_WORDS[project.type]
  const related = relatedProjects(projects, project)
  const tones = cardTones(related)
  const spans = gridSpans(related)

  return (
    <>
      <main id="top" className="inner project-page">
        <ProjectHero project={project} />

        <ProjectMedia title={project.title} cover={cover} wide={wide} phones={phones} demo={project.has_demo_data} inside={words.inside}>
          {hasOffers(project) ? <ProjectOffers project={project} heading={words.offers} /> : null}
        </ProjectMedia>

        <ProjectStory project={project} />
        {project.testimonial && <ProjectQuote testimonial={project.testimonial} />}

        {related.length > 0 && (
          <section className="pp-more" aria-labelledby="more-title">
            <div className="wrap">
              <div className="pp-head2">
                <h2 id="more-title">مؤسسات تشبه هذه.</h2>
                <Link className="sx-go" href="/work">
                  كل الأعمال <Arrow />
                </Link>
              </div>
              <div className="pjt-grid">
                {related.map((p, i) => (
                  <WorkCard key={p.slug} project={p} tone={tones[i]} spans={spans.get(p.slug)} />
                ))}
              </div>
            </div>
          </section>
        )}

        <PageCta title="مؤسستك تحتاج شيئاً مشابهاً؟ نبدأ بجلسة نسمعك فيها.">
          <Button variant="line" href="/work">
            كل الأعمال
          </Button>
        </PageCta>
      </main>
      <SupportStrip whatsapp={settings.whatsapp_number} />
    </>
  )
}
