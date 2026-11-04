import { createHash, timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'

/**
 * Laravel calls this after every dashboard save, with the cache tags the save
 * touched (see ContentTag in the API). Only those pages refresh.
 *
 * POST /api/revalidate
 * Authorization: Bearer <REVALIDATE_SECRET>
 * { "tags": ["home", "projects", "project:saiid"] }
 */

// The tags the site's reads carry (lib/api.ts); anything else is refused.
const TAG = /^(home|projects|team|settings|project:[a-z0-9][a-z0-9-]{0,79})$/
const MAX_TAGS = 50

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) return Response.json({ message: 'REVALIDATE_SECRET is not set' }, { status: 503 })
  if (!authorized(request.headers.get('authorization'), secret)) return Response.json({ message: 'Unauthorized' }, { status: 401 })

  const tags = readTags(await request.json().catch(() => null))
  if (!tags) return Response.json({ message: 'Expected { tags: string[] } with known tags' }, { status: 422 })

  // expire: 0, not 'max': the next visit renders fresh content, so whoever
  // saved sees the change on their first look instead of one visit later.
  for (const tag of tags) revalidateTag(tag, { expire: 0 })

  return Response.json({ revalidated: tags })
}

/** Compares digests, so the check takes the same time whatever the guess. */
function authorized(header: string | null, secret: string): boolean {
  const given = header?.startsWith('Bearer ') ? header.slice(7) : ''
  const digest = (value: string) => createHash('sha256').update(value).digest()
  return given !== '' && timingSafeEqual(digest(given), digest(secret))
}

function readTags(body: unknown): string[] | null {
  if (typeof body !== 'object' || body === null || !('tags' in body)) return null
  const { tags } = body
  if (!Array.isArray(tags) || tags.length === 0 || tags.length > MAX_TAGS) return null
  if (!tags.every((tag): tag is string => typeof tag === 'string' && TAG.test(tag))) return null
  return [...new Set(tags)]
}
