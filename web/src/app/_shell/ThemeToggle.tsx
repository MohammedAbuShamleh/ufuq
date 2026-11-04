'use client'

import { toggleTheme } from '@/lib/theme'

export function ThemeToggle() {
  return (
    <button type="button" onClick={() => toggleTheme()} aria-label="تبديل الوضع الليلي" className="icon-btn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
      </svg>
    </button>
  )
}
