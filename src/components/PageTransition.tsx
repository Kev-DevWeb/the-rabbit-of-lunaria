'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (container.current) {
      gsap.fromTo(
        container.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power3.inOut' }
      );
    }
  }, [pathname]);

  return <div ref={container}>{children}</div>;
};

export default PageTransition;
