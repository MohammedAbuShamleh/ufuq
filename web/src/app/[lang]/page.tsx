import type { Metadata } from 'next'
import { AboutTeaser } from '@/features/about/AboutTeaser'
import { Approach } from '@/features/approach/Approach'
import { BeforeAfter } from '@/features/compare/BeforeAfter'
import { Contact } from '@/features/contact/Contact'
import { SupportStrip } from '@/features/contact/SupportStrip'
import { FeaturedProjects } from '@/features/featured/FeaturedProjects'
import { Hero } from '@/features/hero/Hero'
import { Journey } from '@/features/journey/Journey'
import { Services } from '@/features/services/Services'
import { Voices } from '@/features/voices/Voices'
import { OtherWork } from '@/features/work/OtherWork'
import { getDictionary, getLocale } from '@/i18n/server'
import { API_URL, getHome } from '@/lib/api'
import { alternates } from '@/lib/seo'

// Only the addresses: the title and share preview are the layout's defaults.
// (In the layout they would also mark the 404 page as the home page.)
export async function generateMetadata(): Promise<Metadata> {
  return { alternates: alternates(await getLocale(), '/') }
}

export default async function HomePage() {
  const locale = await getLocale()
  const [t, home] = await Promise.all([getDictionary(locale), getHome(locale)])

  return (
    <>
      <main id="top">
        <Hero tagline={home.settings.hero_tagline} copy={{ ...t.hero, startProject: t.common.startProject, motion: t.common.motion }} />
        <BeforeAfter copy={t.compare} />
        <FeaturedProjects projects={home.featured}>
          <OtherWork projects={home.projects} copy={{ ...t.otherWork, types: t.work.types }} />
        </FeaturedProjects>
        <AboutTeaser team={home.team} whyWeStarted={home.settings.why_we_started} />
        <Voices testimonials={home.testimonials} clients={home.clients} copy={t.voices} />
        <Services copy={t.services} />
        <Approach />
        <Journey copy={t.journey} />
        <Contact settings={home.settings} faqs={home.faqs} leadsEndpoint={`${API_URL}/leads`} />
      </main>
      <SupportStrip whatsapp={home.settings.whatsapp_number} />
    </>
  )
}
