import { useState } from 'react'
import { SAVED, useToast } from '@/components/toast/toast'
import { checkFile, IMAGE, VIDEO } from '@/components/upload/files'
import { FileDrop } from '@/components/upload/FileDrop'
import { Button } from '@/components/ui/Button'
import { formatNumber } from '@/lib/format'
import { errorMessage } from '@/lib/http'
import { blank } from '@/lib/i18n'
import { useScreens } from '../../hooks/useScreens'
import { detectKind } from '../../screens'
import { QueueItem, type Pending } from './QueueItem'

const RULES = [IMAGE, VIDEO]

/** Drop many shots at once; each gets its details, then goes up with its own progress bar. */
export function ScreenUploads({ projectId }: { projectId: number }) {
  const screens = useScreens(projectId)
  const toast = useToast()
  const [queue, setQueue] = useState<Pending[]>([])
  const [rejected, setRejected] = useState<string[]>([])

  const patch = (uid: string, p: Partial<Pending>) => setQueue((q) => q.map((i) => (i.uid === uid ? { ...i, ...p } : i)))

  const add = async (files: File[]) => {
    setRejected(files.map((f) => checkFile(f, RULES)).filter((p): p is string => p !== null))
    const items = await Promise.all(
      files
        .filter((f) => !checkFile(f, RULES))
        .map(async (file): Promise<Pending> => {
          const url = URL.createObjectURL(file)
          return { uid: crypto.randomUUID(), file, url, kind: await detectKind(file, url), alt: blank(), label: blank(), progress: null, error: null }
        }),
    )
    setQueue((q) => [...q, ...items])
  }

  const send = async (item: Pending): Promise<boolean> => {
    if (!item.alt.ar?.trim()) {
      patch(item.uid, { error: 'اكتب وصف الصورة قبل رفعها؛ يقرؤه من لا يرى الشاشة ومحركات البحث.' })
      return false
    }
    patch(item.uid, { progress: 0, error: null })
    try {
      await screens.upload(item.file, { kind: item.kind, label: item.label, alt: item.alt }, (progress) => patch(item.uid, { progress }))
      URL.revokeObjectURL(item.url)
      setQueue((q) => q.filter((i) => i.uid !== item.uid))
      return true
    } catch (e) {
      patch(item.uid, { progress: null, error: errorMessage(e) })
      return false
    }
  }

  // In the order dropped: each new shot goes to the end of the list, as on the site.
  const sendAll = async () => {
    let sent = 0
    for (const item of [...queue]) if (await send(item)) sent++
    if (sent) toast.ok(SAVED)
  }

  return (
    <div className="grid gap-4">
      <FileDrop
        multiple
        rules={RULES}
        title="اسحب صور الشاشات أو الفيديو إلى هنا"
        hint="صور JPG أو PNG أو WebP حتى ١٠ ميغابايت، وفيديو MP4 أو WebM حتى ٦٠ ميغابايت. نميّز شاشة الجوال من أبعادها تلقائياً."
        onFiles={(f) => void add(f)}
      />
      {rejected.length > 0 && (
        <ul role="alert" className="grid gap-1 rounded-field bg-danger-soft px-4 py-3 text-sm text-danger">
          {rejected.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}
      {queue.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">أكمل وصف كل صورة، ثم ارفعها واحدة واحدة أو كلها معاً.</p>
            {queue.length > 1 && (
              <Button size="sm" disabled={queue.some((i) => i.progress !== null)} onClick={() => void sendAll()}>
                رفع الكل ({formatNumber(queue.length)})
              </Button>
            )}
          </div>
          <ul className="grid gap-3">
            {queue.map((item) => (
              <QueueItem
                key={item.uid}
                item={item}
                onChange={(p) => patch(item.uid, p)}
                onSend={() => void send(item).then((ok) => ok && toast.ok(SAVED))}
                onDrop={() => {
                  URL.revokeObjectURL(item.url)
                  setQueue((q) => q.filter((i) => i.uid !== item.uid))
                }}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
