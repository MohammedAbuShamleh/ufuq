'use client'

import { useRef, useState, type ReactNode } from 'react'
import { Kicker } from '@/components/Kicker'
import { Reveal } from '@/components/Reveal'
import { keepInPlace } from '@/lib/keepInPlace'
import './services.css'

type Service = { title: string; text: string; points: string[]; tech: string; icon: ReactNode }

const ICON = { viewBox: '0 0 32 32', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const SERVICES: Service[] = [
  {
    title: 'المواقع الإبداعية',
    text: 'مواقع إبداعية بتصميم خاص وحركة مدروسة، تحكي قصة مؤسستك وتبقى في ذاكرة زائرها.',
    points: ['تصميم إبداعي خاص، لا قالب جاهز', 'بلغتين وبوضعين فاتح وداكن', 'حركة وتفاعل يعملان على كل الشاشات'],
    tech: 'React · TypeScript · Tailwind',
    icon: (
      <svg {...ICON}>
        <rect x="3" y="6" width="26" height="20" rx="3" />
        <path d="M3 11h26M7 8.5h.01M10 8.5h.01" />
        <path d="M9 16h8M9 20h12" />
      </svg>
    ),
  },
  {
    title: 'أنظمة ERP',
    text: 'مشتريات ومبيعات ومخازن وموظفون ورواتب في نظام واحد، مبني على إجراءاتك لا العكس.',
    points: ['دورة شراء كاملة مع اعتمادات', 'مخازن متعددة وأرصدة لحظية', 'موارد بشرية وحضور ورواتب'],
    tech: 'Spring Boot · Laravel · React',
    icon: (
      <svg {...ICON}>
        <path d="M16 4l10 5-10 5-10-5z" />
        <path d="M6 15l10 5 10-5M6 21l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: 'الأنظمة المالية',
    text: 'قيود يومية وصناديق وتقارير، وسجل تدقيق يحفظ كل تعديل.',
    points: ['صحيفة يومية وصناديق متعددة', 'تقارير جاهزة وتصدير إلى Excel', 'سجل تدقيق لكل عملية'],
    tech: 'Laravel · React · MySQL',
    icon: (
      <svg {...ICON}>
        <rect x="5" y="4" width="22" height="24" rx="3" />
        <path d="M10 10h12M10 15h12M10 20h6" />
        <path d="M20 20l2 2 3-4" />
      </svg>
    ),
  },
  {
    title: 'المنصات الإلكترونية',
    text: 'لوحات تحكم لإدارة البرامج والطلبات والمتابعة، بصلاحيات لكل دور.',
    points: ['صلاحيات يفحصها الخادم لكل دور', 'سير عمل بحالات واضحة', 'لوحات وإحصاءات لكل قسم'],
    tech: 'React · Laravel · Sanctum',
    icon: (
      <svg {...ICON}>
        <rect x="4" y="4" width="10" height="10" rx="2" />
        <rect x="18" y="4" width="10" height="6" rx="2" />
        <rect x="18" y="14" width="10" height="14" rx="2" />
        <rect x="4" y="18" width="10" height="10" rx="2" />
      </svg>
    ),
  },
  {
    title: 'تطبيقات الجوال',
    text: 'تطبيقات للمعلمين والمشرفين والطلاب والعملاء، متصلة بمنصتك وتعمل في الميدان.',
    points: ['تطبيق واحد لأندرويد وآيفون', 'مرتبط بلوحة الإدارة مباشرة', 'واجهات عربية مريحة باليد'],
    tech: 'Flutter',
    icon: (
      <svg {...ICON}>
        <rect x="9" y="3" width="14" height="26" rx="3" />
        <path d="M14 25h4" />
      </svg>
    ),
  },
]

/**
 * Five panels, not numbered: they are kinds of work, not steps in an order.
 * The open one widens and turns dark. A mouse opens a panel by
 * hovering, touch and keyboard by pressing it. Below 960px they stack into an
 * accordion, which opens on a press only: there, opening one moves the others
 * up or down, and on hover the panel under a still pointer would keep changing.
 */
export function Services() {
  const [open, setOpen] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)
  const hoverOpens = () => matchMedia('(hover: hover) and (pointer: fine) and (min-width: 961px)').matches

  // Stacked, opening a panel closes the open one; if that one is above the
  // screen, the pressed panel is held where it was rather than sliding up
  // under the nav. Side by side the panels share one row, so nothing moves.
  const show = (i: number, pressed: Element) => {
    if (i !== open) keepInPlace(pressed, listRef.current?.children[open], () => setOpen(i))
  }

  return (
    <section className="sv" id="services" aria-labelledby="sv-title">
      <div className="wrap">
        <div className="sv-head">
          <div>
            <Kicker>خدماتنا</Kicker>
            <Reveal as="h2" id="sv-title" words="ما نبنيه." />
          </div>
          <p className="muted">خمسة أنواع من البرمجيات، نبني كلاً منها حول طريقة عملكم.</p>
        </div>
        <ul ref={listRef} className="sv-panels">
          {SERVICES.map((s, i) => (
            <li key={s.title} className={`sv-p${open === i ? ' on' : ''}`} onMouseEnter={() => hoverOpens() && setOpen(i)}>
              <button
                type="button"
                className="sv-hit"
                aria-labelledby={`sv-t-${i}`}
                aria-expanded={open === i}
                aria-controls={`sv-more-${i}`}
                data-moves-page
                onClick={(e) => show(i, e.currentTarget)}
                onFocus={(e) => show(i, e.currentTarget)}
              />
              <div className="sv-top">
                <span className="sv-ic" aria-hidden="true">
                  {s.icon}
                </span>
              </div>
              <div className="sv-bot">
                <h3 id={`sv-t-${i}`}>{s.title}</h3>
                <div className="sv-more" id={`sv-more-${i}`}>
                  <div>
                    <p>{s.text}</p>
                    <ul>
                      {s.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                    <span className="sv-tech">{s.tech}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
