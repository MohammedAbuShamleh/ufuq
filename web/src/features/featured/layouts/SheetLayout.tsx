'use client'

import { useEffect, useRef, useState } from 'react'
import { DemoPill } from '@/components/DemoPill'
import { MediaImage } from '@/components/MediaImage'
import { Meta, shown, SimilarCta, Tech, Title, type LayoutProps, type Shown } from '../parts'

const CELL_SIZES = '(max-width: 960px) 50vw, 400px'
const FULL_SIZES = '(max-width: 1170px) 94vw, 1100px'

/**
 * RasRas: the copy and its points on one row, then every desktop screen in
 * a sheet. A screen opens full size in a dialog.
 */
export function SheetLayout({ project, heading, linkTitle, contactHref }: LayoutProps) {
  const screens = shown(project.screens, (k) => k === 'desktop')
  const [open, setOpen] = useState<Shown | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  // Opened from an effect so the image is rendered before the dialog shows.
  useEffect(() => {
    if (open && dialog.current && !dialog.current.open) dialog.current.showModal()
  }, [open])

  return (
    <article className="fb fb3">
      <div className="fb3-copy">
        <Meta project={project} />
        <Title project={project} heading={heading} linkTitle={linkTitle} />
        {project.summary && <p>{project.summary}</p>}
        {project.highlights.length > 0 && (
          <ul>
            {project.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        <div className="fb-foot">
          <Tech project={project} />
          <SimilarCta project={project} href={contactHref} />
        </div>
      </div>

      {screens.length > 0 && (
        <div className="fb3-sheet">
          <div className="fb3-grid">
            {screens.map((s) => (
              <button key={s.file.url} type="button" className="fb3-cell" aria-haspopup="dialog" onClick={() => setOpen(s)}>
                <span className="fb3-img">
                  <MediaImage media={s.file} alt={s.alt ?? ''} fill sizes={CELL_SIZES} />
                </span>
                {s.label && <span className="fb3-l">{s.label}</span>}
              </button>
            ))}
          </div>
          <div className="fb3-note">
            <span>اضغط أي شاشة لتكبيرها.</span>
            {project.has_demo_data && <DemoPill />}
          </div>
        </div>
      )}

      {/* Esc closes it natively; a click on the backdrop lands on the dialog itself. */}
      <dialog
        ref={dialog}
        className="fb3-box"
        aria-label={`شاشة من ${project.title}`}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      >
        {open && (
          <>
            <button type="button" className="fb3-x" aria-label="إغلاق" onClick={() => dialog.current?.close()}>
              ×
            </button>
            <MediaImage media={open.file} alt={open.alt ?? ''} sizes={FULL_SIZES} />
            <p>{[open.label, open.alt].filter(Boolean).join(' · ')}</p>
          </>
        )}
      </dialog>
    </article>
  )
}
