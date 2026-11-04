'use client'

import { useRef } from 'react'
import type { Settings } from '@/lib/types'

type Props = { sections: NonNullable<Settings['privacy_policy']>; draft: boolean }

const EMAIL = /([\w.+-]+@[\w-]+\.[\w.]+)/

export function PrivacyDialog({ sections, draft }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button type="button" className="link-btn" onClick={() => ref.current?.showModal()}>
        سياسة الخصوصية
      </button>
      {/* A click on the backdrop lands on the dialog itself: close. */}
      <dialog ref={ref} className="pv" aria-labelledby="pv-title" onClick={(e) => e.target === ref.current && ref.current.close()}>
        <div className="pv-in">
          <button type="button" className="pv-x" aria-label="إغلاق" onClick={() => ref.current?.close()}>
            ×
          </button>
          {draft && <span className="pv-draft">مسودة للمراجعة</span>}
          <h2 id="pv-title">سياسة الخصوصية</h2>
          {sections.map((s) => (
            <section key={s.heading}>
              <h3>{s.heading}</h3>
              {s.paragraphs.map((p) => (
                <p key={p}>
                  {p.split(EMAIL).map((part, i) =>
                    i % 2 ? (
                      <a key={i} href={`mailto:${part}`} dir="ltr">
                        {part}
                      </a>
                    ) : (
                      part
                    ),
                  )}
                </p>
              ))}
            </section>
          ))}
        </div>
      </dialog>
    </>
  )
}
