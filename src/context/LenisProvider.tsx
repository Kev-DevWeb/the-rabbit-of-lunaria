'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

    // Lenis corre en el ticker de GSAP para que ScrollTrigger y el scroll suave vayan sincronizados
    newLenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => newLenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    setLenis(newLenis);

    return () => {
      gsap.ticker.remove(tick);
      newLenis.destroy();
    };
  }, [isStudioPage]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
};
