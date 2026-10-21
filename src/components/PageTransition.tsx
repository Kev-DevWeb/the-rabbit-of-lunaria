'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';

// Al cambiar de página un velo de niebla cruza la pantalla y el contenido aparece desde el desenfoque.
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const container = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current || !veil.current) return;
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        veil.current,
        { xPercent: -100, autoAlpha: 1 },
        { xPercent: 100, autoAlpha: 0, duration: 1.1, ease: 'power2.inOut' }
      );
      gsap.fromTo(
        container.current,
        { autoAlpha: 0, filter: 'blur(10px)' },
        // El filtro se limpia al terminar: un filter en el ancestro rompe los position: fixed
        { autoAlpha: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out', clearProps: 'filter' }
      );
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.fromTo(container.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
    });

    return () => mm.revert();
  }, [pathname]);

  return (
    <>
      <div
        ref={veil}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60] invisible bg-[radial-gradient(ellipse_at_center,rgba(143,168,216,0.35),rgba(7,6,26,0.9)_60%,transparent_80%)] blur-xl"
      />
      <div ref={container}>{children}</div>
    </>
  );
};

export default PageTransition;
