import { cacheLife, cacheTag } from 'next/cache'
import type { Home, ProjectCard, ProjectDetail, Settings, TeamMember } from './types'

// Server-side base, e.g. http://localhost:8000/v1. The contact form posts here
// too, so it must also be reachable from the visitor's browser.
export const API_URL = (process.env.API_URL ?? 'http://127.0.0.1:8000/v1').replace(/\/$/, '')

/** A 404 means «no such thing» (null) rather than an error. */
async function find<T>(path: string): Promise<T | null> {
  const res = await fetch(`${API_URL}/${path}`, { headers: { Accept: 'application/json' } })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GET /${path} answered ${res.status}`)
  return ((await res.json()) as { data: T }).data
}

async function get<T>(path: string): Promise<T> {
  const data = await find<T>(path)
  if (data === null) throw new Error(`GET /${path} answered 404`)
  return data
}

// Tags let the dashboard refresh a page the moment content is saved (Phase 6).
export async function getHome(): Promise<Home> {
  'use cache'
  cacheLife('hours')
  cacheTag('home')
  return get<Home>('home')
}

export async function getSettings(): Promise<Settings> {
  'use cache'
  cacheLife('hours')
  cacheTag('settings')
  return get<Settings>('settings')
}

export async function getProjects(): Promise<ProjectCard[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('projects')
  return get<ProjectCard[]>('projects')
}

/** Null for a slug that is not published (a draft, deleted, or never existed). */
export async function getProject(slug: string): Promise<ProjectDetail | null> {
  'use cache'
  cacheLife('hours')
  cacheTag(`project:${slug}`)
  return find<ProjectDetail>(`projects/${encodeURIComponent(slug)}`)
}

export async function getTeam(): Promise<TeamMember[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('team')
  return get<TeamMember[]>('team')
}
