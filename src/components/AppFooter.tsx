'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AppFooter = () => {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(footerRef.current, {
      autoAlpha: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 95%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="w-full p-4 text-center text-white bg-gray-800 z-10">
      <p className="mb-2">&copy; {new Date().getFullYear()} La madriguera de Lunaria. Todos los derechos reservados.</p>
      <p className="text-xs text-gray-400">
        Música: &quot;The First Fallen Leaf&quot; by Thomas J. Curran.
      </p>
    </footer>
  );
};

export default AppFooter;
