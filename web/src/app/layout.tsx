import type { Metadata, Viewport } from 'next'
import { Alexandria, Cormorant_Garamond, IBM_Plex_Sans_Arabic } from 'next/font/google'
import { getSettings } from '@/lib/api'
import { whatsappLink } from '@/lib/format'
import { MOTION_SCRIPT } from '@/lib/motion'
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/seo'
import { THEME_SCRIPT } from '@/lib/theme'
import { HorizonLines } from './_shell/HorizonLines'
import { ScrollProgress } from './_shell/ScrollProgress'
import { SiteFooter } from './_shell/SiteFooter'
import { SiteHeader } from './_shell/SiteHeader'
import { SvgSprite } from './_shell/SvgSprite'
import { WhatsAppFloat } from './_shell/WhatsAppFloat'
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

// NexaBridge's own wordmark face, for its card title only.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: '500',
  display: 'swap',
  variable: '--font-cormorant',
})

// The home page's metadata, and every other page's defaults (see lib/seo.ts → pageMetadata).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — شركة برمجيات`, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'ar_AR',
    title: `${SITE_NAME} — نبني برمجيات تفتح أفقاً أوسع`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = { viewportFit: 'cover' }

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const settings = await getSettings()

  return (
    // The head script sets data-theme and classes before hydration, hence suppressHydrationWarning.
    <html lang="ar" dir="rtl" className={`${alexandria.variable} ${plex.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT + MOTION_SCRIPT }} />
      </head>
      <body>
        <HorizonLines />
        <ScrollProgress />
        <SvgSprite />
        <SiteHeader />
        {children}
        <SiteFooter />
        <WhatsAppFloat href={whatsappLink(settings.whatsapp_number)} />
      </body>
    </html>
  )
}
