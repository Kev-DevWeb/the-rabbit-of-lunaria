"use client";

import StarBackground from "@/components/StarBackground";
import Image from "next/image";
import Link from "next/link";

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { Sparkles, Heart, Moon, Star, BookOpen, Gem } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

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
  const starBackgroundRef = useRef(null);
  const titleRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const rabbitRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement[]>([]);
  const typewriterRef = useRef(null);
  
  const [isHoveringRabbit, setIsHoveringRabbit] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline();

    // Animación de entrada secuencial
    tl.fromTo(titleRef.current,
      { opacity: 0, y: -50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" }
    )
    .fromTo(typewriterRef.current,
      { opacity: 0 },
      { 
        opacity: 1, 
        duration: 0.5,
        onComplete: () => {
          gsap.to(typewriterRef.current, {
            text: "Tarotista • 21 Arcanos Mayores • Comunicación Espiritual • Protecciones Básicas",
            duration: 3,
            ease: "none",
          });
        }
      }, "-=0.5"
    )
    .fromTo(textRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.5"
    )
    .fromTo(cardsContainerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.3"
    );

    // Animación del conejo con efectos interactivos
    gsap.fromTo(rabbitRef.current,
      { opacity: 0, scale: 0.5, rotation: -10 },
      { 
        opacity: 1, 
        scale: 1, 
        rotation: 0, 
        duration: 1.5, 
        ease: "elastic.out(1, 0.8)", 
        delay: 0.8,
        onComplete: () => {
          // Animación de respiración continua
          gsap.to(rabbitRef.current, {
            scale: 1.05,
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
          });
        }
      }
    );

    // Elementos flotantes animados
    floatingElementsRef.current.forEach((el, index) => {
      if (el) {
        gsap.set(el, {
          y: Math.random() * 100 - 50,
          x: Math.random() * 100 - 50,
          rotation: Math.random() * 360,
          scale: 0.8 + Math.random() * 0.4
        });
        
        gsap.to(el, {
          y: "+=20",
          x: "+=10",
          rotation: "+=180",
          duration: 3 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.2
        });
      }
    });

    // Parallax mejorado
    gsap.to(starBackgroundRef.current, {
      y: "-20%",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    gsap.to([textRef.current, cardsContainerRef.current], {
      y: "-5%",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom top",
        scrub: 2,
      },
    });
  }, []);

  const handleRabbitHover = () => {
    setIsHoveringRabbit(true);
    gsap.to(rabbitRef.current, {
      scale: 1.2,
      rotation: 10,
      duration: 0.3,
      ease: "back.out(1.7)"
    });
    
    // Crear partículas mágicas
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-2 h-2 bg-purple-400 rounded-full opacity-80';
      particle.style.left = '50%';
      particle.style.top = '50%';
      rabbitRef.current?.appendChild(particle);
      
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => particle.remove()
      });
    }
  };

  const handleRabbitLeave = () => {
    setIsHoveringRabbit(false);
    gsap.to(rabbitRef.current, {
      scale: 1.05,
      rotation: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)"
    });
  };

  return (
    <div className="bg-black relative overflow-hidden">
      {/* Elementos flotantes mágicos */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            ref={el => {
              if (el) floatingElementsRef.current[i] = el;
            }}
            className="absolute opacity-30"
            style={{
              left: `${10 + i * 10}%`,
              top: `${15 + (i % 3) * 25}%`,
            }}
          >
            {i % 4 === 0 && <Sparkles className="w-4 h-4 text-purple-400" />}
            {i % 4 === 1 && <Star className="w-3 h-3 text-yellow-300" />}
            {i % 4 === 2 && <Moon className="w-5 h-5 text-blue-300" />}
            {i % 4 === 3 && <Gem className="w-4 h-4 text-pink-300" />}
          </div>
        ))}
      </div>

      <div ref={starBackgroundRef} className="absolute top-0 left-0 w-full h-full">
        <StarBackground constellation={SOBRE_MI_CONSTELLATION} width={420} height={280} />
      </div>
      
      <main className="min-h-screen flex flex-col items-center justify-center text-white pt-20 pb-10 px-4">
        <div className="container max-w-4xl mx-auto z-10 relative">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 
              ref={titleRef}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 font-cinzel-decorative bg-gradient-to-r from-purple-400 via-pink-300 to-blue-300 bg-clip-text text-transparent"
            >
              Arledge Brer
            </h1>
            <p 
              ref={typewriterRef}
              className="text-xl sm:text-2xl text-purple-300 font-light tracking-wide mb-8"
            >
              {/* El texto se escribirá con GSAP TextPlugin */}
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Content */}
            <div ref={textRef} className="space-y-6">
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 shadow-2xl">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-purple-300 flex items-center gap-3">
                  <Heart className="w-8 h-8 text-pink-400" />
                  Bienvenido a Mi Rincón Lunar
                </h2>
                <p className="text-gray-200 leading-relaxed mb-4 text-base sm:text-lg">
                  ¡Hola, hermoso ser! Soy Arledge Brer, y me emociona tenerte aquí en este espacio sagrado. 
                  Soy un tarotista que trabaja específicamente con los 21 Arcanos Mayores, encontrando en estas cartas 
                  una herramienta poderosa de sabiduría ancestral para conectar corazones y acompañar almas.
                </p>
                <p className="text-gray-200 leading-relaxed mb-4 text-base sm:text-lg">
                  Además del tarot, canalizo la comunicación con entidades espirituales y ofrezco protecciones energéticas básicas. 
                  Creé <span className="text-purple-300 font-semibold">La Madriguera de Lunaria</span> como 
                  el refugio que a mí me hubiera gustado encontrar cuando inicié este camino: un lugar sin juicios, 
                  lleno de comprensión y donde cada pregunta espiritual es bienvenida.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/20 shadow-2xl">
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-300 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  Mi Misión
                </h3>
                <p className="text-gray-200 leading-relaxed text-base sm:text-lg">
                  Mi propósito es acompañarte en tu viaje espiritual a través de la sabiduría de los Arcanos Mayores, 
                  facilitando la comunicación con tus guías espirituales y ofreciéndote herramientas de protección energética. 
                  Aquí encontrarás claridad, orientación y un espacio seguro para explorar tu camino espiritual.
                </p>
              </div>
            </div>

            {/* Interactive Rabbit */}
            <div className="flex flex-col items-center">
              <div 
                ref={rabbitRef}
                className="relative cursor-pointer group mb-8"
                onMouseEnter={handleRabbitHover}
                onMouseLeave={handleRabbitLeave}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-xl scale-150 group-hover:scale-175 transition-transform duration-300"></div>
                <Image
                  src="/conejos.svg"
                  alt="Conejos Mágicos"
                  width={240}
                  height={240}
                  className="relative z-10 w-60 h-60 filter invert drop-shadow-2xl"
                />
                {isHoveringRabbit && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-800/90 text-white px-3 py-1 rounded-full text-sm whitespace-nowrap">
                    ¡Haz clic para una sorpresa! ✨
                  </div>
                )}
              </div>

              <p className="text-center text-purple-200 italic text-lg mb-8">
                &ldquo;La magia sucede cuando el corazón se abre al misterio&rdquo;
              </p>
            </div>
          </div>

          {/* Servicios Espirituales */}
          <div ref={cardsContainerRef} className="mt-16">
            <h3 className="text-3xl font-bold text-center mb-10 text-purple-300 flex items-center justify-center gap-3">
              <Moon className="w-8 h-8 text-yellow-400" />
              Mis Servicios Espirituales
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Tarot - Arcanos Mayores */}
              <div className="bg-gradient-to-br from-purple-800/40 to-indigo-800/30 backdrop-blur-lg rounded-xl p-6 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105">
                <Star className="w-12 h-12 text-purple-300 mb-4" />
                <h4 className="text-xl font-semibold text-purple-200 mb-3">Tarot - Arcanos Mayores</h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Lecturas con 21 Arcanos Mayores</li>
                  <li>• Interpretación Simbólica Profunda</li>
                  <li>• Guía para Decisiones Importantes</li>
                  <li>• Conexión con tu Propósito</li>
                </ul>
              </div>

              {/* Comunicación con Entidades */}
              <div className="bg-gradient-to-br from-blue-800/40 to-cyan-800/30 backdrop-blur-lg rounded-xl p-6 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 hover:scale-105">
                <Sparkles className="w-12 h-12 text-blue-300 mb-4" />
                <h4 className="text-xl font-semibold text-blue-200 mb-3">Comunicación Espiritual</h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Canalización de Mensajes</li>
                  <li>• Contacto con Guías Espirituales</li>
                  <li>• Interpretación de Señales</li>
                  <li>• Mediación Energética Segura</li>
                </ul>
              </div>

              {/* Protecciones Básicas */}
              <div className="bg-gradient-to-br from-green-800/40 to-emerald-800/30 backdrop-blur-lg rounded-xl p-6 border border-green-400/30 hover:border-green-400/60 transition-all duration-300 hover:scale-105">
                <Gem className="w-12 h-12 text-green-300 mb-4" />
                <h4 className="text-xl font-semibold text-green-200 mb-3">Protecciones Energéticas</h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Limpieza Energética Básica</li>
                  <li>• Escudos de Protección</li>
                  <li>• Consejos de Autocuidado Espiritual</li>
                  <li>• Rituales de Purificación</li>
                </ul>
              </div>

              {/* Guía Espiritual */}
              <div className="bg-gradient-to-br from-pink-800/40 to-rose-800/30 backdrop-blur-lg rounded-xl p-6 border border-pink-400/30 hover:border-pink-400/60 transition-all duration-300 hover:scale-105">
                <Heart className="w-12 h-12 text-pink-300 mb-4" />
                <h4 className="text-xl font-semibold text-pink-200 mb-3">Guía & Acompañamiento</h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Orientación en Momentos Difíciles</li>
                  <li>• Desarrollo de Intuición</li>
                  <li>• Apoyo en Despertar Espiritual</li>
                  <li>• Espacio Seguro sin Juicios</li>
                </ul>
              </div>

              {/* Metodología */}
              <div className="bg-gradient-to-br from-yellow-800/40 to-orange-800/30 backdrop-blur-lg rounded-xl p-6 border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 hover:scale-105">
                <Moon className="w-12 h-12 text-yellow-300 mb-4" />
                <h4 className="text-xl font-semibold text-yellow-200 mb-3">Mi Enfoque</h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Lecturas Intuitivas Personalizadas</li>
                  <li>• Ambiente Relajado y Acogedor</li>
                  <li>• Respeto por tu Proceso</li>
                  <li>• Confidencialidad Absoluta</li>
                </ul>
              </div>

              {/* Experiencia */}
              <div className="bg-gradient-to-br from-violet-800/40 to-purple-800/30 backdrop-blur-lg rounded-xl p-6 border border-violet-400/30 hover:border-violet-400/60 transition-all duration-300 hover:scale-105">
                <BookOpen className="w-12 h-12 text-violet-300 mb-4" />
                <h4 className="text-xl font-semibold text-violet-200 mb-3">Mi Aprendizaje</h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Estudio Continuo del Tarot</li>
                  <li>• Práctica Diaria de Meditación</li>
                  <li>• Conexión con la Naturaleza</li>
                  <li>• Crecimiento Espiritual Constante</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-400/30">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-purple-200">
                ¿Listo para tu Viaje de Autodescubrimiento?
              </h3>
              <p className="text-gray-300 mb-8 text-base sm:text-lg max-w-2xl mx-auto">
                Te invito a explorar mis artículos en el grimorio o, si tu corazón lo siente, 
                a que conectemos en una sesión de tarot personalizada donde juntos iluminaremos tu sendero.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/articulos" 
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3"
                >
                  <BookOpen className="w-5 h-5" />
                  Explorar el Grimorio
                  <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                </Link>
                <Link 
                  href="/citas" 
                  className="group px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3"
                >
                  <Heart className="w-5 h-5" />
                  Agendar Lectura
                  <Moon className="w-4 h-4 group-hover:animate-bounce" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SobreMiPage;
