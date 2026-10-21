import { Cinzel, Cinzel_Decorative, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import LayoutClient from './LayoutClient';
import { CONTACT_EMAIL, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site';
import { readingsData } from '@/lib/readings-data';

// Re-exportar metadata desde el archivo dedicado
export { metadata } from './metadata';

const cinzelDecorative = Cinzel_Decorative({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-cinzel-decorative",
});

// Cinzel sin ornamentos para etiquetas, navegación y botones
const cinzel = Cinzel({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-cinzel",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
});

// Identidad del sitio para Google y asistentes de IA. Las páginas enlazan a estos @id.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": absoluteUrl('/#website'),
      "url": SITE_URL,
      "name": SITE_NAME,
      "alternateName": "The Rabbit of Lunaria",
      "description": SITE_DESCRIPTION,
      "publisher": { "@id": absoluteUrl('/#organization') },
      "inLanguage": "es-MX",
    },
    {
      "@type": "Organization",
      "@id": absoluteUrl('/#organization'),
      "name": SITE_NAME,
      "url": SITE_URL,
      "email": CONTACT_EMAIL,
      "description": SITE_DESCRIPTION,
      "logo": {
        "@type": "ImageObject",
        "url": absoluteUrl('/icon.png'),
      },
      "areaServed": "MX",
      "knowsLanguage": "es",
      "knowsAbout": ["Tarot", "Arcanos mayores", "Lectura de vidas pasadas", "Espiritualidad", "Brujería"],
      "makesOffer": readingsData.map((reading) => ({
        "@type": "Offer",
        "price": reading.priceValue.toFixed(2),
        "priceCurrency": "MXN",
        "url": absoluteUrl('/citas'),
        "itemOffered": { "@type": "Service", "name": reading.title, "description": reading.description },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <head>
        <Script
          src="https://cdn.jsdelivr.net/gh/bigdatacloudapi/js-reverse-geocode-client@9ab66c35f7914b9d9a54b3e57fd465916d45ec65/bigdatacloud_reverse_geocode.min.js"
          strategy="afterInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${cinzelDecorative.variable} ${cinzel.variable} ${cormorantGaramond.variable} antialiased bg-night text-moon-50`}
      >
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
