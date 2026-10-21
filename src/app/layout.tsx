import { Cinzel, Cinzel_Decorative, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import LayoutClient from './LayoutClient';

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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.themadrigueradelunaria.com/#website",
      "url": "https://www.themadrigueradelunaria.com",
      "name": "La madriguera de Lunaria",
      "description": "Lecturas de tarot y agendamiento de citas.",
      "publisher": {
        "@id": "https://www.themadrigueradelunaria.com/#organization",
      },
      "inLanguage": "es-MX",
    },
    {
      "@type": "Organization",
      "@id": "https://www.themadrigueradelunaria.com/#organization",
      "name": "La madriguera de Lunaria",
      "url": "https://www.themadrigueradelunaria.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.themadrigueradelunaria.com/logo.png",
        "width": 200,
        "height": 200,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
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
