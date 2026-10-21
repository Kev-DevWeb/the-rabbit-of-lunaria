'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { readingsData } from '@/lib/readings-data';

gsap.registerPlugin(ScrollTrigger);

const CARD_ART = ['/cartablanca.jpg', '/lunacarta.jpg', '/cartamano.jpg'];
const NUMERALS = ['I', 'II', 'III'];

const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  // Al voltear, el foco del teclado pasa a la cara visible (si no, queda en un botón oculto)
  const faceRefs = useRef<Record<string, HTMLElement | null>>({});
  const pendingFocus = useRef<string | null>(null);

  const flip = (id: string, value: boolean) => {
    pendingFocus.current = `${id}:${value ? 'back' : 'front'}`;
    setFlipped((f) => ({ ...f, [id]: value }));
  };

  useEffect(() => {
    if (!pendingFocus.current) return;
    faceRefs.current[pendingFocus.current]?.focus({ preventScroll: true });
    pendingFocus.current = null;
  }, [flipped]);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
      });
      tl.from('.service-copy', { autoAlpha: 0, y: 40, duration: 0.8, ease: 'power3.out', stagger: 0.15 })
        // Las cartas se abren en abanico desde el centro del mazo
        .from('.service-card', {
          autoAlpha: 0,
          y: 80,
          rotate: (i: number) => [-14, 0, 14][i] ?? 0,
          xPercent: (i: number) => [60, 0, -60][i] ?? 0,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.18,
        }, '-=0.3');
    });
    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="servicios-titulo"
      className="relative flex flex-col items-center gap-6 overflow-hidden px-4 py-32 text-center sm:px-8"
    >
      <span className="lun-eyebrow service-copy">Arcanos</span>
      <h2 id="servicios-titulo" className="service-copy m-0 font-display text-[clamp(2.1rem,4vw,3.25rem)] font-bold text-moon-50">
        Lecturas de Tarot
      </h2>
      <div className="service-copy flex max-w-3xl flex-col gap-3 text-moon-300">
        <p className="m-0">A través del tarot puedo ayudarte a establecer un canal con tu guardián espiritual.</p>
        <p className="m-0">
          Recibe consejos, advertencias y la guía que necesitas para tu camino. También podemos explorar memorias de tu vida pasada para entender mejor tu presente.
        </p>
      </div>
      <p className="service-copy m-0 font-label text-sm tracking-[0.2em] text-lavender">Elige una carta y tócala para revelarla</p>

      <ul className="mt-10 flex list-none flex-wrap justify-center gap-9 p-0 [perspective:1400px]">
        {readingsData.map((reading, i) => {
          const isFlipped = !!flipped[reading.id];
          return (
            <li key={reading.id} className="service-card h-[430px] w-[260px]">
              <div
                className="relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] [transform-style:preserve-3d] motion-reduce:transition-none"
                style={{ transform: isFlipped ? 'rotateY(180deg)' : 'none' }}
              >
                {/* Reverso de la carta */}
                <button
                  type="button"
                  ref={(el) => { faceRefs.current[`${reading.id}:front`] = el; }}
                  aria-label={`Revelar la carta ${NUMERALS[i]}: ${reading.title}`}
                  aria-hidden={isFlipped}
                  tabIndex={isFlipped ? -1 : 0}
                  onClick={() => flip(reading.id, true)}
                  className="absolute inset-0 flex cursor-pointer flex-col overflow-hidden rounded-[18px] border border-gold/55 bg-dusk p-3 transition-shadow duration-300 [backface-visibility:hidden] hover:shadow-[0_18px_60px_rgba(123,92,255,0.35)]"
                >
                  <span className="relative block flex-1 overflow-hidden rounded-xl border border-gold/35">
                    <Image src={CARD_ART[i % CARD_ART.length]} alt="" fill sizes="260px" className="object-cover" />
                    <span className="absolute inset-x-0 top-3 font-label text-xl text-gold [text-shadow:0_0_10px_#07061a]">{NUMERALS[i]}</span>
                    <span className="absolute inset-x-0 bottom-3 font-label text-xs tracking-[0.3em] text-moon-50 [text-shadow:0_0_10px_#07061a]">VOLTEAR</span>
                  </span>
                </button>

                {/* Anverso: la lectura */}
                <div
                  aria-hidden={!isFlipped}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 rounded-[18px] border border-gold/55 bg-dusk-700 px-6 py-8 [backface-visibility:hidden] [transform:rotateY(180deg)]"
                >
                  <span className="font-label text-sm tracking-[0.3em] text-gold">{NUMERALS[i]}</span>
                  <h3 className="m-0 font-display text-2xl leading-tight text-moon-50">{reading.title}</h3>
                  <p className="m-0 text-base leading-snug text-moon-300">{reading.description}</p>
                  <span className="font-label text-lg text-gold">
                    {reading.price} · {reading.duration} min
                  </span>
                  <Link
                    href="/citas"
                    ref={(el) => { faceRefs.current[`${reading.id}:back`] = el; }}
                    tabIndex={isFlipped ? 0 : -1}
                    className="lun-link mt-1 font-label text-sm tracking-[0.2em] text-lavender"
                  >
                    AGENDAR ESTA
                  </Link>
                  <button
                    type="button"
                    tabIndex={isFlipped ? 0 : -1}
                    onClick={() => flip(reading.id, false)}
                    className="min-h-11 font-label text-xs tracking-[0.2em] text-moon-500 hover:text-moon-100"
                  >
                    Volver a tapar
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <Link href="/citas" className="lun-btn-gold service-copy mt-12">Agenda una cita</Link>
    </section>
  );
};

export default ServicesSection;
