import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Button } from '../ui/Button'

const VIEW = 288 // the square on screen, in CSS pixels
const OUT = 800 // the square uploaded, in pixels
const MAX_ZOOM = 3

export type Pending = { file: File; url: string; resolve: (file: File | null) => void }

/** The square cropper: drag to place, slider or +/- to zoom, arrows to nudge. */
export function CropDialog({ pending, onDone }: { pending: Pending; onDone: (file: File | null) => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const drag = useRef<{ x: number; y: number } | null>(null)
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // StrictMode mounts twice in development; a second showModal() would throw.
    if (dialog.current && !dialog.current.open) dialog.current.showModal()
  }, [])

  const base = natural ? VIEW / Math.min(natural.w, natural.h) : 1
  const scale = base * zoom
  const size = natural ? { w: natural.w * scale, h: natural.h * scale } : { w: VIEW, h: VIEW }

  const clamp = (p: { x: number; y: number }, s = size) => ({ x: Math.min(0, Math.max(VIEW - s.w, p.x)), y: Math.min(0, Math.max(VIEW - s.h, p.y)) })

  const zoomTo = (next: number) => {
    if (!natural) return
    const z = Math.min(MAX_ZOOM, Math.max(1, next))
    const ratio = z / zoom
    const s = { w: natural.w * base * z, h: natural.h * base * z }
    // Zoom around the middle of the square, not its corner.
    setPos((p) => clamp({ x: VIEW / 2 - (VIEW / 2 - p.x) * ratio, y: VIEW / 2 - (VIEW / 2 - p.y) * ratio }, s))
    setZoom(z)
  }

  const onLoad = () => {
    const el = img.current!
    const n = { w: el.naturalWidth, h: el.naturalHeight }
    const b = VIEW / Math.min(n.w, n.h)
    setNatural(n)
    setPos({ x: (VIEW - n.w * b) / 2, y: (VIEW - n.h * b) / 2 })
  }

  const onPointerDown = (e: PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
  }
  const onPointerMove = (e: PointerEvent) => {
    if (drag.current) setPos(clamp({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y }))
  }

  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 40 : 10
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }
    if (moves[e.key]) {
      e.preventDefault()
      setPos((p) => clamp({ x: p.x + moves[e.key][0], y: p.y + moves[e.key][1] }))
    } else if (e.key === '+' || e.key === '=') zoomTo(zoom + 0.1)
    else if (e.key === '-') zoomTo(zoom - 0.1)
  }

  const confirm = () => {
    const canvas = document.createElement('canvas')
    canvas.width = OUT
    canvas.height = OUT
    const side = VIEW / scale
    canvas.getContext('2d')!.drawImage(img.current!, -pos.x / scale, -pos.y / scale, side, side, 0, 0, OUT, OUT)
    canvas.toBlob((blob) => onDone(blob ? new File([blob], pending.file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }) : null), 'image/jpeg', 0.9)
  }

  return (
    <dialog ref={dialog} onClose={() => onDone(null)} aria-labelledby="crop-title" className="m-auto rounded-card border border-line bg-bg p-6 text-text shadow-card">
      <h2 id="crop-title" className="text-lg">
        قصّ الصورة مربعاً
      </h2>
      <p className="mt-1 text-sm text-muted">اسحب الصورة لتضع الوجه في الدائرة، وكبّرها بالمنزلق.</p>
      <div
        dir="ltr"
        tabIndex={0}
        role="img"
        aria-label="منطقة القص. الأسهم تحرك الصورة، و + و - للتكبير والتصغير."
        onKeyDown={onKey}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => (drag.current = null)}
        className="relative mx-auto mt-5 cursor-grab touch-none overflow-hidden rounded-field bg-surface select-none active:cursor-grabbing"
        style={{ width: VIEW, height: VIEW }}
      >
        <img
          ref={img}
          src={pending.url}
          alt=""
          draggable={false}
          onLoad={onLoad}
          className="absolute top-0 left-0 max-w-none origin-top-left"
          style={{ width: size.w, height: size.h, transform: `translate(${pos.x}px, ${pos.y}px)` }}
        />
        {/* The circle the site shows; the corners outside it are dimmed. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_999px_var(--scrim)] ring-2 ring-bg/80" />
      </div>
      <label className="mt-5 flex items-center gap-3 text-sm">
        <span className="shrink-0 text-muted">التكبير</span>
        <input type="range" min={1} max={MAX_ZOOM} step={0.01} value={zoom} onChange={(e) => zoomTo(Number(e.target.value))} className="w-full cursor-pointer accent-accent" />
      </label>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={() => onDone(null)}>
          إلغاء
        </Button>
        <Button onClick={confirm} disabled={!natural}>
          قصّ وارفع
        </Button>
      </div>
    </dialog>
  )
}
