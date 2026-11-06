import Link from 'next/link'
import { Button } from '@/components/Button'
import { Kicker } from '@/components/Kicker'
import { LogoStory } from '@/features/about/LogoStory'
import { TeamCards } from '@/features/about/TeamCards'
import { SupportStrip } from '@/features/contact/SupportStrip'
import { href } from '@/i18n/config'
import { getDictionary, getLocale } from '@/i18n/server'
import { getSettings, getTeam } from '@/lib/api'
import { isPending, isShown } from '@/lib/format'
import { pageMetadata } from '@/lib/seo'
import { PageCta } from '../../_shell/PageCta'
import { PageHero } from '../../_shell/PageHero'
import '@/features/about/about-page.css'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getDictionary(locale)
  return pageMetadata({ locale, t, ...t.meta.about, path: '/about' })
}

export default async function AboutPage() {
  const locale = await getLocale()
  const [t, team, settings] = await Promise.all([getDictionary(locale), getTeam(locale), getSettings(locale)])
  const copy = t.aboutPage

  return (
    <>
      <main id="top" className="inner about-page">
        <PageHero kicker={copy.kicker} title={copy.title} accent={copy.accent}>
          <p className="apg-lead">{copy.lead}</p>
          <div className="apg-stats">
            {t.stats.map((s) => (
              <div key={s.label}>
                <b dir={s.ltr ? 'ltr' : undefined}>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </PageHero>

        <section className="apg-team" aria-labelledby="team-title">
          <div className="wrap">
            <div className="apg-sec-head">
              <Kicker>{copy.teamKicker}</Kicker>
              <h2 id="team-title">{copy.teamTitle}</h2>
              <p className="muted">{copy.teamText}</p>
            </div>
            <TeamCards team={team} copy={t.team} />
          </div>
        </section>

        <section className="apg-story" aria-labelledby="story-title">
          <div className="wrap apg-story-grid">
            <div>
              <Kicker>{copy.storyKicker}</Kicker>
              <h2 id="story-title">{copy.storyTitle}</h2>
              <Pending className="apg-why" text={settings.why_we_started} placeholder={copy.whyPending} />
              <p className="apg-p">{copy.story}</p>
            </div>
            <LogoStory copy={t.logoStory} />
          </div>
        </section>

        <section className="apg-where" aria-labelledby="where-title">
          <div className="wrap">
            <div className="apg-sec-head">
              <Kicker>{copy.whereKicker}</Kicker>
              <h2 id="where-title">{copy.whereTitle}</h2>
            </div>
            <ul className="where-grid">
              {copy.where.map((w) => (
                <li key={w.country}>
                  <span className="w-c">{w.country}</span>
                  <span className="w-n">{w.note}</span>
                  <p>{w.clients}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="apg-found" aria-labelledby="found-title">
          <div className="wrap">
            <div className="apg-sec-head">
              <Kicker>{copy.foundKicker}</Kicker>
              <h2 id="found-title">{copy.foundTitle}</h2>
            </div>
            <ul className="found-grid">
              {isShown(settings.legal_registration) && (
                <li>
                  <b>{copy.legal}</b>
                  <Pending text={settings.legal_registration} placeholder={copy.legalPending} />
                </li>
              )}
              {isShown(settings.memberships) && (
                <li>
                  <b>{copy.memberships}</b>
                  <Pending text={settings.memberships} placeholder={copy.membershipsPending} />
                </li>
              )}
              <li>
                <b>{copy.data}</b>
                <p>
                  {`${copy.dataText} `}
                  <Link href={href(locale, '/privacy')}>{copy.dataLink}</Link>
                </p>
              </li>
              <li>
                <b>{copy.after}</b>
                <p>{copy.afterText}</p>
              </li>
            </ul>
          </div>
        </section>

        <PageCta title={copy.cta}>
          <Button variant="line" href={href(locale, '/work')}>
            {copy.ctaWork}
          </Button>
        </PageCta>
      </main>
      <SupportStrip whatsapp={settings.whatsapp_number} />
    </>
  )
}

/**
 * A setting the client has not filled yet: its placeholder, marked as pending,
 * in a preview build; nothing on the live site.
 */
function Pending({ text, placeholder, className }: { text: string | null; placeholder: string; className?: string }) {
  if (!isShown(text)) return null
  const pending = isPending(text)
  const cls = [className, pending && 'pending-txt'].filter(Boolean).join(' ') || undefined
  return <p className={cls}>{pending ? (text ?? placeholder) : text}</p>
}
