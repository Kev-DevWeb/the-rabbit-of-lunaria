"use client";
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

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

const MagicHeroSection = () => {
  const [init, setInit] = useState(false);
  const particleOptions = {
    background: { color: { value: "#000" } },
    fpsLimit: 60,
    particles: { number: { value: 150 }, color: { value: "#fff" }, opacity: { value: { min: 0.1, max: 0.7 } }, size: { value: { min: 1, max: 2.5 } }, move: { enable: true, speed: 0.2, direction: "none" as const, straight: false } },
  };
  const containerRef = useRef(null);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  useGSAP(() => {
    gsap.set([".hanging-moon", ".hanging-star1", ".hanging-star2"], { autoAlpha: 0, yPercent: -100 });
    gsap.set(".main-text", { autoAlpha: 0 });
    
    gsap.to(".main-text", { autoAlpha: 1, y: 0, duration: 1.5 });
    gsap.to([".hanging-moon", ".hanging-star1", ".hanging-star2"], { autoAlpha: 1, yPercent: 0, duration: 2, ease: 'elastic.out(1, 0.5)', stagger: 0.3 });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen min-h-[600px] overflow-hidden bg-black">
      {/* Solo ocupa el hero, no encima de todo */}
      <div className="absolute inset-0 left-0 top-0 w-full h-full z-0">
        {init && <Particles id="tsparticles-hero" options={particleOptions} />}
      </div>
      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full text-center text-white">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full z-10 main-text">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 px-4" style={{ textShadow: '1px 1px 2px black, 0 0 1em black, 0 0 0.2em black' }}>
              Encuentra claridad y consejo a través de tu guardián espiritual
            </h2>
            <p className="text-lg md:text-xl px-4" style={{ textShadow: '1px 1px 2px black, 0 0 1em black, 0 0 0.2em black' }}>
              El tarot es una guía amorosa que te ayuda a comprenderte y escuchar a tu guardián.
            </p>
          </div>
          <HangingElements />
        </div>
      </div>
    </section>
  );
};

export default MagicHeroSection;
