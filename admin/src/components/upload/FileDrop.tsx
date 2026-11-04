import { useRef, useState } from 'react'
import { Button } from '../ui/Button'
import { acceptOf, type FileRule } from './files'

type Props = {
  rules: readonly FileRule[]
  multiple?: boolean
  title: string
  hint?: string
  disabled?: boolean
  compact?: boolean
  onFiles: (files: File[]) => void
}

/** Drop files here or pick them: the one entry point for every upload. */
export function FileDrop({ rules, multiple, title, hint, disabled, compact, onFiles }: Props) {
  const input = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)

  const take = (list: FileList | null) => {
    const files = Array.from(list ?? [])
    if (files.length) onFiles(multiple ? files : files.slice(0, 1))
  }

  return (
    <div
      onDragOver={(e) => {
        if (disabled) return
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        if (!disabled) take(e.dataTransfer.files)
      }}
      className={`flex flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed text-center transition-colors duration-200 ${
        compact ? 'px-4 py-5' : 'px-6 py-10'
      } ${over ? 'border-accent bg-tint' : 'border-line bg-surface'} ${disabled ? 'opacity-60' : ''}`}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-accent" aria-hidden="true">
        <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5" />
        <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
      </svg>
      <p className="font-display text-sm font-medium">{title}</p>
      {hint && <p className="max-w-md text-xs leading-relaxed text-muted">{hint}</p>}
      <Button variant="secondary" size="sm" className="mt-1" disabled={disabled} onClick={() => input.current?.click()}>
        {multiple ? 'اختر ملفات' : 'اختر ملفاً'}
      </Button>
      <input
        ref={input}
        type="file"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        accept={acceptOf(rules)}
        multiple={multiple}
        onChange={(e) => {
          take(e.target.files)
          e.target.value = ''
        }}
      />
    </div>
  )
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const percent = Math.round(value * 100)
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} className="h-1.5 overflow-hidden rounded-pill bg-line">
      <div className="h-full rounded-pill bg-accent transition-[width] duration-200" style={{ width: `${percent}%` }} />
    </div>
  )
}
