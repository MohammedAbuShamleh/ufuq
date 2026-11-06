import { Button } from '@/components/Button'
import { SupportStrip } from '@/features/contact/SupportStrip'
import { AllWork } from '@/features/work/AllWork'
import { href } from '@/i18n/config'
import { getDictionary, getLocale } from '@/i18n/server'
import { getProjects, getSettings } from '@/lib/api'
import { pageMetadata } from '@/lib/seo'
import { PageCta } from '../../_shell/PageCta'
import { PageHero } from '../../_shell/PageHero'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getDictionary(locale)
  return pageMetadata({ locale, t, ...t.meta.work, path: '/work' })
}

export default async function WorkPage() {
  const locale = await getLocale()
  const [t, projects, settings] = await Promise.all([getDictionary(locale), getProjects(locale), getSettings(locale)])
  const copy = t.workPage

  return (
    <>
      <main id="top" className="inner work-page">
        <PageHero kicker={copy.kicker} title={copy.title} accent={copy.accent}>
          <p className="apg-lead">{copy.lead}</p>
        </PageHero>

        <section className="wk-list" aria-label={copy.list}>
          <div className="wrap">
            <AllWork projects={projects} copy={t.work} />
          </div>
        </section>

        <PageCta title={copy.cta}>
          <Button variant="line" href={href(locale, '/about')}>
            {copy.ctaAbout}
          </Button>
        </PageCta>
      </main>
      <SupportStrip whatsapp={settings.whatsapp_number} />
    </>
  )
}
