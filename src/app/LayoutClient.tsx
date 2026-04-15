'use client'

import { usePathname } from 'next/navigation'
import { BackgroundMusicProvider } from '@/context/BackgroundMusicProvider'
import Header from '@/components/Header'
import AppFooter from '@/components/AppFooter'
import { GlobalMusicNotifications } from '@/components/GlobalMusicNotifications'
import { LenisProvider } from '@/context/LenisProvider'
import PageTransition from '@/components/PageTransition'

export default function LayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isStudioPage = pathname.startsWith('/studio')

  return (
    <BackgroundMusicProvider>
      <LenisProvider>
        <div className={`flex flex-col min-h-screen ${!isStudioPage ? 'overflow-x-hidden' : ''}`}>
          {!isStudioPage && <Header />}
          <main className={`flex-grow ${!isStudioPage ? 'overflow-x-hidden' : ''}`}>
            <PageTransition>{children}</PageTransition>
          </main>
          {!isStudioPage && <AppFooter />}
          {/* Sistema de notificaciones de música */}
          <GlobalMusicNotifications />
        </div>
      </LenisProvider>
    </BackgroundMusicProvider>
  )
}
