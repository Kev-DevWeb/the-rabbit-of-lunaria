'use client'
import { usePathname } from 'next/navigation'
import { Geist, Geist_Mono } from "next/font/google";
import { Cinzel_Decorative, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AudioProvider } from '@/context/AudioProvider';
import { BackgroundMusicProvider } from '@/context/BackgroundMusicProvider';
import Header from '@/components/Header';
import AppFooter from '@/components/AppFooter';
import FloatingMusicPlayer from '@/components/FloatingMusicPlayerGSAP';
import { GlobalMusicNotifications } from '@/components/GlobalMusicNotifications';
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

// Metadata object cannot be exported from a client component. 
// We can keep it here, but it might be better to move it to a server component if needed.

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

import { LenisProvider } from '@/context/LenisProvider';

import PageTransition from '@/components/PageTransition';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()
  const isStudioPage = pathname.startsWith('/studio')
  
  // Determinar si estamos en grimorio
  const isInGrimoire = pathname.startsWith('/articulos') || pathname.startsWith('/autores');

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
        <BackgroundMusicProvider>
          <AudioProvider>
            <LenisProvider>
              <div className="flex flex-col min-h-screen">
                {!isStudioPage && <Header />}
                <main className="flex-grow">
                  <PageTransition>{children}</PageTransition>
                </main>
                {!isStudioPage && <AppFooter />}
                {/* Reproductor musical flotante - solo en grimorio */}
                {!isStudioPage && isInGrimoire && <FloatingMusicPlayer />}
                {/* Sistema de notificaciones de música */}
                <GlobalMusicNotifications />
              </div>
            </LenisProvider>
          </AudioProvider>
        </BackgroundMusicProvider>
      </body>
    </html>
  );
}
