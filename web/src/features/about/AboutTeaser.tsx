import Link from 'next/link'
import { Arrow } from '@/components/Button'
import { Kicker } from '@/components/Kicker'
import { Reveal } from '@/components/Reveal'
import { href } from '@/i18n/config'
import { getDictionary, getLocale } from '@/i18n/server'
import { isPending, isShown } from '@/lib/format'
import type { TeamMember } from '@/lib/types'
import { TeamPerson } from './TeamPerson'
import './about.css'

/** «من نحن» in short: who we are, three numbers, the team; the full story is on /about. */
export async function AboutTeaser({ team, whyWeStarted }: { team: TeamMember[]; whyWeStarted: string | null }) {
  const locale = await getLocale()
  const t = await getDictionary(locale)
  const copy = t.aboutTeaser
  const why = isPending(whyWeStarted) ? null : whyWeStarted
  // On the live site a teammate whose name has not arrived yet is left out.
  const people = team.filter((m) => isShown(m.name))

  return (
    <section className="ab ab-short" id="about" aria-labelledby="ab-title">
      <div className="wrap ab-sgrid">
        <div className="ab-body">
          <Kicker>{copy.kicker}</Kicker>
          <Reveal as="h2" id="ab-title" words={copy.title} />
          <p className="ab-lead">{copy.lead}</p>
          {isShown(whyWeStarted) && (
            <p className={`ab-why muted${why ? '' : ' pending-txt'}`}>{why ?? whyWeStarted ?? copy.whyPending}</p>
          )}
          <Link className="sx-go ab-more" href={href(locale, '/about')}>
            {copy.more} <Arrow />
          </Link>
        </div>
        <div className="ab-side">
          <div className="ab-stats">
            {t.stats.map((s) => (
              <div key={s.label}>
                <b dir={s.ltr ? 'ltr' : undefined}>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          {people.length > 0 && (
            <div className="ab-team">
              <span className="ab-team-t">{copy.team}</span>
              <div className="ab-people">
                {people.map((m, i) => (
                  <TeamPerson key={i} member={m} copy={t.team} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
