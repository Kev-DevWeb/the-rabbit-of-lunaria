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
        boxShadow: '0 8px 40px 0 #6366f1',
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const onMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        boxShadow: '0 4px 24px 0 #6366f1',
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
      className="fixed bottom-8 right-8 z-[100] bg-indigo-600 transition-colors text-white font-bold px-6 py-3 rounded-full shadow-2xl text-lg animate-bounce"
      style={{ letterSpacing: 1 }}
    >
      Agenda una cita
    </Link>
  );
};

export default FloatingButton;