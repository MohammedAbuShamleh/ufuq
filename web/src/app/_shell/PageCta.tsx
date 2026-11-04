import type { ReactNode } from 'react'
import { Button } from '@/components/Button'

/** The dark closing panel of an inner page: one line and the way to start. */
export function PageCta({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section className="apg-cta">
      <div className="wrap apg-cta-in">
        <h2>{title}</h2>
        <div className="apg-cta-actions">
          <Button href="/#contact" arrow>
            ابدأ مشروعك
          </Button>
          {children}
        </div>
      </div>
    </section>
  )
}
