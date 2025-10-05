"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { BookOpen, Users, Sparkles, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CommunitySection = () => {
  const potion1Ref = useRef(null);
  const potion2Ref = useRef(null);
  const cauldronRef = useRef(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (potion1Ref.current) {
      gsap.to(potion1Ref.current, {
        y: -24,
        rotation: -5,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
    if (cauldronRef.current) {
      gsap.to(cauldronRef.current, {
        y: -16,
        rotation: 3,
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
        rotation: 5,
        duration: 2.9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.8
      });
    }

    const text = new SplitType('.community-text', { types: 'lines' });

    // Animaciones de entrada con ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        toggleActions: 'play none none none',
      }
    });

    tl.from('.community-title', { autoAlpha: 0, y: 50, duration: 1, ease: 'power3.out' })
      .from(text.lines, { autoAlpha: 0, y: 40, stagger: 0.1, duration: 1, ease: 'power3.out' }, '-=0.8')
      .from([potion1Ref.current, cauldronRef.current, potion2Ref.current], { autoAlpha: 0, scale: 0.5, stagger: 0.2, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.6');

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen flex items-center justify-center text-white bg-black py-16 md:py-24">
      <div className="text-center max-w-6xl px-4 md:px-8 flex flex-col items-center justify-center relative w-full">
        <h2 className="text-4xl md:text-5xl font-bold font-cinzel-decorative community-title mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          La Madriguera de Lunaria
        </h2>
        
        <p className="text-lg md:text-xl mt-4 community-text max-w-3xl mx-auto leading-relaxed">
          Únete a nuestra comunidad en Lunaria, la madriguera mágica de la luna. Un espacio seguro y lleno de encanto para brujit@s, personas curiosas y pequeños babywitches que desean iniciar su camino mágico.
        </p>

        {/* Características de la comunidad */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 w-full max-w-5xl">
          <div className="bg-purple-900/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105">
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-purple-300 mb-3">Comunidad Acogedora</h3>
            <p className="text-base text-gray-300 leading-relaxed">
              Comparte experiencias, conocimiento y sugerencias en un espacio sin juicios donde la magia crece
            </p>
          </div>

          <div className="bg-pink-900/20 backdrop-blur-sm rounded-xl p-6 border border-pink-500/30 hover:border-pink-400/60 transition-all duration-300 hover:scale-105">
            <BookOpen className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-pink-300 mb-3">Contribuye al Grimorio</h3>
            <p className="text-base text-gray-300 leading-relaxed">
              Aporta con tu conocimiento para ayudar a nuevos brujos en su camino espiritual
            </p>
          </div>

          <div className="bg-blue-900/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 hover:scale-105">
            <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-blue-300 mb-3">Aprende y Crece</h3>
            <p className="text-base text-gray-300 leading-relaxed">
              Explora artículos, guías y recursos creados por la comunidad para todos los niveles
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/30 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 shadow-2xl mt-12 max-w-3xl">
          <Mail className="w-10 h-10 text-purple-400 mx-auto mb-4" />
          <p className="text-lg md:text-xl community-text leading-relaxed mb-6">
            ¿Tienes un artículo que compartir o información que buscas?
          </p>
          <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">
            Escríbenos a{' '}
            <a 
              href="mailto:elconejodelunaria@gmail.com" 
              className="text-purple-300 hover:text-purple-200 transition-colors font-semibold underline decoration-purple-500/50 hover:decoration-purple-300"
            >
              elconejodelunaria@gmail.com
            </a>
            {' '}con tu artículo y nombre brujil, o con la información que necesitas. Lo añadiremos al grimorio lo más pronto posible.
          </p>
          <p className="text-base md:text-lg italic text-purple-200 leading-relaxed">
            Disfruta tu estadía en Lunaria y recuerda: <span className="font-bold text-pink-300">sé tú mismo</span>, porque en la magia, la autenticidad es el hechizo más poderoso de todos. ✨
          </p>
        </div>

        {/* Botón llamativo para el Grimorio */}
        <div className="mt-12 mb-8">
          <Link 
            href="/articulos"
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white font-bold text-xl md:text-2xl rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            {/* Efecto de brillo animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            {/* Contenido del botón */}
            <BookOpen className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative z-10">Comenzar a Aprender</span>
            <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
            
            {/* Partículas decorativas */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-300 rounded-full animate-pulse"></div>
          </Link>
        </div>
        
        <div className="flex items-end justify-center w-full mt-16 gap-8 md:gap-12 relative" style={{ minHeight: '180px' }}>
          <div ref={potion1Ref} className="mb-2 sm:mb-10" style={{ borderRadius: 24 }}>
            <Image src="/potion1.svg" alt="Poción mágica 1" width={100} height={170} priority style={{ filter: 'drop-shadow(0 0 32px #ad84f7b8) drop-shadow(0 0 12px #a259ffa9)' }} />
          </div>
          <div ref={cauldronRef} className="mb-2 sm:mb-8" style={{ borderRadius: 32 }}>
            <Image src="/cauldron.svg" alt="Caldero mágico" width={140} height={130} priority style={{ filter: 'drop-shadow(0 0 44px #a259ff77) drop-shadow(0 0 17px #773389a0)' }} />
          </div>
          <div ref={potion2Ref} className="mb-2 sm:mb-10" style={{ borderRadius: 24 }}>
            <Image src="/potion2.svg" alt="Poción mágica 2" width={100} height={170} priority style={{ filter: 'drop-shadow(0 0 32px #ad84f7b3) drop-shadow(0 0 12px #b774ff96)' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
