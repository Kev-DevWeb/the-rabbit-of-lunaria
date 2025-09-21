'use client';
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Cover = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>((props, ref) => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.cover-title', {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.from('.cover-subtitle', {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 0.5,
      ease: 'power3.out',
    });

    gsap.to(container.current, {
      y: '10vh',
      scrollTrigger: {
        trigger: container.current,
        scrub: true,
      },
    });
  }, { scope: container });

  return (
    <div className="page bg-stone-800 text-white shadow-lg flex flex-col items-center justify-center" ref={ref}>
      <div className="w-full h-full flex flex-col items-center justify-center p-4" ref={container}>
        <h1 className="text-4xl font-cinzel-decorative text-yellow-200 cover-title">Grimorio</h1>
        <p className="text-lg font-cormorant-garamond mt-4 cover-subtitle">de Lunaria</p>
        {props.children}
      </div>
    </div>
  );
});

Cover.displayName = 'Cover';

export default Cover;
