import type { ReactNode } from 'react'
import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'
import { Arrow } from '@/components/Button'
import { getSettings } from '@/lib/api'
import { arYear, SHOW_PENDING, whatsappLink } from '@/lib/format'
import { Logo } from './Logo'
import { FooterMotionToggle } from './FooterMotionToggle'

const SERVICES = ['المواقع الإبداعية', 'أنظمة ERP', 'الأنظمة المالية', 'المنصات الإلكترونية', 'تطبيقات الجوال']

export async function SiteFooter() {
  'use cache'
  // The copyright year is read here, so the footer is cached as a whole.
  cacheLife('days')
  // Tagged here too: a saved setting must reach this outer entry, not only getSettings'.
  cacheTag('settings')
  const settings = await getSettings()
  const social = settings.social_links
  const hasSocial = SHOW_PENDING || Boolean(social?.linkedin || social?.x || social?.instagram)
  const support = whatsappLink(settings.whatsapp_number)

  return (
    <footer className="foot">
      <div className="wrap foot-top">
        <div className="foot-brand">
          <Logo className="logo-svg" />
          <p>{settings.hero_tagline}.</p>
          {hasSocial && (
          <div className="social">
            <SocialLink href={social?.linkedin} label="لينكدإن">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.06c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.86 2.66 4.86 6.12V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4z" />
              </svg>
            </SocialLink>
            <SocialLink href={social?.x} label="إكس">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.8 3h3.3l-7.2 8.2L22.3 21h-6.6l-5.2-6.8L4.6 21H1.3l7.7-8.8L1 3h6.8l4.7 6.2zm-1.2 16h1.8L6.6 4.9H4.7z" />
              </svg>
            </SocialLink>
            <SocialLink href={social?.instagram} label="إنستغرام">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.3" cy="6.7" r=".6" fill="currentColor" />
              </svg>
            </SocialLink>
          </div>
          )}
        </div>
        <nav className="foot-col" aria-label="الموقع">
          <h2>الموقع</h2>
          <Link href="/work">أعمالنا</Link>
          <Link href="/about">من نحن</Link>
          <Link href="/#services">خدماتنا</Link>
          <Link href="/#approach">طريقتنا</Link>
          <Link href="/#contact">تواصل معنا</Link>
        </nav>
        <nav className="foot-col" aria-label="خدماتنا">
          <h2>خدماتنا</h2>
          {SERVICES.map((s) => (
            <Link key={s} href="/#services">
              {s}
            </Link>
          ))}
        </nav>
        <div className="foot-col foot-contact">
          <h2>تواصل</h2>
          {settings.contact_email && (
            <a href={`mailto:${settings.contact_email}`} dir="ltr" className="ltr foot-mail">
              {settings.contact_email}
            </a>
          )}
          {/* A column on wide screens, one row of short items on a phone. */}
          <div className="foot-meta">
            <span>فلسطين</span>
            <MaybeLink href={support} external>
              الدعم الفني
            </MaybeLink>
            <MaybeLink href={settings.profile_pdf} external>
              البروفايل (PDF)
            </MaybeLink>
          </div>
          <Link className="link-arrow foot-cta" href="/#contact">
            ابدأ مشروعك <Arrow />
          </Link>
        </div>
      </div>
      <div className="wrap foot-bottom">
        {/* Kept apart by drawn rules, not «·», which reads as the Arabic zero. */}
        <span className="foot-legal">
          <span>© {arYear(new Date().getFullYear())} أفق للبرمجيات. جميع الحقوق محفوظة.</span>
          <Link href="/privacy">سياسة الخصوصية</Link>
          <FooterMotionToggle />
        </span>
        <Link href="/#top" className="to-top">
          العودة للأعلى
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>
        </Link>
      </div>
    </footer>
  )
}

/**
 * A link the client has not given us yet: left out of the live site, a dashed
 * placeholder (not a link) in a preview build.
 */
function MaybeLink({ href, external, className, children }: { href: string | null | undefined; external?: boolean; className?: string; children: ReactNode }) {
  if (!href) {
    if (!SHOW_PENDING) return null
    return (
      <span className={`pending ${className ?? ''}`.trim()} title="الرابط قيد الإعداد">
        {children}
      </span>
    )
  }
  return (
    <a href={href} className={className} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
      {children}
    </a>
  )
}

function SocialLink({ href, label, children }: { href: string | null | undefined; label: string; children: ReactNode }) {
  return (
    <MaybeLink href={href} external>
      <span className="sr-only">{label}</span>
      {children}
    </MaybeLink>
  )
}
