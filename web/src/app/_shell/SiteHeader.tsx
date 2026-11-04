'use client'

import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Button } from '@/components/Button'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

const LINKS = [
  { id: 'top', label: 'الرئيسية' },
  { id: 'projects', label: 'أعمالنا' },
  { id: 'about', label: 'من نحن' },
  { id: 'services', label: 'خدماتنا' },
  { id: 'approach', label: 'طريقتنا' },
  { id: 'contact', label: 'تواصل معنا' },
]

/**
 * The floating capsule: a pill slides under the section in view (or the link
 * under the pointer), and the bar tucks away while the visitor reads downward.
 */
export function SiteHeader() {
  const navRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState('top')
  const [hovered, setHovered] = useState<string | null>(null)
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  // The section in the middle band of the screen is the active one.
  useEffect(() => {
    const showing = new Set<string>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) showing.add(e.target.id)
          else showing.delete(e.target.id)
        }
        const current = LINKS.findLast((l) => showing.has(l.id))
        setActive(current?.id ?? 'top')
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const { id } of LINKS.slice(1)) {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    let lastY = scrollY
    let raf = 0
    const tick = () => {
      raf = 0
      const y = scrollY
      const down = y > lastY + 4
      const up = y < lastY - 4
      setScrolled(y > 40)
      const nav = navRef.current
      if (y > innerHeight * 1.2 && down && !nav?.contains(document.activeElement)) setHidden(true)
      else if (up || y < innerHeight) setHidden(false)
      if (down || up) lastY = y
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    addEventListener('scroll', onScroll, { passive: true })
    tick()
    return () => {
      removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Measure the link the pill should sit under.
  const target = hovered ?? active
  useLayoutEffect(() => {
    const measure = () => {
      const list = listRef.current
      const link = list?.querySelector<HTMLElement>(`[data-id="${target}"]`)
      if (!list || !link) return setPill(null)
      const l = link.getBoundingClientRect()
      const u = list.getBoundingClientRect()
      setPill({ left: l.left - u.left, width: l.width })
    }
    measure()
    addEventListener('resize', measure)
    return () => removeEventListener('resize', measure)
  }, [target])

  return (
    <header ref={navRef} className={`nav${scrolled ? ' scrolled' : ''}${hidden && !open ? ' hide' : ''}`}>
      <div className="wrap nav-in">
        <Link href="/#top" aria-label="أفق، الصفحة الرئيسية">
          <Logo className="logo-svg" />
        </Link>
        <ul ref={listRef} id="nav-links" className={`nav-links${open ? ' open' : ''}`} onMouseLeave={() => setHovered(null)}>
          <li className={`nav-ind${pill ? ' show' : ''}`} style={pill ?? undefined} aria-hidden="true" />
          {LINKS.map(({ id, label }) => (
            <li key={id}>
              <Link
                href={`/#${id}`}
                data-id={id}
                className={active === id ? 'on' : undefined}
                aria-current={active === id ? 'location' : undefined}
                onMouseEnter={() => setHovered(id)}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-end">
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn menu-btn"
            aria-label="القائمة"
            aria-expanded={open}
            aria-controls="nav-links"
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </button>
          <Button href="/#contact" arrow>
            ابدأ مشروعك
          </Button>
        </div>
      </div>
    </header>
  )
}
