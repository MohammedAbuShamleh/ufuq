import { cacheLife, cacheTag } from 'next/cache'
import type { Home, Settings } from './types'

// Server-side base, e.g. http://localhost:8000/v1. The contact form posts here
// too, so it must also be reachable from the visitor's browser.
export const API_URL = (process.env.API_URL ?? 'http://127.0.0.1:8000/v1').replace(/\/$/, '')

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}/${path}`, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`GET /${path} answered ${res.status}`)
  return ((await res.json()) as { data: T }).data
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
