import type { ReactNode } from 'react'

export type NavItem = { to: string; label: string; icon: ReactNode; adminOnly?: boolean; badge?: 'leads' }

const icon = (d: ReactNode) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
)

/** The seven sections, then user management. Order follows how often the team uses them. */
export const NAV: NavItem[] = [
  { to: '/projects', label: 'المشاريع', icon: icon(<><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>) },
  { to: '/leads', label: 'رسائل التواصل', badge: 'leads', icon: icon(<><path d="M4 5h16v11H8l-4 4z" /><path d="M8 9.5h8M8 12.5h5" /></>) },
  { to: '/team', label: 'الفريق', icon: icon(<><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><circle cx="17" cy="9" r="2.5" /><path d="M16 14.2a4.5 4.5 0 0 1 4.5 4.8" /></>) },
  { to: '/testimonials', label: 'الشهادات', icon: icon(<><path d="M7 10h3v4.5A3.5 3.5 0 0 1 6.5 18" /><path d="M14 10h3v4.5a3.5 3.5 0 0 1-3.5 3.5" /><path d="M7 10a3 3 0 0 1 3-3M14 10a3 3 0 0 1 3-3" /></>) },
  { to: '/clients', label: 'العملاء', icon: icon(<><path d="M4 20V8l8-4 8 4v12" /><path d="M9 20v-6h6v6M4 20h16" /></>) },
  { to: '/faqs', label: 'الأسئلة الشائعة', icon: icon(<><circle cx="12" cy="12" r="8.5" /><path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4M12 16.8h.01" /></>) },
  { to: '/settings', label: 'الإعدادات', adminOnly: true, icon: icon(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" /></>) },
  { to: '/users', label: 'المستخدمون', adminOnly: true, icon: icon(<><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>) },
]
