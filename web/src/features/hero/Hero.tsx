'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { ArchClip } from '@/components/ArchClip'
import { Button } from '@/components/Button'
import { Kicker } from '@/components/Kicker'
import { useMotionToggle } from '@/hooks/useMotionToggle'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import './hero.css'

// Systems running today, named the way their users know them.
const LIVE = [
  { name: 'ساعد', what: 'إدارة المشاريع الإنسانية' },
  { name: 'دار الإتقان', what: 'حلقات التحفيظ وتطبيق المحفّظين' },
  { name: 'مدرسة شعاع', what: 'إدارة المدرسة' },
  { name: 'رصرص', what: 'ERP · مصر' },
  { name: 'NexaBridge', what: 'منصة منتجات · دبي' },
]

/**
 * The visitor walks through the arch: as the page scrolls, --p goes 0→1 and
 * the arch grows past the screen while the copy lifts away. Without motion the
 * hero is a single still screen.
 */
export function Hero({ tagline }: { tagline: string | null }) {
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
                sizes="(max-width: 960px) 80vw, 42vw"
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
            أفق للبرمجيات
          </Kicker>
          <h1 id="hero-title" className="hx-title">
            <span>نبني برمجيات</span>
            <span>تفتح أفقاً أوسع.</span>
          </h1>
          {tagline && <p className="hx-niche">{tagline}</p>}
        </div>

        <div className="hx-live">
          <span className="hx-live-t" id="hx-live-t">
            أنظمة تعمل اليوم
          </span>
          <ul aria-labelledby="hx-live-t">
            {LIVE.map(({ name, what }) => (
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
            مواقع وأنظمة <bdi dir="ltr">ERP</bdi> ومنصات، عربية من الأساس.
          </p>
          <div className="hero-actions">
            <Button href="#contact" arrow>
              ابدأ مشروعك
            </Button>
            <Button href="#projects" variant="line">
              أعمالنا
            </Button>
          </div>
        </div>

        <MotionButton />
        <a className="hx-cue" href="#difference">
          <span>مرّر لتعبر البوابة</span>
          <i />
        </a>
      </div>
    </section>
  )
}

function MotionButton() {
  const { off, toggle } = useMotionToggle()
  return (
    <button type="button" className="hx-mo" aria-label="إيقاف الحركة" aria-pressed={off} onClick={toggle}>
      <span className="mo-ic" aria-hidden="true" />
      <span>{off ? 'تشغيل الحركة' : 'إيقاف الحركة'}</span>
    </button>
  )
}
