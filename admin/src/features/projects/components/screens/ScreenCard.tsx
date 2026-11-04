import { useState, type ReactNode } from 'react'
import { deleteOptions, useConfirm } from '@/components/confirm/confirm'
import { MediaThumb } from '@/components/MediaThumb'
import { Badge } from '@/components/Page'
import { SAVED, useToast } from '@/components/toast/toast'
import { TranslatedInline } from '@/components/TranslatedInline'
import { Button } from '@/components/ui/Button'
import { SelectField } from '@/components/ui/Field'
import { errorMessage, fieldErrors } from '@/lib/http'
import { ar, tr } from '@/lib/i18n'
import { KIND_OPTIONS, label } from '../../labels'
import type { useScreens } from '../../hooks/useScreens'
import type { Screen, ScreenInput } from '../../types'

type Props = { screen: Screen; actions: ReturnType<typeof useScreens>; handle: ReactNode }

/** A saved shot: what it is, its label on the site, and its alt text — editable in place. */
export function ScreenCard({ screen, actions, handle }: Props) {
  const [editing, setEditing] = useState<ScreenInput | null>(null)
  const toast = useToast()
  const confirm = useConfirm()
  const name = ar(screen.alt) || 'هذه الشاشة'

  const startEdit = () => setEditing({ kind: screen.kind, label: tr(screen.label), alt: tr(screen.alt) })

  const save = () => {
    if (!editing) return
    actions.update.mutate(
      { id: screen.id, input: editing },
      {
        onSuccess: () => {
          setEditing(null)
          toast.ok(SAVED)
        },
        onError: (e) => toast.error(errorMessage(e)),
      },
    )
  }

  const destroy = async () => {
    if (!(await confirm(deleteOptions(name)))) return
    actions.remove.mutate(screen.id, { onSuccess: () => toast.ok(SAVED), onError: (e) => toast.error(errorMessage(e)) })
  }

  const errors = fieldErrors(actions.update.error)

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-bg">
      <div className="relative bg-surface">
        <MediaThumb media={screen.file} alt={ar(screen.alt)} fit={screen.kind === 'mobile' ? 'contain' : 'cover'} className="aspect-[16/10] w-full" />
        <div className="absolute inset-x-2 top-2 flex items-start justify-between">
          <span className="rounded-field bg-bg/90">{handle}</span>
          <Badge tone={screen.kind === 'video' ? 'accent' : 'muted'}>{label(KIND_OPTIONS, screen.kind)}</Badge>
        </div>
      </div>
      {editing ? (
        <div className="grid gap-3 p-3">
          {screen.kind !== 'video' && (
            <SelectField label="النوع" value={editing.kind} options={KIND_OPTIONS.filter((k) => k.value !== 'video')} onChange={(kind) => setEditing({ ...editing, kind })} />
          )}
          <TranslatedInline label="التسمية" max={60} hint="تحت الشاشة أو على زرّها في الموقع. اختياري." value={editing.label} onChange={(label) => setEditing({ ...editing, label })} errorFor={(l) => errors[`label.${l}`]} />
          <TranslatedInline label="وصف الصورة" required max={160} value={editing.alt} onChange={(alt) => setEditing({ ...editing, alt })} errorFor={(l) => errors[`alt.${l}`]} />
          <div className="flex gap-2">
            <Button size="sm" busy={actions.update.isPending} onClick={save}>
              حفظ
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
              إلغاء
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-1 p-3">
          <p className="font-display text-sm">{ar(screen.label) || 'بلا تسمية'}</p>
          <p className="line-clamp-2 text-xs leading-relaxed text-muted">{ar(screen.alt) || 'بلا وصف'}</p>
          <div className="mt-auto flex gap-1 pt-2">
            <Button variant="ghost" size="sm" onClick={startEdit}>
              تعديل
            </Button>
            <Button
              variant="danger"
              size="sm"
              busy={actions.remove.isPending && actions.remove.variables === screen.id}
              onClick={() => void destroy()}
            >
              حذف
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
