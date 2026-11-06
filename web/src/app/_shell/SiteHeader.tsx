'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

// Home sections that also have a page of their own; on that page the link marks it.
const PAGES: Record<string, string> = { projects: '/work', about: '/about' }
const pageOf = (path: string) =>
  Object.keys(PAGES).find((id) => path === PAGES[id] || path.startsWith(`${PAGES[id]}/`)) ?? null

/**
 * The floating capsule: a pill slides under the section in view (or, away
 * from home, the page you are on, or the link under the pointer), and the bar
 * tucks away while the visitor reads downward.
 */
export function SiteHeader() {
  const path = usePathname()
  const home = path === '/'
  const page = pageOf(path)
  const navRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const menuBtn = useRef<HTMLButtonElement>(null)
  const [active, setActive] = useState('top')
  const [hovered, setHovered] = useState<string | null>(null)
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  // On home, the section in the middle band of the screen is the active one.
  useEffect(() => {
    if (!home) return
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
  }, [home])

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

  // The open menu closes on Esc (focus back on its button), on a press
  // anywhere outside the bar, or when the keyboard moves on past it.
  useEffect(() => {
    if (!open) return
    const header = navRef.current
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      menuBtn.current?.focus()
    }
    const onPress = (e: PointerEvent) => {
      if (!header?.contains(e.target as Node)) setOpen(false)
    }
    const onFocusOut = (e: FocusEvent) => {
      if (e.relatedTarget && !header?.contains(e.relatedTarget as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPress)
    header?.addEventListener('focusout', onFocusOut)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPress)
      header?.removeEventListener('focusout', onFocusOut)
    }
  }, [open])

  // Measure the link the pill should sit under.
  const current = home ? active : page
  const target = hovered ?? current
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
        <nav className="nav-main" aria-label="الرئيسية">
        <ul ref={listRef} id="nav-links" className={`nav-links${open ? ' open' : ''}`} onMouseLeave={() => setHovered(null)}>
          <li className={`nav-ind${pill ? ' show' : ''}`} style={pill ?? undefined} aria-hidden="true" />
          {LINKS.map(({ id, label }) => (
            <li key={id}>
              <Link
                href={!home && page === id ? PAGES[id] : `/#${id}`}
                data-id={id}
                className={current === id ? 'on' : undefined}
                aria-current={current === id ? (home ? 'location' : 'page') : undefined}
                onMouseEnter={() => setHovered(id)}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        </nav>
        <div className="nav-end">
          <ThemeToggle />
          <button
            ref={menuBtn}
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
