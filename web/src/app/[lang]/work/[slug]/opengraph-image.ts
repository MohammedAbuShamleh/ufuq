import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { cacheLife, cacheTag } from 'next/cache'
import sharp, { type Sharp } from 'sharp'
import { DEFAULT_LOCALE, hasLocale, type Locale } from '@/i18n/config'
import { ar } from '@/i18n/dictionaries/ar'
import { getProject } from '@/lib/api'
import { isVideo } from '@/lib/media'
import type { Media } from '@/lib/types'

// The project's own first screen is the preview, with no text drawn on it:
// the title travels in og:title, and image renderers do not shape Arabic.
// The page names this image in its own metadata with an alt in its language
// (lib/seo.ts); this fixed export is only Next's fallback.
export const alt = ar.meta.projectImageAlt
export const size = { width: 1200, height: 630 }
export const contentType = 'image/jpeg'

// --linen, for the space around a phone screen (a token cannot reach an image).
const LINEN = { r: 244, g: 239, b: 230 }
// A project with no still screen yet falls back to the site's own preview, in its language.
const defaultImage = (locale: Locale) => path.join(process.cwd(), `public/og/og-ufuq-${locale}.png`)

// A route handler: it cannot read the [lang] segment's getter, so it takes the language from params.
export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  const jpeg = await shareImage(hasLocale(lang) ? lang : DEFAULT_LOCALE, slug)
  return new Response(jpeg as Uint8Array<ArrayBuffer>, { headers: { 'Content-Type': contentType } })
}

async function shareImage(locale: Locale, slug: string): Promise<Uint8Array> {
  'use cache'
  cacheLife('days')
  cacheTag(`project:${slug}`)

  const project = await getProject(locale, slug)
  const screen = project?.screens.find((s) => s.kind !== 'video' && s.file && !isVideo(s.file))
  const source = screen?.file && (await download(screen.file))
  if (!screen || !source) return toJpeg(sharp(await readFile(defaultImage(locale))).resize(size.width, size.height))

  // A desktop screen fills the frame from its top (where the page starts);
  // a phone screen stands whole in the middle, on linen.
  if (screen.kind === 'desktop') return toJpeg(sharp(source).resize(size.width, size.height, { fit: 'cover', position: 'top' }))
  const phone = await sharp(source)
    .resize({ height: size.height - 70, width: size.width, fit: 'inside' })
    .toBuffer()
  return toJpeg(
    sharp({ create: { ...size, channels: 3, background: LINEN } }).composite([{ input: phone, gravity: 'center' }]),
  )
}

/** The largest stored size of an image (the original when it has no webp widths). */
async function download(media: Media) {
  const url = media.sizes.at(-1)?.url ?? media.url
  try {
    const res = await fetch(url)
    return res.ok ? Buffer.from(await res.arrayBuffer()) : null
  } catch {
    return null
  }
}

async function toJpeg(image: Sharp) {
  return new Uint8Array(await image.flatten({ background: LINEN }).jpeg({ quality: 82, mozjpeg: true }).toBuffer())
}
