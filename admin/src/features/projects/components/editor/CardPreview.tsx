import { MediaThumb } from '@/components/MediaThumb'
import { buttonClass } from '@/components/ui/buttonClass'
import { ar } from '@/lib/i18n'
import type { ProjectInput, Screen } from '../../types'

const SITE_URL: string = import.meta.env.VITE_SITE_URL ?? 'http://localhost:3000'

/**
 * The project's card in «أعمالنا» as the site will draw it, from the form's
 * current text (saved or not) and the uploaded screens: the first screen is
 * the cover; a phone shot makes a tall card; no screen makes a text card.
 */
export function CardPreview({ values, screens, saved }: { values: ProjectInput; screens: Screen[]; saved: { slug: string; published: boolean } | null }) {
  const cover = screens.find((s) => s.file) ?? null
  const phone = cover?.kind === 'mobile'
  const title = ar(values.title) || 'اسم المشروع'

  return (
    <div className="grid gap-6">
      <p className="text-sm leading-relaxed text-muted">هكذا تظهر البطاقة في صفحة «أعمالنا» بالنص الحالي، حتى قبل الحفظ. الحجم الحقيقي يتغير مع عرض الشاشة.</p>
      <div className="rounded-wall border border-line bg-bg p-6 sm:p-10">
        <article
          className={`relative isolate flex flex-col justify-end overflow-hidden rounded-card border border-line ${cover ? 'bg-surface' : 'bg-olive text-linen'} ${
            phone ? 'min-h-[32rem] max-w-80' : cover ? 'max-w-xl' : 'min-h-64 max-w-sm'
          }`}
        >
          {cover ? (
            <div className={`relative flex-1 overflow-hidden ${phone ? 'mx-auto mt-5 min-h-72 w-[58%] rounded-[24px] border-[5px] border-ink' : 'mx-4 mt-4 min-h-40 rounded-t-[14px] border border-line'}`}>
              <MediaThumb media={cover.file} className="absolute inset-0 h-full w-full" />
            </div>
          ) : (
            <span aria-hidden="true" className="absolute -top-4 end-3 font-display text-[9rem] leading-none font-extrabold opacity-15">
              {(ar(values.client_name) || title).charAt(0)}
            </span>
          )}
          <div className="relative p-6">
            {ar(values.tag) && (
              <span className={`mb-2 inline-block rounded-pill border px-2.5 py-0.5 font-display text-xs ${cover ? 'border-accent/35 text-accent' : 'border-linen/40'}`}>{ar(values.tag)}</span>
            )}
            <h3 className="text-xl leading-snug">{title}</h3>
            {ar(values.summary) && <p className={`mt-1.5 max-w-[46ch] text-sm leading-relaxed ${cover ? 'text-muted' : 'opacity-80'}`}>{ar(values.summary)}</p>}
            {values.tech_stack.length > 0 && (
              <span className={`mt-3 block text-end font-mono text-[0.7rem] ${cover ? 'text-muted' : 'opacity-75'}`} dir="ltr">
                {values.tech_stack.join(' · ')}
              </span>
            )}
          </div>
        </article>
      </div>
      <ul className="grid gap-1.5 text-sm text-muted">
        <li>{values.status === 'published' ? '• منشور: يظهر في الموقع خلال دقيقة من الحفظ.' : '• مسودة: لا يظهر في الموقع حتى تختار «منشور» وتحفظ.'}</li>
        {values.is_featured && <li>• مميز: يظهر أيضاً بالبطاقة الكبيرة ذات الشاشات والتبويبات في الصفحة الرئيسية.</li>}
        {!cover && <li>• لا شاشات بعد: تظهر البطاقة نصية بأول حرف من اسم العميل.</li>}
      </ul>
      {saved?.published && (
        <div>
          <a href={`${SITE_URL}/work/${saved.slug}`} target="_blank" rel="noopener" className={buttonClass('secondary')}>
            افتح صفحة المشروع في الموقع
            <span className="sr-only"> (تفتح في نافذة جديدة)</span>
          </a>
        </div>
      )}
    </div>
  )
}
