import type { ReactNode } from 'react'
import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'
import { Arrow } from '@/components/Button'
import { fillNodes, href, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/server'
import { getSettings } from '@/lib/api'
import { formatYear, SHOW_PENDING, whatsappLink } from '@/lib/format'
import { Logo } from './Logo'
import { FooterMotionToggle } from './FooterMotionToggle'

export async function SiteFooter({ locale }: { locale: Locale }) {
  'use cache'
  // The copyright year is read here, so the footer is cached as a whole (once per language).
  cacheLife('days')
  // Tagged here too: a saved setting must reach this outer entry, not only getSettings'.
  cacheTag('settings')
  const [t, settings] = await Promise.all([getDictionary(locale), getSettings(locale)])
  const f = t.footer
  const link = (path: string) => href(locale, path)
  const social = settings.social_links
  const hasSocial = SHOW_PENDING || Boolean(social?.linkedin || social?.x || social?.instagram)
  const support = whatsappLink(settings.whatsapp_number)
  const pending = t.common.pendingLink

  return (
    <footer className="foot">
      <div className="wrap foot-top">
        <div className="foot-brand">
          <Logo className="logo-svg" label={t.common.logo} />
          <p>{settings.hero_tagline}.</p>
          {hasSocial && (
          <div className="social">
            <SocialLink href={social?.linkedin} label={f.social.linkedin} pending={pending}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.06c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.86 2.66 4.86 6.12V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4z" />
              </svg>
            </SocialLink>
            <SocialLink href={social?.x} label={f.social.x} pending={pending}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.8 3h3.3l-7.2 8.2L22.3 21h-6.6l-5.2-6.8L4.6 21H1.3l7.7-8.8L1 3h6.8l4.7 6.2zm-1.2 16h1.8L6.6 4.9H4.7z" />
              </svg>
            </SocialLink>
            <SocialLink href={social?.instagram} label={f.social.instagram} pending={pending}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.3" cy="6.7" r=".6" fill="currentColor" />
              </svg>
            </SocialLink>
          </div>
          )}
        </div>
        <nav className="foot-col" aria-label={f.site}>
          <h2>{f.site}</h2>
          <Link href={link('/work')}>{t.nav.links.projects}</Link>
          <Link href={link('/about')}>{t.nav.links.about}</Link>
          <Link href={link('/#services')}>{t.nav.links.services}</Link>
          <Link href={link('/#approach')}>{t.nav.links.approach}</Link>
          <Link href={link('/#contact')}>{t.nav.links.contact}</Link>
        </nav>
        <nav className="foot-col" aria-label={f.services}>
          <h2>{f.services}</h2>
          {t.services.items.map(({ title }) => (
            <Link key={title} href={link('/#services')}>
              {title}
            </Link>
          ))}
        </nav>
        <div className="foot-col foot-contact">
          <h2>{f.contact}</h2>
          {settings.contact_email && (
            <a href={`mailto:${settings.contact_email}`} dir="ltr" className="ltr foot-mail">
              {settings.contact_email}
            </a>
          )}
          {/* A column on wide screens, one row of short items on a phone. */}
          <div className="foot-meta">
            <span>{f.country}</span>
            <MaybeLink href={support} external pending={pending}>
              {f.support}
            </MaybeLink>
            <MaybeLink href={settings.profile_pdf} external pending={pending}>
              {f.profile}
            </MaybeLink>
          </div>
          <Link className="link-arrow foot-cta" href={link('/#contact')}>
            {t.common.startProject} <Arrow />
          </Link>
        </div>
      </div>
      <div className="wrap foot-bottom">
        {/* Kept apart by drawn rules, not «·», which reads as the Arabic zero. */}
        <span className="foot-legal">
          <span>{fillNodes(f.copyright, { year: formatYear(locale, new Date().getFullYear()) })}</span>
          <Link href={link('/privacy')}>{f.privacy}</Link>
          <FooterMotionToggle copy={t.common.motion} />
        </span>
        <Link href={link('/#top')} className="to-top">
          {f.toTop}
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
function MaybeLink({
  href,
  external,
  className,
  pending,
  children,
}: {
  href: string | null | undefined
  external?: boolean
  className?: string
  /** The placeholder's tooltip. */
  pending: string
  children: ReactNode
}) {
  if (!href) {
    if (!SHOW_PENDING) return null
    return (
      <span className={`pending ${className ?? ''}`.trim()} title={pending}>
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

function SocialLink({ href, label, pending, children }: { href: string | null | undefined; label: string; pending: string; children: ReactNode }) {
  return (
    <MaybeLink href={href} external pending={pending}>
      <span className="sr-only">{label}</span>
      {children}
    </MaybeLink>
  )
}
