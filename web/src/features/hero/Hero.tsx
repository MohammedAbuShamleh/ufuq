'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { ArchClip } from '@/components/ArchClip'
import { Button } from '@/components/Button'
import { Kicker } from '@/components/Kicker'
import { useMotionToggle } from '@/hooks/useMotionToggle'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { Dictionary } from '@/i18n/dictionaries/ar'
import './hero.css'

export type HeroCopy = Dictionary['hero'] & { startProject: string; motion: Dictionary['common']['motion'] }

/**
 * The visitor walks through the arch: as the page scrolls, --p goes 0→1 and
 * the arch grows past the screen while the copy lifts away. Without motion the
 * hero is a single still screen.
 */
export function Hero({ tagline, copy }: { tagline: string | null; copy: HeroCopy }) {
  const ref = useRef<HTMLElement>(null)
  const still = useReducedMotion()

  useEffect(() => {
    const hero = ref.current
    if (!hero) return
    if (still) {
      hero.style.setProperty('--p', '0')
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const span = hero.offsetHeight - innerHeight
      let p = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / span))
      p = p * p * (3 - 2 * p)
      hero.style.setProperty('--p', p.toFixed(4))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', update)
    update()
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', update)
      cancelAnimationFrame(raf)
    }
  }, [still])

  return (
    <section ref={ref} className="hx" id="hero" aria-labelledby="hero-title">
      <div className="hx-stick">
        {/* The arch's room: the height the words leave under them (see --aw-room). */}
        <div className="hx-stage">
          <div className="hx-rig" aria-hidden="true">
            <ArchClip className="hx-clip">
              <Image
                className="pc"
                src="/illustrations/hero-gate.png"
                width={1122}
                height={1402}
                alt=""
                preload
                // The arch grows almost 4x while crossing, so desktops take the full
                // 1122px picture; at 42vw a 1x screen got 806px, which went soft.
                sizes="(max-width: 960px) 80vw, 1122px"
              />
            </ArchClip>
            <svg className="hx-outline" viewBox="0 0 300 340" preserveAspectRatio="none">
              <path className="l" d="M150 -16 C74 6 -16 56 -16 146 V340" vectorEffect="non-scaling-stroke" />
              <path className="r" d="M150 -16 C226 6 316 56 316 146 V340" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </div>

        <div className="hx-copy">
          <Kicker still className="hx-k">
            {copy.kicker}
          </Kicker>
          <h1 id="hero-title" className="hx-title">
            {copy.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          {tagline && <p className="hx-niche">{tagline}</p>}
        </div>

        <div className="hx-live">
          <span className="hx-live-t" id="hx-live-t">
            {copy.liveTitle}
          </span>
          <ul aria-labelledby="hx-live-t">
            {copy.live.map(({ name, what }) => (
              <li key={name}>
                <i aria-hidden="true" />
                <b>{name}</b>
                <span>{what}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hx-side">
          <p>
            {copy.side.before}
            <bdi dir="ltr">{copy.side.ltr}</bdi>
            {copy.side.after}
          </p>
          <div className="hero-actions">
            <Button href="#contact" arrow>
              {copy.startProject}
            </Button>
            <Button href="#projects" variant="line">
              {copy.work}
            </Button>
          </div>
        </div>

        <MotionButton copy={copy.motion} />
        <a className="hx-cue" href="#difference">
          <span>{copy.cue}</span>
          <i />
        </a>
      </div>
    </section>
  )
}

function MotionButton({ copy }: { copy: HeroCopy['motion'] }) {
  const { off, toggle } = useMotionToggle()
  const ref = useRef<HTMLButtonElement>(null)

  // With motion the hero is a walk through the arch two and a half screens
  // long; without, one still screen. A press partway through would leave the
  // page past it, in the next section, with this button out of sight, so the
  // hero starts again from its top either way.
  const press = () => {
    toggle()
    const hero = ref.current?.closest('section')
    if (hero) scrollBy({ top: hero.getBoundingClientRect().top, behavior: 'instant' })
  }

  return (
    // The visible words are the name and say what a press does, so no pressed state.
    <button ref={ref} type="button" className="hx-mo" data-moves-page onClick={press}>
      <span className="mo-ic" aria-hidden="true" />
      <span>{off ? copy.on : copy.off}</span>
    </button>
  )
}
