import type { Metadata, Viewport } from 'next'
import { Alexandria, IBM_Plex_Sans_Arabic } from 'next/font/google'
import { THEME_SCRIPT } from '@/lib/theme'
import './globals.css'

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

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // The head script sets data-theme before hydration, hence suppressHydrationWarning.
    <html lang="ar" dir="rtl" className={`${alexandria.variable} ${plex.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
