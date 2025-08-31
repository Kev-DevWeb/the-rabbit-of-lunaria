"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const CommunitySection = () => {
  const potion1Ref = useRef(null);
  const potion2Ref = useRef(null);
  const cauldronRef = useRef(null);

  useGSAP(() => {
    if (potion1Ref.current) {
      gsap.to(potion1Ref.current, {
        y: -24,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
    if (cauldronRef.current) {
      gsap.to(cauldronRef.current, {
        y: -16,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.2
      });
    }
    if (potion2Ref.current) {
      gsap.to(potion2Ref.current, {
        y: -22,
        duration: 2.9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.8
      });
    }
  }, []);

  return (
    <section className="relative w-full h-screen flex items-center justify-center text-white bg-black">
      <div className="text-center max-w-4xl p-8 flex flex-col items-center justify-center relative" style={{ height: '100%' }}>
        <h2 className="text-4xl font-bold font-cinzel-decorative community-title">La Madriguera de Lunaria</h2>
        <p className="text-lg mt-4 community-text max-w-2xl mx-auto">
          Únete a nuestra comunidad en Lunaria, la madriguera mágica de la luna. Un espacio seguro y lleno de encanto para brujit@s, personas curiosas y pequeños babywitches que desean iniciar su camino mágico. Aquí podrás compartir experiencias, conocimiento, datos y sugerencias para seguir construyendo juntos un lugar donde la magia crece y todos aprendemos.
        </p>
        <div className="flex items-end justify-center w-full mt-12 gap-8 relative" style={{ minHeight: 160 }}>
          <div ref={potion1Ref} style={{ borderRadius: 24 }}>
            <Image src="/potion1.svg" alt="Poción mágica 1" width={90} height={160} priority className="mb-2 sm:mb-10" style={{ filter: "drop-shadow(0 0 32px #ad84f7b8) drop-shadow(0 0 12px #a259ffa9)" }} />
          </div>
          <div ref={cauldronRef} style={{ borderRadius: 32 }}>
            <Image src="/cauldron.svg" alt="Caldero mágico" width={120} height={110} priority className="mb-2 sm:mb-8" style={{ filter: "drop-shadow(0 0 44px #a259ff77) drop-shadow(0 0 17px #773389a0)" }} />
          </div>
          <div ref={potion2Ref} style={{ borderRadius: 24 }}>
            <Image src="/potion2.svg" alt="Poción mágica 2" width={90} height={160} priority className="mb-2 sm:mb-10" style={{ filter: "drop-shadow(0 0 32px #ad84f7b3) drop-shadow(0 0 12px #b774ff96)" }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
