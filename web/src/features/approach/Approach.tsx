import type { CSSProperties, ReactNode } from 'react'
import { Kicker } from '@/components/Kicker'
import { Reveal } from '@/components/Reveal'
import type { RuleKey } from '@/i18n/dictionaries/ar'
import { getDictionary } from '@/i18n/server'
import { RuleDeck } from './RuleDeck'
import { TestsGrid } from './TestsGrid'
import './approach.css'

const ICON = { viewBox: '0 0 48 48', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' } as const

/** The tests rule shows its test run instead of an icon. */
const ICONS: Partial<Record<RuleKey, ReactNode>> = {
  audit: (
    <svg {...ICON}>
      <rect x="9" y="7" width="30" height="34" rx="4" />
      <path d="M16 16h16M16 23h16M16 30h10" />
      <circle cx="35" cy="35" r="7" className="apc-ico-fill" />
      <path d="M35 31.5V35l2.5 1.5" />
    </svg>
  ),
  receipts: (
    <svg {...ICON}>
      <path d="M12 6h24v36l-4-3-4 3-4-3-4 3-4-3-4 3z" />
      <path d="M18 16h12M18 23h12" />
      <path d="M16 31h16" strokeDasharray="2 3" />
    </svg>
  ),
  permissions: (
    <svg {...ICON} strokeLinejoin="round">
      <path d="M24 5l15 6v11c0 10-6.5 17.5-15 21-8.5-3.5-15-11-15-21V11z" />
      <rect x="17" y="21" width="14" height="11" rx="2" />
      <path d="M20 21v-3a4 4 0 0 1 8 0v3" />
    </svg>
  ),
  demo: (
    <svg {...ICON}>
      <rect x="6" y="28" width="10" height="12" rx="2" />
      <rect x="19" y="19" width="10" height="21" rx="2" />
      <rect x="32" y="9" width="10" height="31" rx="2" />
      <path d="M8 20l9-7 9 4 12-9" />
    </svg>
  ),
  code: (
    <svg {...ICON} strokeLinejoin="round">
      <path d="M17 15l-9 9 9 9M31 15l9 9-9 9M27 11l-6 26" />
    </svg>
  ),
}

/** How many tests the «أثر» run shows (the tests rule's source names the same number). */
const TESTS = 88

/** «طريقتنا»: six rules, each with the project where it runs today. */
export async function Approach() {
  const copy = (await getDictionary()).approach
  return (
    <section className="ap2" id="approach" aria-labelledby="ap-title">
      <RuleDeck
        copy={copy.view}
        head={
          <>
            <Kicker>{copy.kicker}</Kicker>
            <Reveal as="h2" id="ap-title" words={copy.title} />
            <p>{copy.lead}</p>
          </>
        }
      >
        {copy.rules.map((r, i) => (
          <li key={r.title} className="apc" style={{ '--i': i } as CSSProperties}>
            <div className="apc-top">
              <span className="apc-n">{copy.numbers[i]}</span>
              {ICONS[r.key] && (
                <span className="apc-ico" aria-hidden="true">
                  {ICONS[r.key]}
                </span>
              )}
            </div>
            <h3>{r.title}</h3>
            <p>
              {r.text}
              {r.key === 'tests' && <TestsGrid total={TESTS} copy={copy.tests} />}
            </p>
            <span className="apc-src">{r.source}</span>
          </li>
        ))}
      </RuleDeck>
    </section>
  )
}
