import type { Media } from '@/lib/types'

/** A small preview of an uploaded file, or of a local file before upload. */
export function MediaThumb({ media, src, mime, alt = '', className = '', fit = 'cover' }: { media?: Media | null; src?: string; mime?: string; alt?: string; className?: string; fit?: 'cover' | 'contain' }) {
  const url = src ?? smallest(media)
  const type = mime ?? media?.mime ?? ''
  const fitClass = fit === 'cover' ? 'object-cover object-top' : 'object-contain'

  if (!url) {
    return (
      <div className={`grid place-items-center bg-surface text-muted ${className}`} aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
          <path d="m4 17 5-5 4 4 2.5-2.5L20 18" />
        </svg>
      </div>
    )
  }

  if (type.startsWith('video/')) {
    return <video src={`${url}#t=1`} muted playsInline preload="metadata" aria-label={alt || undefined} className={`bg-surface ${fitClass} ${className}`} />
  }

  return <img src={url} alt={alt} loading="lazy" decoding="async" className={`bg-surface ${fitClass} ${className}`} />
}

/** The lightest webp copy when the server made one, else the original. */
function smallest(media: Media | null | undefined) {
  if (!media) return undefined
  return media.sizes[0]?.url ?? media.url
}
