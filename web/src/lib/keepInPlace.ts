import { flushSync } from 'react-dom'

/**
 * For an accordion where opening one item closes another. When the item that
 * closes starts above the visible part of the screen (above the top, or under
 * the nav), everything below it slides up as it shrinks, the item just pressed
 * included, for no reason the reader can see; on a phone the pressed title
 * ends up under the nav. So that item closes at once and the page scrolls back
 * by what it gave up: the pressed item stays where it was and only opens
 * downward. When the closing item is in view the list moves as usual, since
 * the reader sees why.
 */
export function keepInPlace(pressed: Element, closing: Element | null | undefined, change: () => void) {
  const y = pressed.getBoundingClientRect().top
  const visibleTop = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
  const hold = closing instanceof HTMLElement && closing !== pressed && closing.getBoundingClientRect().top < Math.min(y, visibleTop)
  if (!hold) return change()

  closing.classList.add('no-glide')
  flushSync(change)
  scrollBy({ top: pressed.getBoundingClientRect().top - y, behavior: 'instant' })
  // The collapse was measured above with no transition, so it is done; lifting
  // the class now changes nothing the eye can see.
  closing.classList.remove('no-glide')
}
