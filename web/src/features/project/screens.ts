import type { Screen } from '@/lib/types'

/** A screen whose file is uploaded. */
export type Shot = Screen & { file: NonNullable<Screen['file']> }

/**
 * The project's screens as the page lays them out: the first wide one
 * (desktop or video) is the cover, the other wide ones follow in the
 * walk-through, and the phones stand together. A project with phones only
 * opens on its phones.
 */
export function splitScreens(screens: Screen[]) {
  const shots = screens.filter((s): s is Shot => s.file !== null)
  const wide = shots.filter((s) => s.kind !== 'mobile')
  const phones = shots.filter((s) => s.kind === 'mobile')
  return { cover: wide[0] ?? null, wide: wide.slice(1), phones }
}

/**
 * The walk-through's rows after the cover: two side by side, then one
 * across, and so on. A pair left with a single screen gives it the row.
 */
export function rowsOf<T>(items: T[]): T[][] {
  const rows: T[][] = []
  let pair = true
  for (let i = 0; i < items.length; ) {
    const n = pair && items.length - i >= 2 ? 2 : 1
    rows.push(items.slice(i, i + n))
    i += n
    pair = !pair
  }
  return rows
}
