import { Button } from '@/components/Button'
import { getDictionary } from '@/i18n/server'
import { SHOW_PENDING, whatsappLink } from '@/lib/format'
import './contact.css'

/**
 * For clients whose system already runs: straight to support, before the
 * footer. Without a support number there is nowhere to send them, so the strip
 * is left out of the live site.
 */
export async function SupportStrip({ whatsapp }: { whatsapp: string | null }) {
  const href = whatsappLink(whatsapp)
  if (!href && !SHOW_PENDING) return null
  const t = await getDictionary()
  return (
    <section className="sup" aria-labelledby="sup-title">
      <div className="wrap sup-in">
        <span className="sup-ic" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 13a8 8 0 0 1 16 0" />
            <rect x="3" y="13" width="4" height="6" rx="1.5" />
            <rect x="17" y="13" width="4" height="6" rx="1.5" />
            <path d="M19 19c0 1.5-1.5 2.5-4 2.5h-2" />
          </svg>
        </span>
        <div className="sup-t">
          <h2 id="sup-title">{t.support.title}</h2>
          <p>{t.support.text}</p>
        </div>
        <Button variant="line" className="sup-btn" href={href} target="_blank" rel="noopener" pendingTitle={t.common.pendingLink}>
          <svg width="16" height="16" aria-hidden="true"><use href="#wa" /></svg> {t.support.button}
        </Button>
      </div>
    </section>
  )
}
