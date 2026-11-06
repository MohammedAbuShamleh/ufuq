import { cacheLife, cacheTag } from 'next/cache'
import type { Locale } from '@/i18n/config'
import type { Home, ProjectCard, ProjectDetail, Settings, TeamMember } from './types'

// Server-side base, e.g. http://localhost:8000/v1. The contact form posts here
// too, so it must also be reachable from the visitor's browser.
export const API_URL = (process.env.API_URL ?? 'http://127.0.0.1:8000/v1').replace(/\/$/, '')

/** A 404 means «no such thing» (null) rather than an error. Content comes in the page's language. */
async function find<T>(path: string, locale: Locale): Promise<T | null> {
  const res = await fetch(`${API_URL}/${path}?lang=${locale}`, { headers: { Accept: 'application/json' } })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GET /${path} answered ${res.status}`)
  return ((await res.json()) as { data: T }).data
}

async function get<T>(path: string, locale: Locale): Promise<T> {
  const data = await find<T>(path, locale)
  if (data === null) throw new Error(`GET /${path} answered 404`)
  return data
}

// Tags let the dashboard refresh a page the moment content is saved (Phase 6).
// They name the content, not the language: a save refreshes every language.
export async function getHome(locale: Locale): Promise<Home> {
  'use cache'
  cacheLife('hours')
  cacheTag('home')
  return get<Home>('home', locale)
}

export async function getSettings(locale: Locale): Promise<Settings> {
  'use cache'
  cacheLife('hours')
  cacheTag('settings')
  return get<Settings>('settings', locale)
}

export async function getProjects(locale: Locale): Promise<ProjectCard[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('projects')
  return get<ProjectCard[]>('projects', locale)
}

/** Null for a slug that is not published (a draft, deleted, or never existed). */
export async function getProject(locale: Locale, slug: string): Promise<ProjectDetail | null> {
  'use cache'
  cacheLife('hours')
  cacheTag(`project:${slug}`)
  return find<ProjectDetail>(`projects/${encodeURIComponent(slug)}`, locale)
}

export async function getTeam(locale: Locale): Promise<TeamMember[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('team')
  return get<TeamMember[]>('team', locale)
}
