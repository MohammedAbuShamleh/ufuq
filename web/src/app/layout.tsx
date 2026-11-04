import type { Metadata, Viewport } from 'next'
import { Alexandria, Cormorant_Garamond, IBM_Plex_Sans_Arabic } from 'next/font/google'
import { getSettings } from '@/lib/api'
import { whatsappLink } from '@/lib/format'
import { MOTION_SCRIPT } from '@/lib/motion'
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

const description =
  'أفق شركة برمجيات من غزة، تبني أنظمة وبرمجيات للجمعيات والمدارس والشركات منذ ٢٠٢٢: منصات، وأنظمة ERP ومالية، وتطبيقات جوال، ومواقع.'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'أفق | UFUQ — شركة برمجيات', template: '%s · أفق | UFUQ' },
  description,
  openGraph: {
    type: 'website',
    siteName: 'أفق | UFUQ',
    locale: 'ar_AR',
    title: 'أفق | UFUQ — نبني برمجيات تفتح أفقاً أوسع',
    description,
    images: [
      {
        url: '/og/og-ufuq-ar.png',
        width: 1200,
        height: 630,
        alt: 'أفق | UFUQ — أنظمة وبرمجيات للجمعيات والمدارس والشركات',
      },
    ],
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
