'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// Sub-componentes de la cinemática
const ForestScene = () => (
  <div className="absolute inset-0 w-full h-full">
    <Image src="/cabañanoche.jpg" alt="Cabaña en el bosque" fill sizes="100vw" style={{ objectFit: 'cover' }} className="z-0" priority />
    <Image src="/siluetabosque.png" alt="Silueta del bosque" fill sizes="100vw" style={{ objectFit: 'cover' }} className="z-10" priority />
    <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 40%)' }} />
    <div className="absolute top-[57%] left-[60%] w-3 h-3 bg-orange-300 rounded-full z-20 lantern" style={{ boxShadow: '0 0 25px 15px rgba(255, 165, 0, 0.7)' }} />
    <div className="absolute w-1 h-1 bg-yellow-200 rounded-full z-20 firefly1" style={{ top: '70%', left: '30%', boxShadow: '0 0 10px 5px rgba(255, 255, 0, 0.7)' }} />
    <div className="absolute w-1 h-1 bg-yellow-200 rounded-full z-20 firefly2" style={{ top: '80%', left: '60%', boxShadow: '0 0 10px 5px rgba(255, 255, 0, 0.7)' }} />
    <div className="absolute w-1 h-1 bg-yellow-200 rounded-full z-20 firefly3" style={{ top: '75%', left: '45%', boxShadow: '0 0 10px 5px rgba(255, 255, 0, 0.7)' }} />
  </div>
);

type StarrySkyProps = {
  onComplete?: () => void;
  onEnter?: () => void;
};

const StarrySky = ({ onComplete }: StarrySkyProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [isOpening, setIsOpening] = useState(false);

  useGSAP(() => {
    if (!showIntro || !containerRef.current) return;

    if (!isOpening) {
      gsap.set('.door-frame', { autoAlpha: 0, scale: 0.95 });
      // Aseguramos que el botón exista antes de animarlo
      if (containerRef.current?.querySelector('.entry-button')) {
        gsap.set('.entry-button', { autoAlpha: 0 });
      }
    }

    const tlOpen = gsap.timeline({
      paused: true,
      onStart: () => {
        if (audioRef.current) {
          audioRef.current.volume = 0.5; // Volumen moderado
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log("Audio de noche reproduciéndose correctamente");
            }).catch(error => {
              console.warn("Audio play failed - esto es normal si no hay interacción del usuario:", error);
            });
          }
        }
      },
      onComplete: () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setShowIntro(false);
        if (typeof onComplete === 'function') onComplete();
      }
    });

    tlOpen // El botón se elimina del DOM a través del estado de React, por lo que no es necesario animar su desaparición.
      .to('.door-left', { rotationY: -110, xPercent: -100, duration: 1.5, ease: 'power2.inOut' }, 'open')
      .to('.door-right', { rotationY: 110, xPercent: 100, duration: 1.5, ease: 'power2.inOut' }, 'open')
      .to('.door-frame', {
        boxShadow: '0 0 60px 20px #a259ff, inset 0 0 40px 10px #511583',
        duration: 1.5,
        ease: 'power2.inOut'
      }, 'open')
      .to('.forest-scene-portal', { scale: 1.5, duration: 2.5, ease: 'power2.in' }, 'open+=0.5')
      .to(containerRef.current, { autoAlpha: 0, duration: 1 }, '-=1');

    const tlIntro = gsap.timeline({
      paused: isOpening,
    });

    tlIntro
      .to('.door-frame', { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power3.out' })
      .to('.door-left', { rotationY: -15, xPercent: -15, duration: 1.5, ease: 'power2.inOut' }, 'ajar')
      .to('.door-right', { rotationY: 15, xPercent: 15, duration: 1.5, ease: 'power2.inOut' }, 'ajar')
      .fromTo('.door-frame', 
        { boxShadow: '0 0 0px 0px #a259ff' }, 
        {
          boxShadow: '0 0 25px 8px #a259ff, inset 0 0 15px 5px #511583',
          duration: 1.5,
          ease: 'power2.inOut'
        }, 
        'ajar'
      )
      .to('.entry-button', { autoAlpha: 1, duration: 1, ease: 'power2.out' }, '>-0.5');

    const tlFireflies = gsap.timeline({ repeat: -1, paused: isOpening, delay: 2.5 });
    tlFireflies
      .to('.lantern', { opacity: 0.7, scale: 1.1, duration: 1.5, yoyo: true, ease: 'power1.inOut' })
      .to('.firefly1', { x: '+=20', y: '-=15', duration: 2.2, yoyo: true, ease: 'sine.inOut' }, "<")
      .to('.firefly2', { x: '-=15', y: '+=10', duration: 1.8, yoyo: true, ease: 'sine.inOut' }, "<")
      .to('.firefly3', { x: '+=10', y: '-=20', duration: 2.5, yoyo: true, ease: 'sine.inOut' }, "<");

    if (isOpening) {
      tlIntro.kill();
      tlFireflies.kill();
      tlOpen.play();
    }

    return () => {
      tlIntro.kill();
      tlFireflies.kill();
      tlOpen.kill();
      if (containerRef.current) gsap.killTweensOf(containerRef.current.querySelectorAll('*'));
    };
  }, { scope: containerRef, dependencies: [showIntro, isOpening] });

  const handleEnter = () => {
    // Reproducir audio al hacer clic (después de interacción del usuario)
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log("Audio de noche iniciado por interacción del usuario");
        }).catch(error => {
          console.error("Error al reproducir audio:", error);
        });
      }
    }
    setIsOpening(true);
  };

  if (!showIntro) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center"
      style={{ minHeight: '600px', perspective: '1000px' }}
    >
      <audio ref={audioRef} src="/night.mp3" preload="auto" />
      <div className="relative z-20 w-[300px] h-[500px] md:w-[350px] md:h-[600px] door-frame mx-auto">
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          <div className="absolute inset-0 z-10 forest-scene-portal">
            <ForestScene />
          </div>
          <div
            className="absolute top-0 left-0 w-1/2 h-full border-r-2 border-black door-left z-20"
            style={{ transformOrigin: 'left center', backfaceVisibility: 'hidden', background: 'linear-gradient(to right, #3a2d21, #5c4736)' }}
          >
            <div className="absolute inset-2 border-2 border-black/30 rounded-lg"></div>
          </div>
          <div
            className="absolute top-0 right-0 w-1/2 h-full border-l-2 border-black door-right z-20"
            style={{ transformOrigin: 'right center', backfaceVisibility: 'hidden', background: 'linear-gradient(to left, #3a2d21, #5c4736)' }}
          >
            <div className="absolute inset-2 border-2 border-black/30 rounded-lg"></div>
          </div>
        </div>
      </div>

      {!isOpening && (
        <button
          onClick={handleEnter}
          className="absolute z-30 bottom-[20%] left-1/2 -translate-x-1/2 entry-button text-white font-cinzel-decorative text-xl tracking-widest px-6 py-3 rounded-lg border-2 border-purple-300/50 bg-black/50 backdrop-blur-sm hover:bg-purple-900/50 hover:border-purple-300 transition-all duration-300"
          style={{ textShadow: '0 0 10px #a259ff' }}
        >
          Entrar a Lunaria
        </button>
      )}
    </section>
  );
};

export default StarrySky;
