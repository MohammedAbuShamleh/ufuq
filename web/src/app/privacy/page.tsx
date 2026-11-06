import { SupportStrip } from '@/features/contact/SupportStrip'
import { getSettings } from '@/lib/api'
import { SHOW_PENDING } from '@/lib/format'
import { pageMetadata } from '@/lib/seo'
import { PageHero } from '../_shell/PageHero'
import './privacy.css'

export const metadata = pageMetadata({
  title: 'سياسة الخصوصية',
  description: 'ما تجمعه أفق عبر موقعها، وكيف تُعامل بيانات المؤسسات في الأنظمة التي تبنيها، ولماذا لا تُشارك مع أحد.',
  path: '/privacy',
})

const EMAIL = /([\w.+-]+@[\w-]+\.[\w.]+)/

export default async function PrivacyPage() {
  const settings = await getSettings()
  const sections = settings.privacy_policy ?? []

  return (
    <>
      <main id="top" className="inner privacy-page">
        <PageHero kicker="الخصوصية" title="سياسة الخصوصية">
          {SHOW_PENDING && settings.privacy_is_draft && <span className="pv-draft">مسودة للمراجعة</span>}
        </PageHero>
        <section className="pv-page">
          <div className="wrap">
            <div className="pv-text">
              {SHOW_PENDING && sections.length === 0 && <p className="pending-txt">[نص سياسة الخصوصية]</p>}
              {sections.map((s) => (
                <section key={s.heading}>
                  <h2>{s.heading}</h2>
                  {s.paragraphs.map((p) => (
                    <p key={p}>{withEmailLinks(p)}</p>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SupportStrip whatsapp={settings.whatsapp_number} />
    </>
  )
}

/** An address in the text becomes a mailto link, read left to right. */
function withEmailLinks(text: string) {
  return text.split(EMAIL).map((part, i) =>
    i % 2 ? (
      <a key={i} href={`mailto:${part}`} dir="ltr">
        {part}
      </a>
    ) : (
      part
    ),
  )
}
