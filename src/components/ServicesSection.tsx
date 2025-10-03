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
    
    // Configurar estados iniciales
    gsap.set(tableRef.current, { autoAlpha: 0, scale: 0.85, y: 50, zIndex: 0 });
    gsap.set(mantelRef.current, { autoAlpha: 0, scale: 0.95, y: 32, rotation: -3, zIndex: 1 });
    gsap.set(cardsRef.current, { zIndex: 10 });

    const createTimeline = () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      });

      // Animación de entrada para el texto
      tl.from('.service-title', { autoAlpha: 0, y: 40, duration: 0.8, ease: 'power3.out' }, 0)
        .from('.service-text', { autoAlpha: 0, y: 40, duration: 0.8, ease: 'power3.out' }, 0.2);

      // Animación para la mesa, el mantel y las cartas
      const sceneStartTime = 0.4;
      tl.to(tableRef.current, { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' }, sceneStartTime)
        .to(mantelRef.current, { autoAlpha: 1, scale: 1, y: 0, rotation: 0, duration: 0.8, ease: 'power2.out' }, sceneStartTime + 0.25);

      if (cardsRef.current) {
        // Seleccionar todas las cartas (tanto desktop como móvil)
        const cards = cardsRef.current.querySelectorAll('.card-1, .card-2, .card-3');
        
        // Detectar si es móvil
        const isMobile = window.innerWidth < 640; // sm breakpoint
        
        if (isMobile) {
          // Animación para móvil: cartas 1 y 2 desde arriba, carta 3 desde abajo
          tl.fromTo(
            [cards[0], cards[1]], // cartas 1 y 2
            { autoAlpha: 0, y: -40, scale: 0.9, rotate: (i) => [-10, 10][i] },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotate: (i) => [-8, 8][i],
              stagger: 0.15,
              duration: 0.8,
              ease: 'power2.out',
            },
            sceneStartTime + 0.58
          )
          .fromTo(
            cards[2], // carta 3
            { autoAlpha: 0, y: 40, scale: 0.9, rotate: 5 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotate: 0,
              duration: 0.8,
              ease: 'power2.out',
            },
            sceneStartTime + 0.9
          );
        } else {
          // Animación original para desktop
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
        }

        // Efectos de hover para las cartas
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
    };

    return createTimeline();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen flex flex-col items-center justify-center text-white bg-transparent p-0 m-0 mb-16 overflow-x-hidden">
      <div className="text-center max-w-4xl px-4 sm:px-6 md:px-8 py-8 relative z-10 w-full">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-cinzel-decorative service-title break-words mb-6">Lecturas de Tarot</h2>
        <div className="space-y-4 service-text">
          <p className="text-lg md:text-xl lg:text-2xl break-words leading-relaxed mx-auto max-w-3xl">
            A través del tarot puedo ayudarte a establecer un canal con tu guardián espiritual.
          </p>
          <p className="text-lg md:text-xl lg:text-2xl break-words leading-relaxed mx-auto max-w-3xl">
            Recibe consejos, advertencias y la guía que necesitas para tu camino. También podemos explorar memorias de tu vida pasada para entender mejor tu presente.
          </p>
        </div>
        <div className="w-full flex justify-center mb-8">
          <div className="relative flex items-center justify-center mt-12 w-full max-w-4xl mx-auto" style={{ minHeight: '390px', height: '50vh', maxHeight: '420px', aspectRatio: '16/9' }}>
            {/* Mesa de madera (imagen) */}
            <div
              ref={tableRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              aria-hidden="true"
              style={{
                width: 'min(85%, 600px)',
                height: 'min(83%, 400px)',
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
            {/* Mantel morado, centrado sobre la mesa */}
            <div
              ref={mantelRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: 'min(78%, 500px)',
                height: 'min(66%, 320px)',
                background: 'linear-gradient(180deg, #a259ff 80%, #511583 100%)',
                borderRadius: '40px',
                boxShadow: '0 12px 36px 0 #24001730 inset, 0 8px 16px #bfa7f944 inset',
                opacity: 0.93,
                border: '4px solid #ad84f7',
                zIndex: 1,
              }}
            />
            {/* Cartas (por encima de todo) - Layout responsivo */}
            <div ref={cardsRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 10, width: 'min(80%, 480px)', height: 'min(80%, 350px)' }}>
              {/* Desktop layout - 3 cartas horizontales */}
              <div className="hidden sm:block">
                <div className="absolute card-1 service-card" style={{ left: '15%', top: '35%', maxWidth: '120px' }}>
                  <Image src="/cartablanca.jpg" alt="Carta de Tarot 1" width={120} height={200} className="rounded-lg shadow-lg" style={{ width: '100%', height: 'auto' }} />
                </div>
                <div className="absolute card-2 service-card" style={{ left: '40%', top: '35%', maxWidth: '120px' }}>
                  <Image src="/lunacarta.jpg" alt="Carta de Tarot 2" width={120} height={200} className="rounded-lg shadow-lg" style={{ width: '100%', height: 'auto' }} />
                </div>
                <div className="absolute card-3 service-card" style={{ left: '65%', top: '35%', maxWidth: '120px' }}>
                  <Image src="/cartamano.jpg" alt="Carta de Tarot 3" width={120} height={200} className="rounded-lg shadow-lg" style={{ width: '100%', height: 'auto' }} />
                </div>
              </div>
              
              {/* Mobile layout - 2 cartas arriba, 1 carta abajo centrada */}
              <div className="block sm:hidden">
                <div className="absolute card-1 service-card" style={{ left: '20%', top: '20%', width: '25%' }}>
                  <Image src="/cartablanca.jpg" alt="Carta de Tarot 1" width={120} height={200} className="rounded-lg shadow-lg" style={{ width: '100%', height: 'auto' }} />
                </div>
                <div className="absolute card-2 service-card" style={{ left: '55%', top: '20%', width: '25%' }}>
                  <Image src="/lunacarta.jpg" alt="Carta de Tarot 2" width={120} height={200} className="rounded-lg shadow-lg" style={{ width: '100%', height: 'auto' }} />
                </div>
                <div className="absolute card-3 service-card" style={{ left: '37.5%', top: '55%', width: '25%' }}>
                  <Image src="/cartamano.jpg" alt="Carta de Tarot 3" width={120} height={200} className="rounded-lg shadow-lg" style={{ width: '100%', height: 'auto' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Botón fuera del área de la mesa para evitar superposiciones */}
        <div className="relative z-20 mt-8">
          <Link href="/citas" className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-full text-lg font-bold text-white shadow-xl">
            Agenda una cita
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;