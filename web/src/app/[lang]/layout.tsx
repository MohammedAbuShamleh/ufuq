import type { Metadata, Viewport } from 'next'
import { Alexandria, IBM_Plex_Sans_Arabic } from 'next/font/google'
import { dirOf, LOCALES } from '@/i18n/config'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { getDictionary, getLocale } from '@/i18n/server'
import { getSettings } from '@/lib/api'
import { whatsappLink } from '@/lib/format'
import { MOTION_SCRIPT } from '@/lib/motion'
import { siteMetadata } from '@/lib/seo'
import { THEME_SCRIPT } from '@/lib/theme'
import { HorizonLines } from '../_shell/HorizonLines'
import { ScrollProgress } from '../_shell/ScrollProgress'
import { SiteFooter } from '../_shell/SiteFooter'
import { SiteHeader } from '../_shell/SiteHeader'
import { SmoothScroll } from '../_shell/SmoothScroll'
import { SvgSprite } from '../_shell/SvgSprite'
import { WhatsAppFloat } from '../_shell/WhatsAppFloat'
import './globals.css'
import './site.css'

// Self-hosted at build time: no request to Google during a visit.
const alexandria = Alexandria({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-alexandria',
})

const plex = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-plex',
})

/** Every language is built ahead; the proxy (src/proxy.ts) maps addresses onto them. */
export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

// The home page's metadata, and every other page's defaults (see lib/seo.ts → pageMetadata).
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return siteMetadata(locale, await getDictionary(locale))
}

export const viewport: Viewport = { viewportFit: 'cover' }

export default async function RootLayout({ children }: LayoutProps<'/[lang]'>) {
  const locale = await getLocale()
  const [t, settings] = await Promise.all([getDictionary(locale), getSettings(locale)])

  return (
    // The head script sets data-theme and classes before hydration, hence suppressHydrationWarning.
    <html lang={locale} dir={dirOf(locale)} className={`${alexandria.variable} ${plex.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT + MOTION_SCRIPT }} />
      </head>
      <body>
        <LocaleProvider locale={locale}>
          <HorizonLines />
          <ScrollProgress />
          <SmoothScroll />
          <SvgSprite />
          <SiteHeader copy={{ nav: t.nav, logo: t.common.logo, startProject: t.common.startProject }} />
          {children}
          <SiteFooter locale={locale} />
          <WhatsAppFloat href={whatsappLink(settings.whatsapp_number)} copy={t.whatsapp} />
        </LocaleProvider>
      </body>
    </html>
  )
}
