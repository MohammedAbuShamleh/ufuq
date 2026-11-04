import type { ReactNode } from 'react'
import { Kicker } from '@/components/Kicker'

/** An inner page's opening: kicker, a two-line title (the second in the accent), and a lead. */
export function PageHero({ kicker, title, accent, children }: { kicker: string; title: string; accent?: string; children?: ReactNode }) {
  return (
    <section className="apg-hero" aria-labelledby="page-title">
      <div className="wrap">
        <Kicker>{kicker}</Kicker>
        <h1 id="page-title">
          {title}
          {accent && (
            <>
              <br />
              <span>{accent}</span>
            </>
          )}
        </h1>
        {children}
      </div>
    </section>
  )
}
