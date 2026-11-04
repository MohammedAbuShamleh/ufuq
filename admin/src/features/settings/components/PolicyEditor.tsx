import { Button } from '@/components/ui/Button'
import { TextAreaField, TextField } from '@/components/ui/Field'
import { formatNumber } from '@/lib/format'
import type { PolicyDraft } from '../types'

type Props = {
  sections: PolicyDraft[]
  onChange: (sections: PolicyDraft[]) => void
  /** Server errors keyed from the section list: "0.heading", "2.paragraphs". */
  errorAt: (path: string) => string | undefined
}

/** The privacy policy as titled sections; a blank line in the text starts a new paragraph. */
export function PolicyEditor({ sections, onChange, errorAt }: Props) {
  const update = (i: number, patch: Partial<PolicyDraft>) => onChange(sections.map((s, j) => (j === i ? { ...s, ...patch } : s)))
  const move = (i: number, by: -1 | 1) => {
    const next = [...sections]
    ;[next[i], next[i + by]] = [next[i + by], next[i]]
    onChange(next)
  }

  return (
    <div className="grid gap-4">
      {sections.map((s, i) => (
        <fieldset key={i} className="grid gap-4 rounded-field border border-line p-4">
          <legend className="px-1 font-display text-xs text-muted">القسم {formatNumber(i + 1)}</legend>
          <TextField label="العنوان" required value={s.heading} onChange={(v) => update(i, { heading: v })} error={errorAt(`${i}.heading`)} />
          <TextAreaField label="النص" rows={4} hint="اترك سطراً فارغاً بين الفقرات." value={s.body} onChange={(v) => update(i, { body: v })} error={errorAt(`${i}.paragraphs`)} />
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" disabled={i === 0} onClick={() => move(i, -1)}>
              تقديم
            </Button>
            <Button variant="ghost" size="sm" disabled={i === sections.length - 1} onClick={() => move(i, 1)}>
              تأخير
            </Button>
            <Button variant="danger" size="sm" className="ms-auto" onClick={() => onChange(sections.filter((_, j) => j !== i))}>
              حذف القسم
            </Button>
          </div>
        </fieldset>
      ))}
      <div>
        <Button variant="secondary" size="sm" onClick={() => onChange([...sections, { heading: '', body: '' }])}>
          إضافة قسم
        </Button>
      </div>
    </div>
  )
}
