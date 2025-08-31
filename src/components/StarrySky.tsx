"use client";
import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState } from 'react';

// Sub-componentes de la cinemática
const ForestScene = () => (
  <div className="absolute inset-0 w-full h-full">
    <Image src="/cabañanoche.jpg" alt="Cabaña en el bosque" layout="fill" objectFit="cover" className="z-0" />
    <Image src="/siluetabosque.png" alt="Silueta del bosque" layout="fill" objectFit="cover" className="z-10" />
    <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 40%)' }} />
    <div className="absolute top-[60%] left-[65%] w-5 h-5 bg-orange-300 rounded-full z-20 lantern" style={{ boxShadow: '0 0 25px 15px rgba(255, 165, 0, 0.7)' }} />
    <div className="absolute w-1 h-1 bg-yellow-200 rounded-full z-20 firefly1" style={{ top: '70%', left: '30%', boxShadow: '0 0 10px 5px rgba(255, 255, 0, 0.7)' }} />
    <div className="absolute w-1 h-1 bg-yellow-200 rounded-full z-20 firefly2" style={{ top: '80%', left: '60%', boxShadow: '0 0 10px 5px rgba(255, 255, 0, 0.7)' }} />
    <div className="absolute w-1 h-1 bg-yellow-200 rounded-full z-20 firefly3" style={{ top: '75%', left: '45%', boxShadow: '0 0 10px 5px rgba(255, 255, 0, 0.7)' }} />
  </div>
);

const HangingElements = () => (
  <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
    <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 hanging-moon">
      <div className="relative w-48 h-48" style={{ filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))' }}>
        <Image src="/lunallena.svg" alt="Luna Llena" layout="fill" objectFit="contain" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image src="/rabbit.svg" alt="Silueta de conejo" width={80} height={80} />
        </div>
      </div>
    </div>
    <div className="absolute top-[40%] left-[25%] -translate-y-1/2 hanging-star1">
      <Image src="/estrella.svg" alt="Estrella" width={60} height={60} />
    </div>
    <div className="absolute top-[35%] right-[25%] -translate-y-1/2 hanging-star2">
      <Image src="/estrella.svg" alt="Estrella" width={40} height={40} />
    </div>
  </div>
);

const StarrySky = ({ onComplete }) => {
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Timeout de seguridad: llama a onComplete si la animación no termina en X segundos
    timeoutRef.current = setTimeout(() => {
      setShowIntro(false);
      if (typeof onComplete === 'function') onComplete();
    }, 6000); // 6 segundos máximo
    return () => clearTimeout(timeoutRef.current);
  }, [onComplete]);

  useGSAP(() => {
    if (!showIntro) return;
    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(timeoutRef.current);
        setShowIntro(false);
        if (typeof onComplete === 'function') onComplete();
      }
    });
    tl.to('.curtain', { opacity: 0, duration: 1.2, onComplete: () => gsap.set('.curtain', { display: 'none' }) })
      .to('.lantern', { opacity: 0.7, scale: 1.1, duration: 1.0, repeat: -1, yoyo: true, ease: 'power1.inOut' }, "<0.3")
      .to('.firefly1', { x: '+=20', y: '-=15', duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut' }, "<0.3")
      .to('.firefly2', { x: '-=15', y: '+=10', duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut' }, "<0.6")
      .to('.firefly3', { x: '+=10', y: '-=20', duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut' }, "<0.1")
      .to('.forest-scene', { autoAlpha: 0, duration: 0.75, delay: 2 });
  }, { scope: containerRef, dependencies: [showIntro] });

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
      style={{ minHeight: '600px' }}
    >
      {showIntro && (
        <>
          <div className="absolute inset-0 z-50 bg-black curtain" />
          <div className="absolute inset-0 z-20 forest-scene"><ForestScene /></div>
        </>
      )}
    </section>
  );
};

export default StarrySky;