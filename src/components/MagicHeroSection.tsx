"use client";
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import RabbitGrimoire from './RabbitGrimoire';

gsap.registerPlugin(ScrollTrigger, SplitText);

// La escena WebGL solo existe en el cliente
const LunarScene = dynamic(() => import('./three/LunarScene'), { ssr: false });

const MagicHeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Luna y conejo descienden colgando, como en el sitio original
      gsap.from('.hero-moon, .hero-rabbit', { autoAlpha: 0, yPercent: -40, duration: 2, ease: 'elastic.out(1, 0.5)', stagger: 0.3 });
      gsap.to('.hero-moon', { y: -14, duration: 4.5, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2 });

      // El titular aparece letra a letra saliendo de la niebla
      const split = SplitText.create('.hero-title', { type: 'chars, words' });
      gsap.from(split.chars, { autoAlpha: 0, y: 20, filter: 'blur(12px)', duration: 1.2, ease: 'power3.out', stagger: 0.03, delay: 0.6 });
      gsap.from('.hero-copy', { autoAlpha: 0, y: 24, duration: 1.2, ease: 'power3.out', stagger: 0.15, delay: 1.4 });

      // Parallax: la luna se queda atrás, el bosque se adelanta
      gsap.to('.hero-moon', { yPercent: 35, ease: 'none', scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero-forest', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: true } });

      return () => split.revert();
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      aria-label="Bienvenida"
      className="relative flex min-h-[100svh] flex-col items-center overflow-hidden bg-night px-4 pb-28 pt-24 text-center"
    >
      <LunarScene className="absolute inset-0" />
      <div aria-hidden="true" className="lun-halo pointer-events-none absolute left-1/2 top-0 h-[720px] w-[720px] max-w-[160vw] -translate-x-1/2 rounded-full" />
      <div aria-hidden="true" className="lun-fog left-[-10%] top-[48%] h-56 w-[70%]" />
      <div aria-hidden="true" className="lun-fog right-[-12%] top-[58%] h-60 w-[75%] [animation-delay:-8s]" />

      <div aria-hidden="true" className="hero-forest pointer-events-none absolute inset-x-0 bottom-0 h-[38vh] min-h-56">
        <Image src="/siluetabosque.png" alt="" fill sizes="100vw" className="object-cover object-bottom opacity-90" />
      </div>
      {/* Funde el bosque con la siguiente sección para que no quede un corte */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-40 bg-gradient-to-b from-transparent to-night" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="hero-moon relative aspect-square w-[min(340px,70vw)] drop-shadow-[0_0_40px_rgba(233,196,106,0.45)]">
          <Image src="/CELL_Luna.png" alt="" fill priority sizes="340px" className="object-contain" />
        </div>
        {/* El conejo cuelga justo debajo de la luna */}
        <div className="hero-rabbit -mt-[min(210px,43vw)]">
          <RabbitGrimoire />
        </div>

        <div className="mt-4 flex max-w-4xl flex-col items-center gap-5">
          <span className="lun-eyebrow hero-copy">Tarot · Luna · Grimorio</span>
          <h1 className="hero-title m-0 font-display text-[clamp(1.9rem,5.5vw,4.25rem)] font-bold leading-[1.1] text-moon-50 [text-shadow:0_0_40px_rgba(123,92,255,0.55)]">
            Encuentra claridad y consejo a través de tu guardián espiritual
          </h1>
          <p className="hero-copy m-0 max-w-2xl text-moon-300">
            El tarot es una guía amorosa que te ayuda a comprenderte y escuchar a tu guardián.
          </p>
          <div className="hero-copy mt-2 flex flex-wrap justify-center gap-4">
            <Link href="/citas" className="lun-btn-gold">Agendar una lectura</Link>
            <Link href="/articulos" className="lun-btn-ghost">Abrir el grimorio</Link>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 font-label text-xs tracking-[0.3em] text-moon-500">
        DESCIENDE
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M8 2v18M2 14l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
};

export default MagicHeroSection;
