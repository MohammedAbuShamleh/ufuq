import { AboutTeaser } from '@/features/about/AboutTeaser'
import { Approach } from '@/features/approach/Approach'
import { BeforeAfter } from '@/features/compare/BeforeAfter'
import { Contact } from '@/features/contact/Contact'
import { SupportStrip } from '@/features/contact/SupportStrip'
import { Featured } from '@/features/featured/Featured'
import { Hero } from '@/features/hero/Hero'
import { Journey } from '@/features/journey/Journey'
import { Services } from '@/features/services/Services'
import { Voices } from '@/features/voices/Voices'
import { OtherWork } from '@/features/work/OtherWork'
import { API_URL, getHome } from '@/lib/api'

export default async function HomePage() {
  const home = await getHome()

  return (
    <>
      <main id="top">
        <Hero tagline={home.settings.hero_tagline} />
        <BeforeAfter />
        <Featured projects={home.featured}>
          <OtherWork projects={home.projects} />
        </Featured>
        <AboutTeaser team={home.team} whyWeStarted={home.settings.why_we_started} />
        <Voices testimonials={home.testimonials} clients={home.clients} />
        <Services />
        <Approach />
        <Journey />
        <Contact settings={home.settings} faqs={home.faqs} leadsEndpoint={`${API_URL}/leads`} />
      </main>
      <SupportStrip whatsapp={home.settings.whatsapp_number} />
    </>
  )
}
