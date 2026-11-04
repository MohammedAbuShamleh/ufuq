import { Button } from '@/components/Button'
import { whatsappLink } from '@/lib/format'
import './contact.css'

/** For clients whose system already runs: straight to support, before the footer. */
export function SupportStrip({ whatsapp }: { whatsapp: string | null }) {
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
          <h2 id="sup-title">عندك نظام يعمل معنا؟</h2>
          <p>تواصل مع الدعم الفني مباشرة، واذكر اسم النظام والمشكلة، ونتابعها معك حتى تُحل.</p>
        </div>
        <Button variant="line" className="sup-btn" href={whatsappLink(whatsapp)} target="_blank" rel="noopener">
          <svg width="16" height="16" aria-hidden="true"><use href="#wa" /></svg> تواصل مع الدعم
        </Button>
      </div>
    </section>
  )
}
