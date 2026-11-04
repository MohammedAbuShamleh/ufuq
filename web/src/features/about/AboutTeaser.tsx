import Link from 'next/link'
import { Arrow } from '@/components/Button'
import { Kicker } from '@/components/Kicker'
import { Reveal } from '@/components/Reveal'
import { isPending } from '@/lib/format'
import type { TeamMember } from '@/lib/types'
import { STATS } from './stats'
import { TeamPerson } from './TeamPerson'
import './about.css'

/** «من نحن» in short: who we are, three numbers, the team; the full story is on /about. */
export function AboutTeaser({ team, whyWeStarted }: { team: TeamMember[]; whyWeStarted: string | null }) {
  const why = isPending(whyWeStarted) ? null : whyWeStarted

  return (
    <section className="ab ab-short" id="about" aria-labelledby="ab-title">
      <div className="wrap ab-sgrid">
        <div className="ab-body">
          <Kicker>من نحن</Kicker>
          <Reveal as="h2" id="ab-title" words={['شركة برمجيات من غزة،', 'تبني أنظمة للمؤسسات التي تخدم الناس.']} />
          <p className="ab-lead">نبني منذ ٢٠٢٢ أنظمة للجمعيات والمدارس والجهات الحكومية والشركات، ونبدأ كل نظام بالجلوس مع من سيستخدمه.</p>
          <p className={`ab-why muted${why ? '' : ' pending-txt'}`}>{why ?? whyWeStarted ?? '[لماذا بدأنا: جملة أو جملتان بكلامكما]'}</p>
          <Link className="sx-go ab-more" href="/about">
            اقرأ قصتنا كاملة <Arrow />
          </Link>
        </div>
        <div className="ab-side">
          <div className="ab-stats">
            {STATS.map((s) => (
              <div key={s.label}>
                <b dir={s.ltr ? 'ltr' : undefined}>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          {team.length > 0 && (
            <div className="ab-team">
              <span className="ab-team-t">الفريق</span>
              <div className="ab-people">
                {team.map((m, i) => (
                  <TeamPerson key={i} member={m} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
