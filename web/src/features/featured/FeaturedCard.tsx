'use client'

// A client component so it can use the compound <ScreenTabs.Tab> API: a server
// component cannot dot into a client module.
import { Button } from '@/components/Button'
import { DemoPill } from '@/components/DemoPill'
import type { FeaturedProject } from '@/lib/types'
import { arrangeScreens, SIMILAR, THEMES } from './screens'
import { ScreenTabs } from './ScreenTabs'

const pad = (n: number) => String(n).padStart(2, '0')
const PHONE_SIZES = '(max-width: 560px) 78px, 170px'
const DESKTOP_SIZES = '(max-width: 960px) 100vw, 760px'

export function FeaturedCard({ project, index, total }: { project: FeaturedProject; index: number; total: number }) {
  const theme = THEMES[project.card_theme ?? 'linen']
  const similar = SIMILAR[project.type]
  const { tabs, desktop, phones, ratio } = arrangeScreens(project.screens)
  // Even cards mirror: screens first.
  const cls = ['feat', index % 2 ? 'rev' : '', theme.className].filter(Boolean).join(' ')

  return (
    <article className={cls}>
      <div className="feat-body">
        <div className="feat-num" aria-hidden="true">
          <b>{pad(index + 1)}</b>
          <span>/{pad(total)}</span>
        </div>
        {project.tag && <span className="feat-tag">{project.tag}</span>}
        <h3 className={project.card_theme === 'sand' ? 'nx-title' : undefined}>{project.title}</h3>
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
          <Button href="#contact" variant={theme.button} size="sm" arrow data-type={similar.formType}>
            {similar.label}
          </Button>
        </div>
      </div>

      {desktop.length > 0 && (
        <ScreenTabs initial={tabs[0].key} className="feat-visual">
          {tabs.length > 1 && (
            <ScreenTabs.List label={`شاشات ${project.title}`}>
              {tabs.map((t) => (
                <ScreenTabs.Tab key={t.key} value={t.key}>
                  {t.label}
                </ScreenTabs.Tab>
              ))}
            </ScreenTabs.List>
          )}
          <ScreenTabs.Frame label={project.frame_label ?? project.title} demo={project.has_demo_data && <DemoPill />} ratio={ratio}>
            {desktop.map(({ key, screen }, i) => (
              <ScreenTabs.Shot key={i} value={key} screen={screen} sizes={DESKTOP_SIZES} />
            ))}
          </ScreenTabs.Frame>
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
