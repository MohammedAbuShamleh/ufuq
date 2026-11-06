import { Button } from '@/components/Button'
import { Kicker } from '@/components/Kicker'
import { Reveal } from '@/components/Reveal'
import { SHOW_PENDING, whatsappLink } from '@/lib/format'
import type { Faq, Settings } from '@/lib/types'
import { ContactForm } from './ContactForm'
import './contact.css'

type Props = { settings: Settings; faqs: Faq[]; leadsEndpoint: string }

/** «لنبدأ»: WhatsApp, a booked call, or the form; then the questions people ask first. */
export function Contact({ settings, faqs, leadsEndpoint }: Props) {
  const whatsapp = whatsappLink(settings.whatsapp_number)
  // Until a number or a booking link is set, the form is the way in.
  const actions = SHOW_PENDING || Boolean(whatsapp || settings.booking_url)
  return (
    <section className="ctx" id="contact" aria-labelledby="cta-title">
      <div className="wrap ctx-grid">
        <div className="ctx-body">
          <Kicker>لنبدأ</Kicker>
          <Reveal as="h2" id="cta-title" words={['عندك ملف Excel', 'يُتعب فريقك؟']} />
          <p className="muted ctx-lead">أخبرنا كيف تعملون اليوم، ونقترح عليك النظام المناسب. الجلسة الأولى مجانية.</p>
          {actions && (
          <div className="ctx-actions">
            <Button variant="wa" href={whatsapp} target="_blank" rel="noopener">
              <svg width="18" height="18" aria-hidden="true"><use href="#wa" /></svg> تحدّث معنا على واتساب
            </Button>
            <Button variant="line" href={settings.booking_url} target="_blank" rel="noopener">
              احجز مكالمة ٣٠ دقيقة
            </Button>
          </div>
          )}
        </div>
        <div className="ctx-side">
          <ContactForm endpoint={leadsEndpoint} />
        </div>
      </div>

      {faqs.length > 0 && (
        <div className="wrap faq">
          <h3 className="faq-t">أسئلة نسمعها كثيراً</h3>
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
