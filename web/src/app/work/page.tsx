import { Button } from '@/components/Button'
import { SupportStrip } from '@/features/contact/SupportStrip'
import { AllWork } from '@/features/work/AllWork'
import { getProjects, getSettings } from '@/lib/api'
import { pageMetadata } from '@/lib/seo'
import { PageCta } from '../_shell/PageCta'
import { PageHero } from '../_shell/PageHero'

export const metadata = pageMetadata({
  title: 'أعمالنا',
  description:
    'أنظمة ومنصات وتطبيقات ومواقع بنتها أفق لجمعيات ومدارس وجهات حكومية وشركات في فلسطين ومصر والإمارات وتركيا. صنّفها حسب النوع أو القطاع.',
  path: '/work',
})

export default async function WorkPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()])

  return (
    <>
      <main id="top" className="inner work-page">
        <PageHero kicker="أعمالنا" title="ما بنيناه للمؤسسات،" accent="وما زال يعمل.">
          <p className="apg-lead">
            عيّنة من أكثر من ٥٠ نظاماً بنيناها منذ ٢٠٢٢: منصات وأنظمة إدارة ومالية وتطبيقات ومواقع، لجمعيات ومدارس وجهات حكومية وشركات. اختر النوع أو
            القطاع لترى ما يشبه مؤسستك.
          </p>
        </PageHero>

        <section className="wk-list" aria-label="كل الأعمال">
          <div className="wrap">
            <AllWork projects={projects} />
          </div>
        </section>

        <PageCta title="لم تجد ما يشبه مؤسستك؟ نبدأ من احتياجك.">
          <Button variant="line" href="/about">
            من نحن
          </Button>
        </PageCta>
      </main>
      <SupportStrip whatsapp={settings.whatsapp_number} />
    </>
  )
}
