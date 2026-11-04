'use client'

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { imgAttrs, isVideo } from '@/lib/media'
import type { Screen } from '@/lib/types'

type Ctx = { active: string; select: (key: string) => void; playing: boolean; still: boolean }
const TabsContext = createContext<Ctx | null>(null)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('ScreenTabs parts must sit inside <ScreenTabs>')
  return ctx
}

/**
 * A project's screens behind a row of tabs. Every <ScreenTabs.Shot> with the
 * active tab's key shows, so the desktop frame and the phones change together.
 * Videos play only while the card is on screen and motion is allowed.
 */
export function ScreenTabs({ initial, className, children }: { initial: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, select] = useState(initial)
  const inView = useInView(ref, { threshold: 0.25 })
  const still = useReducedMotion()

  return (
    <TabsContext value={{ active, select, playing: inView && !still, still }}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </TabsContext>
  )
}

function List({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="feat-tabs" role="tablist" aria-label={label}>
      {children}
    </div>
  )
}

function Tab({ value, children }: { value: string; children: ReactNode }) {
  const { active, select } = useTabs()
  const on = active === value
  return (
    <button type="button" role="tab" aria-selected={on} className={on ? 'on' : undefined} onClick={() => select(value)}>
      {children}
    </button>
  )
}

/** One screen. Without a value it always shows (a phone that does not follow the tabs). */
function Shot({ value, screen, sizes }: { value?: string; screen: Screen; sizes: string }) {
  const { active, playing, still } = useTabs()
  const on = value === undefined || value === active
  const videoRef = useRef<HTMLVideoElement>(null)
  const file = screen.file

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (on && playing) {
      video.currentTime = 0
      video.play().catch(() => {})
    } else video.pause()
  }, [on, playing])

  if (!file) return null
  const cls = on ? 'on' : undefined

  if (isVideo(file)) {
    return (
      <video ref={videoRef} className={cls} muted loop playsInline preload="metadata" controls={still} aria-label={screen.alt ?? undefined}>
        <source src={file.url} type="video/mp4" />
      </video>
    )
  }
  // eslint-disable-next-line @next/next/no-img-element -- the API already serves the webp widths (see imgAttrs)
  return <img {...imgAttrs(file, sizes)} className={cls} alt={screen.alt ?? ''} loading="lazy" decoding="async" />
}

/** The browser window around desktop screens, sized to the first screen. */
function Frame({ label, demo, ratio, children }: { label: string; demo?: ReactNode; ratio: string; children: ReactNode }) {
  return (
    <div className="bframe">
      <div className="bbar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{label}</span>
        {demo}
      </div>
      <div className="bshot" style={{ '--ar': ratio } as CSSProperties}>
        {children}
      </div>
    </div>
  )
}

ScreenTabs.List = List
ScreenTabs.Tab = Tab
ScreenTabs.Shot = Shot
ScreenTabs.Frame = Frame
