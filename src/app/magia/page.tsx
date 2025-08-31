"use client";
import Header from "@/components/Header";
import AppFooter from "@/components/AppFooter";
import StarBackground from "@/components/StarBackground";
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

// Constelación única para sobre la magia
const CONSTELACION_MAGIA = [
  { x: 60, y: 120, isBigStar: true },
  { x: 130, y: 50 },
  { x: 220, y: 80, isBigStar: true },
  { x: 260, y: 180 },
  { x: 185, y: 220 },
  { x: 335, y: 100, isBigStar: true },
];

const MagiaPage = () => {
  const magiaRef1 = useRef(null);
  const magiaRef2 = useRef(null);
  const magiaAlertRef = useRef(null);

  useEffect(() => {
    if(magiaRef1.current) {
      gsap.fromTo(magiaRef1.current, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1.1, duration: 1, ease: "elastic.out(1,0.5)" });
    }
    if(magiaRef2.current) {
      gsap.fromTo(magiaRef2.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.5 });
    }
    // Sin animación ni efecto sobre magiaAlertRef
  }, []);

  return (
    <div className="bg-black">
      <StarBackground constellation={CONSTELACION_MAGIA} width={420} height={280} />
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center text-white pt-32">
        <div className="container mx-auto p-0 z-10 relative">
          <div className="bg-black/80 rounded-2xl backdrop-blur-lg p-8 md:p-12 w-full">
          <article className="prose prose-invert prose-xl max-w-2xl mx-auto text-justify">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">¿Que es la magia?</h1>
            <p>
              La magia no es buena ni mala; es simplemente el movimiento de la energia acompanada de una intencion consciente. Asi como en la vida, existen acciones con consecuencias positivas o negativas, en la magia la diferencia esta en el proposito y el respeto.
            </p>
            <p>
              <strong className="text-yellow-200">La magia es karmica:</strong> aquello que envias, ya sea luz o sombra, regresa multiplicado. Por eso, lo mas sabio es procurar usarla siempre para el bien y desde la empatia.
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-2">Magia y espiritualidad</h2>
            <p>
              Practicar magia no te aleja de la divinidad ni de tu fe. En realidad, muchas religiones emplean rituales, altares y oraciones, que son formas de mover energias y enfocar la intencion para atraer milagros o bendiciones.
            </p>
            <p>
              <span className="font-semibold text-purple-200">La diferencia esta en la intencion y en la actitud:</span> si tu corazon se enfoca en lo negativo, atraeras lo negativo; si te abres a lo positivo, tu camino se iluminara. Cualquier acto magico —ya sean limpias, rituales o lecturas— requiere fe y apertura interior para manifestarse.
            </p>
          </article>
          <div className="my-10" />
            
            
            {/* IMPORTANTE (moderno) */}
            <div
              ref={magiaAlertRef}
              className="mt-10 md:mx-auto p-7 rounded-2xl bg-black/80 text-white text-2xl md:text-3xl font-bold text-center shadow-[0_0_32px_8px_rgba(167,139,250,0.5)] ring-2 ring-violet-200/60 backdrop-blur-lg max-w-2xl"
              style={{letterSpacing: '.01em'}}
            >
              <span className="block text-pink-200 text-lg tracking-widest pb-2 font-bold uppercase">Importante</span>
              <span className="block text-white text-xl md:text-2xl font-normal leading-relaxed">
                Si decides practicar magia, protégete siempre y asegúrate de saber lo que haces.<br className="hidden md:block"/>
                De lo contrario, podrías atraer energías o entidades no deseadas que se aprovechen del desconocimiento o falta de protección.<br className="hidden md:block"/>
                <span className="text-violet-200 font-bold">La magia es un arte poderoso, y como todo poder, merece respeto y responsabilidad.</span>
              </span>
            </div>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
};

export default MagiaPage;
