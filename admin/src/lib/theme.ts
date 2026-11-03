export type Theme = 'light' | 'dark'

// The inline script in index.html reads the same key before first paint.
export const THEME_KEY = 'ufuq-theme'

export function currentTheme(): Theme {
  const chosen = document.documentElement.getAttribute('data-theme')
  if (chosen === 'light' || chosen === 'dark') return chosen
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function toggleTheme(): Theme {
  const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', next)
  try {
    localStorage.setItem(THEME_KEY, next)
  } catch {
    // Storage blocked (private mode): the choice still applies for this visit.
  }
  return next
}
