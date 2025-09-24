'use client';
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
    gsap.set(mantelRef.current, { autoAlpha: 0, scale: 0.95, y: 32, rotation: -3, zIndex: 1 });
    gsap.set(cardsRef.current, { zIndex: 10 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%', // Inicia la animación cuando el 80% de la sección es visible desde abajo
        toggleActions: 'play none none none', // La animación solo se ejecuta una vez al entrar
      }
    });

    // Animación de entrada para el texto
    tl.from('.service-title', { autoAlpha: 0, y: 40, duration: 0.8, ease: 'power3.out' }, 0)
      .from('.service-text', { autoAlpha: 0, y: 40, duration: 0.8, ease: 'power3.out' }, 0.2);

    // Animación para la mesa, el mantel y las cartas (ligeramente retrasada)
    const sceneStartTime = 0.4;
    tl.to(tableRef.current, { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' }, sceneStartTime)
      .to(mantelRef.current, { autoAlpha: 1, scale: 1, y: 0, rotation: 0, duration: 0.8, ease: 'power2.out' }, sceneStartTime + 0.25);

    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.card-1, .card-2, .card-3');
      tl.fromTo(
        cards,
        { autoAlpha: 0, y: 60, scale: 0.94, rotate: (i) => [-10, 5, -8][i] },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotate: (i) => [-15, 0, 15][i],
          stagger: 0.22,
          duration: 1.1,
          ease: 'power2.out',
        },
        sceneStartTime + 0.58
      );

      const listeners: { card: Element; enter: EventListener; leave: EventListener }[] = [];
      cards.forEach((card) => {
        const onMouseEnter = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const rotateY = gsap.utils.mapRange(0, rect.width, -15, 15, x);
          const rotateX = gsap.utils.mapRange(0, rect.height, 15, -15, y);

          gsap.to(card, {
            y: -15,
            scale: 1.05,
            boxShadow: "0px 20px 40px rgba(0,0,0,0.4)",
            rotationY: rotateY,
            rotationX: rotateX,
            duration: 0.3,
            ease: 'power2.out'
          });
        };
        const onMouseLeave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
            rotationY: 0,
            rotationX: 0,
            duration: 0.3,
            ease: 'power2.in'
          });
        };
        
        const enterListener = onMouseEnter as EventListener;
        const leaveListener = onMouseLeave as EventListener;

        card.addEventListener('mouseenter', enterListener);
        card.addEventListener('mouseleave', leaveListener);

        listeners.push({ card, enter: enterListener, leave: leaveListener });
      });

      return () => {
        listeners.forEach(({ card, enter, leave }) => {
          card.removeEventListener('mouseenter', enter);
          card.removeEventListener('mouseleave', leave);
        });
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
        }
      };
    }
    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen flex flex-col items-center justify-center text-white bg-transparent p-0 m-0 mb-16">
      <div className="text-center max-w-3xl p-8 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold font-cinzel-decorative service-title">Lecturas de Tarot</h2>
        <p className="text-base md:text-lg mt-4 service-text">
          A través del tarot puedo ayudarte a establecer un canal con tu guardián espiritual.
          Recibe consejos, advertencias y la guía que necesitas para tu camino. También podemos explorar memorias de tu vida pasada para entender mejor tu presente.
        </p>
        <div className="w-full flex justify-center">
          <div className="relative flex items-center justify-center mt-12 w-full" style={{ minHeight: '390px', height: '64vh', maxHeight: 520 }}>
            {/* Mesa de madera (imagen) */}
            <div
              ref={tableRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              aria-hidden="true"
              style={{
                width: '85%',
                height: '83%',
                zIndex: 0,
              }}
            >
              <Image
                src="/mesamadera.jpg"
                alt="Mesa de madera"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-[42px] shadow-[0_6px_32px_#18100188]"
                style={{ objectFit: 'cover' }}
              />
            </div>
            {/* Mantel morado, ahora posicionado absolutamente sobre la mesa */}
            <div
              ref={mantelRef}
              className="absolute w-[78%] h-[66%]" // w-11/12 de 85% y h-4/5 de 83%
              style={{
                background: 'linear-gradient(180deg, #a259ff 80%, #511583 100%)',
                borderRadius: '40px',
                boxShadow: '0 12px 36px 0 #24001730 inset, 0 8px 16px #bfa7f944 inset',
                opacity: 0.93,
                border: '4px solid #ad84f7',
                zIndex: 1,
              }}
            />
            {/* Cartas (por encima de todo) */}
            <div ref={cardsRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 10, width: '80%', height: '80%' }}>
              <div className="absolute card-1 service-card" style={{ left: '15%', top: '35%' }}>
                <Image src="/cartablanca.jpg" alt="Carta de Tarot 1" width={120} height={200} className="rounded-lg shadow-lg" style={{ width: '100%', height: 'auto' }} />
              </div>
              <div className="absolute card-2 service-card" style={{ left: '40%', top: '35%' }}>
                <Image src="/lunacarta.jpg" alt="Carta de Tarot 2" width={120} height={200} className="rounded-lg shadow-lg" style={{ width: '100%', height: 'auto' }} />
              </div>
              <div className="absolute card-3 service-card" style={{ left: '65%', top: '35%' }}>
                <Image src="/cartamano.jpg" alt="Carta de Tarot 3" width={120} height={200} className="rounded-lg shadow-lg" style={{ width: '100%', height: 'auto' }} />
              </div>
            </div>
          </div>
        </div>
        <Link href="/citas" className="hidden md:inline-block mt-10 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-full text-lg font-bold text-white shadow-xl">Agenda una cita</Link>
      </div>
    </section>
  );
};

export default ServicesSection;