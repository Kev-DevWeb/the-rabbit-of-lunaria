"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Cada pilar lleva una runa que se "dibuja" al entrar en pantalla
const PILLARS = [
  {
    title: 'Comunidad Acogedora',
    text: 'Comparte experiencias, conocimiento y sugerencias en un espacio sin juicios donde la magia crece',
    rune: 'M32 14v36M20 24l12 10 12-10',
  },
  {
    title: 'Contribuye al Grimorio',
    text: 'Aporta con tu conocimiento para ayudar a nuevos brujos en su camino espiritual',
    rune: 'M22 16h20v32H22zM32 16v32M26 24h2M36 24h2',
  },
  {
    title: 'Aprende y Crece',
    text: 'Explora artículos, guías y recursos creados por la comunidad para todos los niveles',
    rune: 'M32 12l6 14 14 6-14 6-6 14-6-14-14-6 14-6z',
  },
];

const CommunitySection = () => {
  const potion1Ref = useRef(null);
  const potion2Ref = useRef(null);
  const cauldronRef = useRef(null);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      [potion1Ref, cauldronRef, potion2Ref].forEach((ref, i) => {
        gsap.to(ref.current, {
          y: [-24, -16, -22][i],
          rotation: [-5, 3, 5][i],
          duration: [2.6, 2.4, 2.9][i],
          delay: [0, 1.2, 0.8][i],
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' },
      });

      // autoSplit vuelve a partir las líneas si cambia el ancho o cargan las fuentes
      const split = SplitText.create('.community-intro', {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, { yPercent: 100, duration: 0.9, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: self.lines[0], start: 'top 85%' } }),
      });

      tl.from('.community-title', { autoAlpha: 0, y: 50, duration: 1, ease: 'power3.out' })
        .from('.community-pillar', { autoAlpha: 0, y: 40, duration: 0.8, ease: 'power3.out', stagger: 0.15 }, '-=0.4')
        .from('.community-rune', { strokeDashoffset: 120, duration: 1.4, ease: 'power2.inOut', stagger: 0.15 }, '<')
        .from([potion1Ref.current, cauldronRef.current, potion2Ref.current], { autoAlpha: 0, scale: 0.5, stagger: 0.2, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.6');

      return () => split.revert();
    });
    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="comunidad-titulo"
      className="relative flex flex-col items-center overflow-hidden border-t border-lavender/10 bg-night-800/45 px-4 py-32 text-center md:px-8"
    >
      <div aria-hidden="true" className="lun-fog left-[10%] top-10 h-64 w-[80%] opacity-60" />

      <span className="lun-eyebrow relative">El círculo</span>
      <h2 id="comunidad-titulo" className="community-title relative mb-0 mt-5 font-display text-[clamp(2.1rem,4vw,3.25rem)] font-bold text-moon-50">
        La Madriguera de Lunaria
      </h2>

      {/* w-full: dentro del flex centrado el párrafo se encogía al ancho de una palabra al partirlo en líneas */}
      <p className="community-intro relative mx-auto mt-6 w-full max-w-3xl text-moon-300">
        Únete a nuestra comunidad en Lunaria, la madriguera mágica de la luna. Un espacio seguro y lleno de encanto para brujit@s, personas curiosas y pequeños babywitches que desean iniciar su camino mágico.
      </p>

      <ul className="relative mt-12 grid w-full max-w-5xl list-none grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-7 p-0">
        {PILLARS.map((pillar) => (
          <li key={pillar.title} className="community-pillar lun-card flex flex-col items-center gap-3.5 px-7 py-10 transition-colors duration-300 hover:border-gold/45">
            <svg aria-hidden="true" width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="#e9c46a" strokeWidth="1.3">
              <circle cx="32" cy="32" r="28" strokeDasharray="3 4" />
              <path className="community-rune" d={pillar.rune} strokeDasharray="120" strokeDashoffset="0" />
            </svg>
            <h3 className="m-0 font-label text-xl font-semibold text-moon-50">{pillar.title}</h3>
            <p className="m-0 text-base leading-relaxed text-moon-400">{pillar.text}</p>
          </li>
        ))}
      </ul>

      <div className="relative mt-16 flex max-w-3xl flex-col items-center gap-4 rounded-3xl border border-gold/35 bg-dusk px-[clamp(1.25rem,4vw,3.5rem)] py-12">
        <h3 className="m-0 font-display text-2xl text-moon-50 md:text-3xl">¿Tienes un artículo que compartir o información que buscas?</h3>
        <p className="m-0 text-moon-300">
          Escríbenos con tu artículo y nombre brujil, o con la información que necesitas. Lo añadiremos al grimorio lo más pronto posible.
        </p>
        <a href="mailto:elconejodelunaria@gmail.com" className="lun-btn-ghost border-gold text-gold">
          elconejodelunaria@gmail.com
        </a>
        <p className="m-0 text-base italic text-lavender">
          Disfruta tu estadía en Lunaria y recuerda: <strong className="text-gold">sé tú mismo</strong>, porque en la magia, la autenticidad es el hechizo más poderoso de todos.
        </p>
      </div>

      <Link href="/articulos" className="lun-btn-gold relative mt-12">
        Comenzar a aprender
      </Link>

      <div aria-hidden="true" className="relative mt-16 flex w-full items-end justify-center gap-8 md:gap-12" style={{ minHeight: '180px' }}>
        <div ref={potion1Ref} className="mb-2 sm:mb-10">
          <Image src="/potion1.svg" alt="" width={100} height={170} style={{ filter: 'drop-shadow(0 0 32px #e9c46a66) drop-shadow(0 0 12px #7b5cffa9)', width: 'auto', height: 'auto' }} />
        </div>
        <div ref={cauldronRef} className="mb-2 sm:mb-8">
          <Image src="/cauldron.svg" alt="" width={140} height={130} style={{ filter: 'drop-shadow(0 0 44px #7b5cff77) drop-shadow(0 0 17px #e9c46a55)', width: 'auto', height: 'auto' }} />
        </div>
        <div ref={potion2Ref} className="mb-2 sm:mb-10">
          <Image src="/potion2.svg" alt="" width={100} height={170} style={{ filter: 'drop-shadow(0 0 32px #e9c46a66) drop-shadow(0 0 12px #7b5cff96)', width: 'auto', height: 'auto' }} />
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
