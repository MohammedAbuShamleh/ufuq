import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useCan, useLogout, useUser } from '@/features/auth/hooks/useAuth'
import { ROLE_LABEL } from '@/features/auth/types'
import { useNewLeadsCount } from '@/features/leads/hooks/useLeads'
import { formatNumber } from '@/lib/format'
import { NAV } from './nav'

/**
 * Sidebar on wide screens; on phones the same links fold under a menu button.
 * Sections the role cannot use are not shown (the API refuses them anyway).
 */
export function AppShell() {
  const { pathname } = useLocation()
  // The phone menu belongs to the page it was opened on: following a link closes it.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname

  return (
    <div className="min-h-dvh bg-surface lg:grid lg:grid-cols-[16.5rem_1fr]">
      <aside className="border-line bg-bg lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:border-e">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 lg:border-b-0 lg:px-5 lg:pt-5">
          <NavLink to="/" aria-label="الرئيسية — لوحة أفق">
            <Logo className="h-11 w-22.5" />
          </NavLink>
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-expanded={open}
              aria-controls="main-nav"
              onClick={() => setOpenOn(open ? null : pathname)}
              className="grid size-10.5 cursor-pointer place-items-center rounded-full border border-line"
            >
              <span className="sr-only">{open ? 'إغلاق القائمة' : 'فتح القائمة'}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
        <div id="main-nav" className={`${open ? 'flex' : 'hidden'} flex-1 flex-col border-b border-line lg:flex lg:border-b-0`}>
          <MainNav />
          <UserBox />
        </div>
      </aside>
      <main className="min-w-0 px-4 pt-6 sm:px-8 lg:pt-10">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function MainNav() {
  const can = useCan()
  const newLeads = useNewLeadsCount()

  return (
    <nav aria-label="أقسام اللوحة" className="flex-1 overflow-y-auto px-3 py-3 lg:py-5">
      <ul className="grid gap-0.5">
        {NAV.filter((item) => !item.adminOnly || can.settings).map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-field px-3 py-2.5 font-display text-sm transition-colors duration-200 ${
                  // Accent on the icon only: as text on the tint it falls under 4.5:1 in dark mode.
                  isActive ? 'bg-tint text-text' : 'text-muted hover:bg-surface hover:text-text'
                }`
              }
            >
              <span className="grid place-items-center group-aria-[current=page]:text-accent">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge === 'leads' && newLeads > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-pill bg-accent px-1.5 text-xs text-on-accent">
                  <span className="sr-only">رسائل جديدة: </span>
                  {formatNumber(newLeads)}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function UserBox() {
  const user = useUser()
  const logout = useLogout()

  return (
    <div className="flex items-center gap-3 border-t border-line px-5 py-4">
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm">{user.name}</p>
        <p className="text-xs text-muted">{ROLE_LABEL[user.role]}</p>
      </div>
      <div className="hidden lg:block">
        <ThemeToggle />
      </div>
      <button
        type="button"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
        className="grid size-10.5 cursor-pointer place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
      >
        <span className="sr-only">تسجيل الخروج</span>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 16l-4-4 4-4M6 12h10" />
        </svg>
      </button>
    </div>
  )
}
