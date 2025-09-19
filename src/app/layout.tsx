import type { Metadata } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import { Cinzel_Decorative, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AudioProvider } from '@/context/AudioProvider';
import Header from '@/components/Header';
import AppFooter from '@/components/AppFooter';
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzelDecorative = Cinzel_Decorative({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-cinzel-decorative",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
});

export const metadata: Metadata = {
  title: {
    default: "La madriguera de Lunaria - Tarot",
    template: "%s | La madriguera de Lunaria",
  },
  description: "Lecturas de tarot y agendamiento de citas.",
  openGraph: {
    title: "La madriguera de Lunaria - Tarot",
    description: "Lecturas de tarot y agendamiento de citas.",
    url: "https://the-rabbit-of-lunaria.vercel.app",
    siteName: "La madriguera de Lunaria",
    images: [
      {
        url: "https://the-rabbit-of-lunaria.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "La madriguera de Lunaria - Tarot",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://the-rabbit-of-lunaria.vercel.app/#website",
      "url": "https://the-rabbit-of-lunaria.vercel.app",
      "name": "La madriguera de Lunaria",
      "description": "Lecturas de tarot y agendamiento de citas.",
      "publisher": {
        "@id": "https://the-rabbit-of-lunaria.vercel.app/#organization",
      },
      "inLanguage": "es-MX",
    },
    {
      "@type": "Organization",
      "@id": "https://the-rabbit-of-lunaria.vercel.app/#organization",
      "name": "La madriguera de Lunaria",
      "url": "https://the-rabbit-of-lunaria.vercel.app",
      "logo": {
        "@type": "ImageObject",
        "url": "https://the-rabbit-of-lunaria.vercel.app/logo.png",
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
    <html lang="en">
      <head>
        <Script
          src="https://cdn.jsdelivr.net/gh/bigdatacloudapi/js-reverse-geocode-client@latest/bigdatacloud_reverse_geocode.min.js"
          strategy="beforeInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzelDecorative.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} antialiased bg-gray-900 text-white`}
      >
        <AudioProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <AppFooter />
          </div>
        </AudioProvider>
      </body>
    </html>
  );
}
