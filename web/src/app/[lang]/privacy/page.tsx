import { SupportStrip } from '@/features/contact/SupportStrip'
import { getDictionary, getLocale } from '@/i18n/server'
import { getSettings } from '@/lib/api'
import { SHOW_PENDING } from '@/lib/format'
import { pageMetadata } from '@/lib/seo'
import { PageHero } from '../../_shell/PageHero'
import { PrivacyIndex } from './PrivacyIndex'
import './privacy.css'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getDictionary(locale)
  return pageMetadata({ locale, t, ...t.meta.privacy, path: '/privacy' })
}

const EMAIL = /([\w.+-]+@[\w-]+\.[\w.]+)/

export default async function PrivacyPage() {
  const locale = await getLocale()
  const [t, settings] = await Promise.all([getDictionary(locale), getSettings(locale)])
  const copy = t.privacy
  const sections = (settings.privacy_policy ?? []).map((s, i) => ({ ...s, id: `pv-${i + 1}` }))

  return (
    <>
      <main id="top" className="inner privacy-page">
        <PageHero kicker={copy.kicker} title={copy.title}>
          {SHOW_PENDING && settings.privacy_is_draft && <span className="pv-draft">{copy.draft}</span>}
        </PageHero>
        <section className="pv-page">
          <div className="wrap pv-grid">
            <div className="pv-text">
              {SHOW_PENDING && sections.length === 0 && <p className="pending-txt">{copy.pending}</p>}
              {sections.map((s) => (
                <section key={s.id} id={s.id}>
                  <h2>{s.heading}</h2>
                  {s.paragraphs.map((p) => (
                    <p key={p}>{withEmailLinks(p)}</p>
                  ))}
                </section>
              ))}
            </div>
            {sections.length > 1 && (
              <PrivacyIndex sections={sections.map(({ id, heading }) => ({ id, heading }))} copy={{ label: copy.index, of: copy.of }} />
            )}
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
