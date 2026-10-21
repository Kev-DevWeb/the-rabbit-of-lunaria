import { Metadata } from 'next'
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL, absoluteUrl } from '@/lib/site'

const defaultTitle = `${SITE_NAME} | ${SITE_TAGLINE}`

// La imagen para redes sale de app/opengraph-image.tsx (se genera sola por ruta)
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'tarot',
    'lectura de tarot',
    'lectura de tarot en línea',
    'tarot online en español',
    'tirada de 3 cartas',
    'lectura de vidas pasadas',
    'arcanos mayores',
    'guía espiritual',
    'guardián espiritual',
    'tarotista en México',
    'consulta de tarot',
    'brujería',
    'baby witch',
    'grimorio',
    'aprender tarot',
    'espiritualidad',
  ],
  authors: [{ name: SITE_AUTHOR, url: absoluteUrl('/sobre-mi') }],
  creator: SITE_AUTHOR,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: defaultTitle,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  // Cada página declara su propio canonical; este solo aplica al inicio
  alternates: {
    canonical: '/',
    languages: { 'es-MX': '/' },
  },
  // Códigos de verificación de Google Search Console y Bing Webmaster Tools (variables en Vercel)
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  category: 'espiritualidad',
}
