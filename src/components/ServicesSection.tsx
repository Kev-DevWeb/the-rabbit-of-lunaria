"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const mantelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    gsap.set(tableRef.current, { autoAlpha: 0, scale: 0.85, y: 50, zIndex: 0 });
    gsap.set(mantelRef.current, { autoAlpha: 0, scale: 0.95, y: 32, zIndex: 1 });
    gsap.set(cardsRef.current, { zIndex: 10 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom', // Cuando la parte superior de la sección toca la parte inferior de la ventana
        end: 'bottom top',   // Cuando la parte inferior de la sección toca la parte superior de la ventana
        toggleActions: 'play reverse play reverse',
        // Ahora sí ejecuta animación tanto al bajar como al subir
      }
    });

    tl.to(tableRef.current, { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.04)
      .to(mantelRef.current, { autoAlpha: 1, scale: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.25);

    if (cardsRef.current) {
      tl.fromTo(
        cardsRef.current.querySelectorAll('.card-1, .card-2, .card-3'),
        { autoAlpha: 0, y: 85, scale: 0.94, rotate: -30 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotate: (i) => [-15, 0, 15][i],
          stagger: 0.22,
          duration: 1.1,
          ease: 'power2.out',
        },
        0.58
      );
    }
    return () => tl.scrollTrigger && tl.scrollTrigger.kill();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen flex flex-col items-center justify-center text-white bg-transparent p-0 m-0">
      <div className="text-center max-w-3xl p-8 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold font-cinzel-decorative service-title">Lecturas de Tarot</h2>
        <p className="text-base md:text-lg mt-4 service-text">
          A través del tarot puedo ayudarte a establecer un canal con tu guardián espiritual.
          Recibe consejos, advertencias y la guía que necesitas para tu camino. También podemos explorar memorias de tu vida pasada para entender mejor tu presente.
        </p>
        <div className="w-full flex justify-center">
          <div className="relative flex items-center justify-center mt-12 w-full" style={{ minHeight: '390px', height: '64vh', maxHeight: 520 }}>
            {/* Mesa de madera (café) */}
            <div
              ref={tableRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
              aria-hidden="true"
              style={{
                width: '85%',
                height: '83%',
                background: 'linear-gradient(180deg,#704e36 70%,#442911 100%)',
                borderRadius: '42px',
                boxShadow: '0 6px 32px #18100188',
                zIndex: 0,
              }}
            >
              {/* Mantel morado, contenido dentro de la mesa */}
              <div
                ref={mantelRef}
                className="w-11/12 h-4/5"
                style={{
                  background: 'linear-gradient(180deg, #a259ff 80%, #511583 100%)',
                  borderRadius: '40px',
                  boxShadow: '0 12px 36px 0 #24001730 inset, 0 8px 16px #bfa7f944 inset',
                  opacity: 0.93,
                  border: '4px solid #ad84f7',
                  zIndex: 1,
                }}
              />
            </div>
            {/* Cartas (por encima de todo) */}
            <div ref={cardsRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 10, width: '100%', height: '100%' }}>
              <div className="absolute card-1">
                <Image src="/cartablanca.jpg" alt="Carta de Tarot 1" width={150} height={250} className="rounded-lg shadow-lg" />
              </div>
              <div className="absolute card-2">
                <Image src="/lunacarta.jpg" alt="Carta de Tarot 2" width={150} height={250} className="rounded-lg shadow-lg" />
              </div>
              <div className="absolute card-3">
                <Image src="/cartamano.jpg" alt="Carta de Tarot 3" width={150} height={250} className="rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        </div>
        <Link href="/citas" className="inline-block mt-10 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-full text-lg font-bold text-white shadow-xl">Agenda una cita</Link>
      </div>
    </section>
  );
};

export default ServicesSection;
