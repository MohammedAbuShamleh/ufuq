import { useState } from 'react'
import type { Media } from '@/lib/types'
import { formatNumber } from '@/lib/format'
import { errorMessage } from '@/lib/http'
import { useConfirm } from '../confirm/confirm'
import { MediaThumb } from '../MediaThumb'
import { SAVED, useToast } from '../toast/toast'
import { Button } from '../ui/Button'
import { checkFile, type FileRule } from './files'
import { FileDrop, ProgressBar } from './FileDrop'

type Props = {
  label: string
  current: Media | null
  rules: readonly FileRule[]
  hint?: string
  /** square: team photos · contain: logos · file: PDFs (shown as a link). */
  shape?: 'square' | 'contain' | 'file'
  /** Runs between picking and uploading (the photo cropper); null cancels. */
  prepare?: (file: File) => Promise<File | null>
  upload: (file: File, onProgress: (f: number) => void) => Promise<unknown>
  remove: () => Promise<unknown>
}

/** One file per record (photo, logo, profile PDF): pick or drop, see it, replace or remove it. */
export function SingleUpload({ label, current, rules, hint, shape = 'contain', prepare, upload, remove }: Props) {
  const toast = useToast()
  const confirm = useConfirm()
  const [preview, setPreview] = useState<{ url: string; mime: string } | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [removing, setRemoving] = useState(false)

  const pick = async ([picked]: File[]) => {
    setError(null)
    const problem = checkFile(picked, rules)
    if (problem) return setError(problem)
    const file = prepare ? await prepare(picked) : picked
    if (!file) return

    const url = URL.createObjectURL(file)
    setPreview({ url, mime: file.type })
    setProgress(0)
    try {
      await upload(file, setProgress)
      toast.ok(SAVED)
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setProgress(null)
      setPreview(null)
      URL.revokeObjectURL(url)
    }
  }

  // The stored file is deleted, so ask first: the original may not be at hand.
  const drop = async () => {
    const ok = await confirm({ title: `إزالة ${label}؟`, body: 'يُحذف الملف من الموقع فوراً، ويمكنك رفع غيره متى شئت.', confirmLabel: 'نعم، أزل', tone: 'danger' })
    if (!ok) return
    setRemoving(true)
    try {
      await remove()
      toast.ok(SAVED)
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setRemoving(false)
    }
  }

  const shown = preview ?? (current ? { url: '', mime: current.mime } : null)
  const box = shape === 'square' ? 'size-28 rounded-full' : 'h-24 w-40 rounded-field p-2'

  return (
    <div>
      <p className="mb-2 font-display text-sm font-medium">{label}</p>
      <div className="flex flex-wrap items-start gap-5">
        {shown && shape !== 'file' && (
          <div className="relative">
            <MediaThumb media={preview ? null : current} src={preview?.url} mime={shown.mime} fit={shape === 'square' ? 'cover' : 'contain'} className={`border border-line ${box}`} />
          </div>
        )}
        {shape === 'file' && current && !preview && (
          <a href={current.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-field border border-line px-4 py-3 text-sm hover:border-accent hover:text-accent">
            عرض الملف الحالي
          </a>
        )}
        <div className="grid min-w-60 flex-1 gap-3">
          {progress !== null ? (
            <div className="grid gap-2 rounded-card border border-line bg-surface p-5">
              <p className="text-sm">جارٍ الرفع… {formatNumber(Math.round(progress * 100))}٪</p>
              <ProgressBar value={progress} label={`رفع ${label}`} />
            </div>
          ) : (
            <FileDrop compact rules={rules} title={current ? 'استبدل الملف: اسحبه إلى هنا' : 'اسحب الملف إلى هنا'} hint={hint} onFiles={(f) => void pick(f)} />
          )}
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          {current && progress === null && (
            <div>
              <Button variant="ghost" size="sm" busy={removing} onClick={() => void drop()}>
                إزالة {label}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
