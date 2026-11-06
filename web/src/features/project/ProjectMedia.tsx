'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { DemoPill } from '@/components/DemoPill'
import { MediaImage } from '@/components/MediaImage'
import { useInView } from '@/hooks/useInView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { fill } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries/ar'
import { isVideo } from '@/lib/media'
import type { Media } from '@/lib/types'
import { rowsOf, type Shot } from './screens'

const COVER_SIZES = '(max-width: 1440px) calc(100vw - 3rem), 1392px'
const FULL_SIZES = '(max-width: 1288px) calc(100vw - 3rem), 1240px'
const HALF_SIZES = '(max-width: 760px) calc(100vw - 3rem), 620px'
const PHONE_SIZES = '(max-width: 760px) 46vw, 230px'
const BOX_SIZES = '(max-width: 1170px) 94vw, 1100px'

type Copy = Dictionary['project']['media']

type Props = {
  title: string
  cover: Shot | null
  wide: Shot[]
  phones: Shot[]
  /** The «sample data» mark, when the screens were taken with sample data. */
  demo: string | null
  /** «داخل المنصة»: the walk-through's heading. */
  inside: string
  copy: Copy
  /** The band between the cover and the walk-through (what the work offers), drawn on the server. */
  children?: ReactNode
}

/**
 * Every screen of a project, in the order a visitor meets the work: the
 * cover across the page, then the band passed in as children, then the
 * walk-through of the other screens and the phones. Any image opens full size.
 */
export function ProjectMedia({ title, cover, wide, phones, demo, inside, copy, children }: Props) {
  const [open, setOpen] = useState<Shot | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  // A project with phones only opens on them, so the walk-through has nothing left to show.
  const phoneStage = !cover && phones.length > 0
  const walk = wide.length > 0 || (!phoneStage && phones.length > 0)

  // Opened from an effect so the image is rendered before the dialog shows.
  useEffect(() => {
    if (open && dialog.current && !dialog.current.open) dialog.current.showModal()
  }, [open])

  return (
    <>
      {cover && (
        <section className={`pp-stage${children ? ' pp-stage-band' : ''}`} aria-label={fill(copy.cover, { title })}>
          <figure className="pp-cover">
            <div className="pp-cover-frame" style={ratio(cover.file)}>
              {isVideo(cover.file) ? (
                <ScreenVideo media={cover.file} label={cover.alt} />
              ) : (
                <MediaImage media={cover.file} alt={cover.alt ?? ''} fill sizes={COVER_SIZES} />
              )}
              {demo && <DemoPill label={demo} />}
            </div>
            <Caption shot={cover} />
          </figure>
        </section>
      )}

      {phoneStage && (
        <section className="pp-stage pp-stage-phones" aria-label={fill(copy.stage, { title })}>
          <div className="wrap">
            <Niches shots={phones} title={title} copy={copy} onOpen={setOpen} />
            {demo && <DemoPill label={demo} />}
          </div>
        </section>
      )}

      {children}

      {walk && (
        <section className="pp-walk" aria-labelledby="walk-title">
          <div className="wrap">
            <div className="pp-head2">
              <h2 id="walk-title">{inside}</h2>
              <p>{copy.hint}</p>
            </div>

            {wide.length > 0 && (
              <div className="pp-rows">
                {rowsOf(wide).map((row) => (
                  <div key={row[0].file.url} className={row.length === 2 ? 'pp-row pp-row-2' : 'pp-row'}>
                    {row.map((s) => (
                      <figure key={s.file.url} className="pp-shot">
                        {isVideo(s.file) ? (
                          <div className="pp-frame" style={row.length === 1 ? ratio(s.file) : undefined}>
                            <ScreenVideo media={s.file} label={s.alt} />
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="pp-frame"
                            style={row.length === 1 ? ratio(s.file) : undefined}
                            aria-haspopup="dialog"
                            aria-label={fill(copy.zoom, { name: s.label ?? s.alt ?? copy.screen })}
                            onClick={() => setOpen(s)}
                          >
                            <MediaImage media={s.file} alt={s.alt ?? ''} fill sizes={row.length === 2 ? HALF_SIZES : FULL_SIZES} />
                          </button>
                        )}
                        <Caption shot={s} />
                      </figure>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {!phoneStage && phones.length > 0 && (
              <div className="pp-phones">
                {wide.length > 0 && <h3>{copy.onPhone}</h3>}
                <Niches shots={phones} title={title} copy={copy} onOpen={setOpen} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Esc closes it natively; a click on the backdrop lands on the dialog itself. */}
      <dialog
        ref={dialog}
        className="pp-box"
        aria-label={fill(copy.box, { title })}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      >
        {open && (
          <>
            <button type="button" className="pp-box-x" aria-label={copy.close} onClick={() => dialog.current?.close()}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <MediaImage
              media={open.file}
              alt={open.alt ?? ''}
              sizes={open.kind === 'mobile' ? '420px' : BOX_SIZES}
              className={open.kind === 'mobile' ? 'pp-box-ph' : undefined}
            />
            {(open.label || open.alt) && <p>{[open.label, open.alt].filter(Boolean).join(' · ')}</p>}
          </>
        )}
      </dialog>
    </>
  )
}

/** No taller than 16:10: a long page capture shows its top, not a column of scroll. */
const TALLEST = 16 / 10

/** The file's own proportions, so a screen across the page shows whole, up to the tallest frame. */
function ratio(media: Media) {
  if (!media.width || !media.height) return undefined
  return { aspectRatio: media.width / media.height < TALLEST ? '16 / 10' : `${media.width} / ${media.height}` }
}

function Caption({ shot }: { shot: Shot }) {
  if (!shot.label && !shot.alt) return null
  return (
    <figcaption className="pp-cap">
      {shot.label && <b>{shot.label}</b>}
      {shot.alt && shot.alt !== shot.label && <span>{shot.alt}</span>}
    </figcaption>
  )
}

// The logo's arch (as in ArchClip), filled, and its edge without the floor line.
const ARCH = 'M0 1V.44C0 .2.28.06.5 0 .72.06 1 .2 1 .44V1Z'
const ARCH_EDGE = 'M0 1V.44C0 .2.28.06.5 0 .72.06 1 .2 1 .44V1'

/** Phones standing in arches, the logo's shape: a row that scrolls sideways when it outgrows the page. */
function Niches({ shots, title, copy, onOpen }: { shots: Shot[]; title: string; copy: Copy; onOpen: (s: Shot) => void }) {
  return (
    // More than two scroll on a phone, and a row that scrolls has to take focus so the keyboard can move it.
    <ul className="pp-niches" tabIndex={shots.length > 2 ? 0 : undefined} aria-label={fill(copy.phones, { title })}>
      {shots.map((s) => (
        <li key={s.file.url} className="pp-niche">
          <span className="pp-niche-box">
            <svg className="pp-arch" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">
              <path className="pp-arch-fill" d={ARCH} />
              <path className="pp-arch-line" d={ARCH_EDGE} />
            </svg>
            {isVideo(s.file) ? (
              <span className="pp-ph">
                <ScreenVideo media={s.file} label={s.alt} />
              </span>
            ) : (
              <button type="button" className="pp-ph" aria-haspopup="dialog" aria-label={fill(copy.zoom, { name: s.label ?? s.alt ?? copy.screen })} onClick={() => onOpen(s)}>
                <MediaImage media={s.file} alt={s.alt ?? ''} fill sizes={PHONE_SIZES} />
              </button>
            )}
          </span>
          {(s.label || s.alt) && <p className="pp-niche-cap">{s.label ?? s.alt}</p>}
        </li>
      ))}
    </ul>
  )
}

/**
 * A muted loop that plays only while half of it is on screen and motion is
 * allowed (the footer's «إيقاف الحركة» stops it). Paused, it shows the
 * frame one second in rather than a black first frame.
 */
function ScreenVideo({ media, label }: { media: Media; label: string | null }) {
  const ref = useRef<HTMLVideoElement>(null)
  const inView = useInView(ref, { threshold: 0.5 })
  const still = useReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (inView && !still) video.play().catch(() => {})
    else video.pause()
  }, [inView, still])

  return (
    <video ref={ref} muted loop playsInline preload="metadata" aria-label={label ?? undefined}>
      <source src={`${media.url}#t=1`} type={media.mime} />
    </video>
  )
}
