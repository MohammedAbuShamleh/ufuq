/**
 * A card's size in grid cells. `image`: it shows a screenshot that needs its
 * width. `phone`: a phone screenshot, which widens only when nothing else can.
 */
export type Cell = { w: number; h: number; image: boolean; phone: boolean }
export type Span = { w: number; h: number }

type Placed = { r: number; c: number; w: number; h: number }

/**
 * Sizes for a list of cards in a grid of `cols` columns such that the
 * browser's default auto-placement fills every cell, keeping the cards'
 * order. Each card keeps the size it asks for unless that would leave a hole:
 *
 * - A card wider than the space left in its row: a card with a screenshot
 *   moves to the next row and the card before it widens over the space
 *   (unless that card is a phone); any other card narrows to fit.
 * - At the end, the last row's cards widen over its empty cells (phones only
 *   if they are all there is), and a tall card that would leave cells
 *   nothing can reach becomes one row high.
 */
export function packGrid(cards: Cell[], cols: number): Span[] {
  const want = cards.map((card) => ({ ...card, w: Math.min(card.w, cols) }))
  for (;;) {
    const { placed, shorten } = place(want, cols)
    if (shorten === null) return placed.map(({ w, h }) => ({ w, h }))
    want[shorten].h = 1
  }
}

/** One pass of placement; `shorten` names a tall card to make one row high and try again. */
function place(cards: Cell[], cols: number): { placed: Placed[]; shorten: number | null } {
  const grid: number[][] = []
  const at = (r: number) => (grid[r] ??= new Array<number>(cols).fill(-1))
  const placed: Placed[] = []
  let r = 0
  let c = 0

  cards.forEach((card, i) => {
    let w = card.w
    for (;;) {
      // Every cell before this one is taken, so the first free cell is where the browser puts the card.
      while (at(r)[c] !== -1) {
        c++
        if (c === cols) {
          r++
          c = 0
        }
      }
      let gap = 0
      while (c + gap < cols && at(r)[c + gap] === -1) gap++
      if (w <= gap) break
      const prev = c > 0 ? at(r)[c - 1] : -1
      if (card.image && prev !== -1 && !cards[prev].phone && placed[prev].r === r && placed[prev].h === 1) {
        placed[prev].w += gap
        for (let k = 0; k < gap; k++) at(r)[c + k] = prev
        continue
      }
      w = gap
      break
    }
    // The rows below a free cell are free too: nothing placed so far reaches past the row under it.
    for (let dr = 0; dr < card.h; dr++) for (let k = 0; k < w; k++) at(r + dr)[c + k] = i
    placed.push({ r, c, w, h: card.h })
  })

  const last = placed.at(-1)
  if (!last) return { placed, shorten: null }

  // A tall card in the last card's row would hang into a row of its own.
  const hanging = placed.findIndex((p) => p.h === 2 && p.r === last.r)
  if (hanging !== -1) return { placed, shorten: hanging }

  // The empty cells after the last card; if a tall card's lower half splits them, it gets shorter.
  const row = at(last.r)
  const end = last.c + last.w
  let k = end
  while (k < cols && row[k] === -1) k++
  if (row.slice(k).includes(-1)) return { placed, shorten: row[k] }

  // The rest are spread over the cards that run up to them, from the last one back.
  const run = [placed.length - 1]
  for (let col = last.c; col > 0; ) {
    const owner = row[col - 1]
    if (placed[owner].r !== last.r) break
    run.push(owner)
    col = placed[owner].c
  }
  const wide = run.filter((i) => !cards[i].phone)
  const takers = wide.length ? wide : run
  for (let n = 0; n < k - end; n++) placed[takers[n % takers.length]].w++
  return { placed, shorten: null }
}
