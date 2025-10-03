"use client";
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const HangingElements = () => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHovering) {
      // Iniciar animación en loop
      animationRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev >= 10 ? 1 : prev + 1));
      }, 100); // Cambiar frame cada 100ms (10 frames por segundo)
    } else {
      // Detener animación y volver al frame 1
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
      setCurrentFrame(1);
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isHovering]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      {/* Composición en capas superpuestas - centrada - MÁS GRANDE */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 hanging-moon">
        <div className="relative w-96 h-96 flex items-center justify-center" style={{ filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.6))' }}>
          
          {/* Capa 1: Luna de fondo - CELL_Luna.png - MÁS GRANDE */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-80 h-80">
              <Image 
                src="/CELL_Luna.png" 
                alt="Luna Llena" 
                fill 
                priority 
                style={{ objectFit: 'contain' }} 
              />
            </div>
          </div>
          
          {/* Capa 2: Conejo grande SOBRE la luna - CELL_Conejo.png - MÁS GRANDE */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Image 
              src="/CELL_Conejo.png" 
              alt="Conejo de Lunaria" 
              width={300} 
              height={300} 
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
          
          {/* Capa 3: Grimorio SOBRE el conejo (frente) - con animación hover - Ligeramente más abajo */}
          <div 
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-auto cursor-pointer"
            style={{ transform: 'translateY(25px)' }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Image 
              src={`/CELL ${currentFrame}_Grimorio.png`}
              alt="Grimorio Mágico" 
              width={220} 
              height={220}
              className="transition-transform duration-200 hover:scale-105"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
      
      {/* Estrellas decorativas - MÁS GRANDES */}
      <div className="absolute top-[40%] left-[20%] -translate-y-1/2 hanging-star1">
        <Image src="/estrella.svg" alt="Estrella" width={80} height={80} />
      </div>
      <div className="absolute top-[35%] right-[20%] -translate-y-1/2 hanging-star2">
        <Image src="/estrella.svg" alt="Estrella" width={60} height={60} />
      </div>
    </div>
  );
};

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
          {/* Texto movido más abajo para no tapar las imágenes */}
          <div className="absolute top-[70%] left-1/2 -translate-x-1/2 w-full z-10 main-text px-4">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 px-4" style={{ textShadow: '2px 2px 4px black, 0 0 1.5em black, 0 0 0.3em black' }}>
              Encuentra claridad y consejo a través de tu guardián espiritual
            </h2>
            <p className="text-xl md:text-2xl lg:text-3xl px-4" style={{ textShadow: '2px 2px 4px black, 0 0 1.5em black, 0 0 0.3em black' }}>
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
