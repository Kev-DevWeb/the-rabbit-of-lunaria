'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const newLenis = new Lenis();

    function raf(time: number) {
      newLenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    setLenis(newLenis);

    return () => {
      newLenis.destroy();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
};
