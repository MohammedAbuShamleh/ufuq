'use client'

import Image, { type ImageLoader } from 'next/image'
import type { CSSProperties } from 'react'
import type { Media } from '@/lib/types'

type Props = {
  media: Media
  alt: string
  /** What the browser picks a width for, as in <img sizes>. */
  sizes: string
  className?: string
  style?: CSSProperties
  /** Fill the positioned parent (a frame with its own aspect ratio) instead of taking the file's size. */
  fill?: boolean
  'aria-hidden'?: boolean
}

/**
 * An uploaded image through next/image. The API already made its webp widths
 * (480/960/1600), so the loader hands back the smallest one that covers the
 * width the browser asks for, and nothing is resized twice. A file without
 * widths (no image library where it was uploaded) is served as it is.
 */
export function MediaImage({ media, alt, sizes, className, style, fill, ...rest }: Props) {
  const widths = media.sizes
  const loader: ImageLoader = ({ width }) => (widths.find((s) => s.width >= width) ?? widths.at(-1))?.url ?? media.url
  const size = fill ? { fill: true } : { width: media.width ?? 1600, height: media.height ?? 1000 }

  return (
    <Image
      src={media.url}
      alt={alt}
      sizes={sizes}
      loader={widths.length > 0 ? loader : undefined}
      unoptimized={widths.length === 0}
      className={className}
      style={style}
      {...size}
      {...rest}
    />
  )
}
