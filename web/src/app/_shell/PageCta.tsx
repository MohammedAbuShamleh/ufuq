import type { ReactNode } from 'react'
import { Button } from '@/components/Button'
import { href } from '@/i18n/config'
import { getDictionary, getLocale } from '@/i18n/server'

/** The dark closing panel of an inner page: one line and the way to start. */
export async function PageCta({ title, children }: { title: string; children?: ReactNode }) {
  const locale = await getLocale()
  const t = await getDictionary(locale)
  return (
    <section className="apg-cta">
      <div className="wrap apg-cta-in">
        <h2>{title}</h2>
        <div className="apg-cta-actions">
          <Button href={href(locale, '/#contact')} arrow>
            {t.common.startProject}
          </Button>
          {children}
        </div>
      </div>
    </section>
  )
}
