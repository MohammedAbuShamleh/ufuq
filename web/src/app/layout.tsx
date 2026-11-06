import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans_Arabic } from 'next/font/google'
import localFont from 'next/font/local'
import { getSettings } from '@/lib/api'
import { whatsappLink } from '@/lib/format'
import { MOTION_SCRIPT } from '@/lib/motion'
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/seo'
import { THEME_SCRIPT } from '@/lib/theme'
import { HorizonLines } from './_shell/HorizonLines'
import { ScrollProgress } from './_shell/ScrollProgress'
import { SiteFooter } from './_shell/SiteFooter'
import { SiteHeader } from './_shell/SiteHeader'
import { SmoothScroll } from './_shell/SmoothScroll'
import { SvgSprite } from './_shell/SvgSprite'
import { WhatsAppFloat } from './_shell/WhatsAppFloat'
import './globals.css'
import './site.css'

// Thmanyah, under its own licence (fonts/thmanyah-LICENSE.pdf): the files go
// in as shipped, never subset or edited. Sans for the interface, Serif Display
// for big type: Bold for headings (600 resolves to it), Medium for large
// running text (the big lists and quotes).
const thmanyahSans = localFont({
  src: [
    { path: './fonts/thmanyahsans-Regular.woff2', weight: '400' },
    { path: './fonts/thmanyahsans-Medium.woff2', weight: '500' },
    { path: './fonts/thmanyahsans-Bold.woff2', weight: '700' },
  ],
  display: 'swap',
  variable: '--font-thmanyah-sans',
})

const thmanyahSerif = localFont({
  src: [
    { path: './fonts/thmanyahserifdisplay-Medium.woff2', weight: '500' },
    { path: './fonts/thmanyahserifdisplay-Bold.woff2', weight: '700' },
  ],
  display: 'swap',
  variable: '--font-thmanyah-serif',
})

// Running text (paragraphs, lists, quotes). Self-hosted at build time: no
// request to Google during a visit.
const plex = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-plex',
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
    <html lang="ar" dir="rtl" className={`${thmanyahSans.variable} ${thmanyahSerif.variable} ${plex.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT + MOTION_SCRIPT }} />
      </head>
      <body>
        <HorizonLines />
        <ScrollProgress />
        <SmoothScroll />
        <SvgSprite />
        <SiteHeader />
        {children}
        <SiteFooter />
        <WhatsAppFloat href={whatsappLink(settings.whatsapp_number)} />
      </body>
    </html>
  )
}
