import { Button } from '@/components/Button'
import { Kicker } from '@/components/Kicker'
import { Reveal } from '@/components/Reveal'
import { ar } from '@/i18n/dictionaries/ar'
import { getDictionary } from '@/i18n/server'
import { SHOW_PENDING, whatsappLink } from '@/lib/format'
import type { Faq, Settings } from '@/lib/types'
import { ContactForm } from './ContactForm'
import './contact.css'

type Props = { settings: Settings; faqs: Faq[]; leadsEndpoint: string }

/** «لنبدأ»: WhatsApp, a booked call, or the form; then the questions people ask first. */
export async function Contact({ settings, faqs, leadsEndpoint }: Props) {
  const t = await getDictionary()
  const copy = t.contact
  const whatsapp = whatsappLink(settings.whatsapp_number)
  // Until a number or a booking link is set, the form is the way in.
  const actions = SHOW_PENDING || Boolean(whatsapp || settings.booking_url)
  return (
    <section className="ctx" id="contact" aria-labelledby="cta-title">
      <div className="wrap ctx-grid">
        <div className="ctx-body">
          <Kicker>{copy.kicker}</Kicker>
          <Reveal as="h2" id="cta-title" words={copy.title} />
          <p className="muted ctx-lead">{copy.lead}</p>
          {actions && (
          <div className="ctx-actions">
            <Button variant="wa" href={whatsapp} target="_blank" rel="noopener" pendingTitle={t.common.pendingLink}>
              <svg width="18" height="18" aria-hidden="true"><use href="#wa" /></svg> {copy.whatsapp}
            </Button>
            <Button variant="line" href={settings.booking_url} target="_blank" rel="noopener" pendingTitle={t.common.pendingLink}>
              {copy.book}
            </Button>
          </div>
          )}
        </div>
        <div className="ctx-side">
          {/* The dashboard lists leads by their Arabic project kind, whatever the page's language. */}
          <ContactForm endpoint={leadsEndpoint} copy={t.contactForm} submitAs={ar.contactForm.types} />
        </div>
      </div>

      {faqs.length > 0 && (
        <div className="wrap faq">
          <h3 className="faq-t">{copy.faq}</h3>
          <div className="faq-list">
            {faqs.map((f) => (
              <details key={f.question} className="faq-i">
                <summary>
                  {f.question}
                  <span aria-hidden="true" />
                </summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
