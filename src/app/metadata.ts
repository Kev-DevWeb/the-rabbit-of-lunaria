import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.themadrigueradelunaria.com'),
  title: {
    default: 'La Madriguera de Lunaria | Tarot y Guía Espiritual',
    template: '%s | La Madriguera de Lunaria'
  },
  description: 'Descubre claridad y guía espiritual a través del tarot con los 21 Arcanos Mayores. Un espacio mágico para brujit@s, baby witches y buscadores espirituales. Lecturas de tarot, comunicación espiritual y enseñanza para nuevos brujos.',
  keywords: [
    'tarot',
    'lectura de tarot',
    'arcanos mayores',
    'guía espiritual',
    'brujería',
    'baby witch',
    'magia',
    'tarotista',
    'comunicación espiritual',
    'lecturas online',
    'enseñanza de tarot',
    'grimorio',
    'lunaria',
    'tarot en español',
    'consultas de tarot',
    'espiritualidad',
    'desarrollo espiritual',
    'guardián espiritual',
    'tarot profesional',
    'aprender tarot'
  ],
  authors: [{ name: 'Arledge Brer', url: 'https://www.themadrigueradelunaria.com/sobre-mi' }],
  creator: 'Arledge Brer',
  publisher: 'La Madriguera de Lunaria',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://www.themadrigueradelunaria.com',
    siteName: 'La Madriguera de Lunaria',
    title: 'La Madriguera de Lunaria | Tarot y Guía Espiritual',
    description: 'Descubre claridad y guía espiritual a través del tarot con los 21 Arcanos Mayores. Un espacio mágico para brujit@s y buscadores espirituales.',
    images: [
      {
        url: '/Plantilla diseño.png',
        width: 1200,
        height: 630,
        alt: 'La Madriguera de Lunaria - Tarot y Guía Espiritual',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Madriguera de Lunaria | Tarot y Guía Espiritual',
    description: 'Descubre claridad y guía espiritual a través del tarot con los 21 Arcanos Mayores.',
    images: ['/Plantilla diseño.png'],
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
  alternates: {
    canonical: 'https://www.themadrigueradelunaria.com',
  },
  verification: {
    // Agregar aquí cuando tengas las verificaciones
    // google: 'tu-codigo-de-verificacion-google',
    // yandex: 'tu-codigo-de-verificacion-yandex',
    // bing: 'tu-codigo-de-verificacion-bing',
  },
  category: 'espiritualidad',
}
