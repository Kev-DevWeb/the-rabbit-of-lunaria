'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const isStudioPage = pathname.startsWith('/studio');

  useEffect(() => {
    // No inicializar Lenis en páginas de Sanity Studio
    if (isStudioPage) {
      setLenis(null);
      return;
    }

    const newLenis = new Lenis({
      // Excluir elementos de Sanity del smooth scroll
      prevent: (node: HTMLElement) => {
        // Prevenir Lenis en cualquier elemento dentro del Studio
        return node.closest('[data-sanity]') !== null || 
               node.closest('[data-ui]') !== null ||
               node.closest('[data-testid^="pt-"]') !== null;
      }
    });

    let rafId: number;

    function raf(time: number) {
      newLenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    setLenis(newLenis);

    return () => {
      cancelAnimationFrame(rafId);
      newLenis.destroy();
    };
  }, [isStudioPage]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
};
