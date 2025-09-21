"use client";

import StarBackground from "@/components/StarBackground";
import Image from "next/image";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Constelación corregida (inspirada en sobre la magia)
const SOBRE_MI_CONSTELLATION = [
  { x: 60, y: 120, isBigStar: true },
  { x: 130, y: 50 },
  { x: 220, y: 80, isBigStar: true },
  { x: 260, y: 180 },
  { x: 185, y: 220 },
  { x: 335, y: 100, isBigStar: true },
];

const SobreMiPage = () => {
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const starBackgroundRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(textRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    gsap.fromTo(imageRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.5, ease: "elastic.out(1, 0.5)", delay: 0.5 }
    );

    gsap.to(starBackgroundRef.current, {
      y: "-20%",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(textRef.current, {
      y: "-10%",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <div className="bg-black">
      <div ref={starBackgroundRef} className="absolute top-0 left-0 w-full h-full">
        <StarBackground constellation={SOBRE_MI_CONSTELLATION} width={420} height={280} />
      </div>
      <main className="min-h-screen flex flex-col items-center justify-center text-white pt-32">
        <div className="container mx-auto p-8 z-10 relative bg-black/70 rounded-xl shadow-lg backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-center mb-4">Sobre Mí</h1>
          <p ref={textRef} className="mt-4 text-xl max-w-full mx-auto text-center text-shadow">
            “Soy un pequeño brujito que recién comienza en el tarot y encuentra en esta herramienta espiritual una forma de guiar y aconsejar con cariño. Creé este sitio para seguir aprendiendo de quienes tienen más experiencia y, al mismo tiempo, para acompañar a quienes inician su propio camino mágico, enfrentando las mismas dudas que yo tuve cuando la información parecía escasa.
Lunaria nace como un espacio seguro, sin prejuicios ni juicios, donde podamos apoyarnos y compartir la magia con libertad. Espero que este rincón lunar nos permita crecer juntos, recorrer el sendero del autoconocimiento y descubrir la belleza de ayudarnos mutuamente.”
          </p>
          <Image
            ref={imageRef}
            src="/conejos.svg"
            alt="Conejos"
            width={192}
            height={192}
            className="mt-8 mx-auto w-48 h-48 filter invert"
          />
        </div>
      </main>
    </div>
  );
};

export default SobreMiPage;
