import { formatSize } from '@/lib/format'

/** What an upload field accepts, mirrored from the API's validation. */
export type FileRule = { mimes: readonly string[]; maxBytes: number; label: string }

const MB = 1024 * 1024

export const IMAGE: FileRule = { mimes: ['image/jpeg', 'image/png', 'image/webp'], maxBytes: 10 * MB, label: 'صورة JPG أو PNG أو WebP' }
export const VIDEO: FileRule = { mimes: ['video/mp4', 'video/webm'], maxBytes: 60 * MB, label: 'فيديو MP4 أو WebM' }
export const PHOTO: FileRule = { ...IMAGE, maxBytes: 8 * MB }
export const LOGO: FileRule = { mimes: ['image/png', 'image/svg+xml', 'image/webp', 'image/jpeg'], maxBytes: 4 * MB, label: 'شعار PNG أو SVG أو WebP' }
export const PDF: FileRule = { mimes: ['application/pdf'], maxBytes: 20 * MB, label: 'ملف PDF' }

export const acceptOf = (rules: readonly FileRule[]) => rules.flatMap((r) => r.mimes).join(',')

/** null when the file fits one of the rules, else the reason in Arabic. */
export function checkFile(file: File, rules: readonly FileRule[]): string | null {
  const rule = rules.find((r) => r.mimes.includes(file.type))
  if (!rule) return `«${file.name}» ليس من الأنواع المقبولة (${rules.map((r) => r.label).join('، ')}).`
  if (file.size > rule.maxBytes) return `«${file.name}» حجمه ${formatSize(file.size)}، والحد ${formatSize(rule.maxBytes)}.`
  return null
}

/** Natural size of a local image, read before upload (phone or desktop shot?). */
export function imageSize(url: string): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => resolve(null)
    img.src = url
  })
}
