'use client';
import React, { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const FloatingButton = () => {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    const button = buttonRef.current;
    if (!button) return;

    const onMouseEnter = () => {
      gsap.to(button, {
        scale: 1.1,
        boxShadow: '0 0 36px 0 rgba(233, 196, 106, 0.6)',
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const onMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        boxShadow: '0 0 0 0 rgba(233, 196, 106, 0)',
        duration: 0.3,
        ease: 'power2.in'
      });
    };

    button.addEventListener('mouseenter', onMouseEnter);
    button.addEventListener('mouseleave', onMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', onMouseEnter);
      button.removeEventListener('mouseleave', onMouseLeave);
    };
  }, { scope: buttonRef });

  return (
    <Link
      ref={buttonRef}
      href="/citas"
      className="lun-glow-pulse fixed bottom-6 right-6 z-[100] flex min-h-12 items-center rounded-full border border-gold/60 bg-night/85 whitespace-nowrap px-5 font-label text-sm text-gold sm:px-6 sm:text-base backdrop-blur-md transition-colors hover:bg-gold hover:text-night"
      style={{ 
        letterSpacing: 1,
        maxWidth: '200px',
        textAlign: 'center',
        fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', // Tamaño de texto responsive que no crece con zoom
      }}
    >
      Agenda una cita
    </Link>
  );
};

export default FloatingButton;