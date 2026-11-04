'use client'

// A client component so it can use the compound <ScreenTabs.Tab> API: a server
// component cannot dot into a client module.
import Link from 'next/link'
import { Button } from '@/components/Button'
import { DemoPill } from '@/components/DemoPill'
import type { FeaturedProject } from '@/lib/types'
import { arrangeScreens, SIMILAR, THEMES } from './screens'
import { ScreenTabs } from './ScreenTabs'

const pad = (n: number) => String(n).padStart(2, '0')
const PHONE_SIZES = '(max-width: 560px) 78px, 170px'
const DESKTOP_SIZES = '(max-width: 960px) 100vw, 760px'

type Props = {
  project: FeaturedProject
  /** On the home stack: the card's place («01/04»), and its title links to the project page. */
  place?: { index: number; total: number }
  /** On the project page the card is the page's heading. */
  heading?: 'h1' | 'h3'
  contactHref?: string
}

export function FeaturedCard({ project, place, heading: Heading = 'h3', contactHref = '#contact' }: Props) {
  const theme = THEMES[project.card_theme ?? 'linen']
  const similar = SIMILAR[project.type]
  const { tabs, desktop, phones, ratio } = arrangeScreens(project.screens)
  const visual = desktop.length > 0 || phones.length > 0
  // Even cards mirror: screens first. A card with no screens is text only.
  const cls = ['feat', place && place.index % 2 ? 'rev' : '', !visual && 'solo', desktop.length === 0 && phones.length > 0 && 'phones-only', theme.className]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={cls}>
      <div className="feat-body">
        {place && (
          <div className="feat-num" aria-hidden="true">
            <b>{pad(place.index + 1)}</b>
            <span>/{pad(place.total)}</span>
          </div>
        )}
        {project.tag && <span className="feat-tag">{project.tag}</span>}
        <Heading className={project.card_theme === 'sand' ? 'nx-title' : undefined}>
          {place ? <Link href={`/work/${project.slug}`}>{project.title}</Link> : project.title}
        </Heading>
        {project.summary && <p className="feat-lead">{project.summary}</p>}
        {project.highlights.length > 0 && (
          <ul className="feat-list">
            {project.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        {project.facts.length > 0 && (
          <div className="feat-facts">
            {project.facts.map((f) => (
              <div key={f.label}>
                <strong>{f.value}</strong>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        )}
        <div className="feat-foot">
          {project.tech_stack && <span className="pj-tech">{project.tech_stack.join(' · ')}</span>}
          <Button href={contactHref} variant={theme.button} size="sm" arrow data-type={similar.formType}>
            {similar.label}
          </Button>
        </div>
      </div>

      {visual && (
        <ScreenTabs initial={tabs[0]?.key ?? ''} className="feat-visual">
          {tabs.length > 1 && (
            <ScreenTabs.List label={`شاشات ${project.title}`}>
              {tabs.map((t) => (
                <ScreenTabs.Tab key={t.key} value={t.key}>
                  {t.label}
                </ScreenTabs.Tab>
              ))}
            </ScreenTabs.List>
          )}
          {desktop.length > 0 && (
            <ScreenTabs.Frame label={project.frame_label ?? project.title} demo={project.has_demo_data && <DemoPill />} ratio={ratio}>
              {desktop.map(({ key, screen }, i) => (
                <ScreenTabs.Shot key={i} value={key} screen={screen} sizes={DESKTOP_SIZES} />
              ))}
            </ScreenTabs.Frame>
          )}
          {phones.map((phone, i) =>
            phone.kind === 'stack' ? (
              <div key={i} className={`pframe p${i + 1} ph-stack`}>
                {phone.shots.map(({ key, screen }, j) => (
                  <ScreenTabs.Shot key={j} value={key} screen={screen} sizes={PHONE_SIZES} />
                ))}
              </div>
            ) : (
              <div key={i} className={`pframe p${i + 1}`}>
                <ScreenTabs.Shot screen={phone.screen} sizes={PHONE_SIZES} />
              </div>
            ),
          )}
        </ScreenTabs>
      )}
    </article>
  )
}
