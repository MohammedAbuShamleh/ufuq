import type { Media } from './types'

/**
 * <img> attributes for an uploaded image: a srcset from the API's webp widths
 * (480/960/1600) and the original's size, so the browser reserves the space
 * before it loads. Uploads skip next/image: the API already made the sizes.
 */
export function imgAttrs(media: Media, sizes = '100vw') {
  const srcSet = media.sizes.map((s) => `${s.url} ${s.width}w`).join(', ')
  return {
    src: media.sizes.at(-1)?.url ?? media.url,
    srcSet: srcSet || undefined,
    sizes: srcSet ? sizes : undefined,
    width: media.width ?? undefined,
    height: media.height ?? undefined,
  }
}

export const isVideo = (media: Media) => media.mime.startsWith('video/')
