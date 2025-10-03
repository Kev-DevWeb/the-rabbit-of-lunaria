'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Music, Heart, Moon, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AppFooter = () => {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(footerRef.current, {
      autoAlpha: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 95%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: footerRef });

  return (
    <footer 
      ref={footerRef} 
      className="relative w-full overflow-hidden bg-gradient-to-b from-gray-900 via-purple-950 to-black border-t border-purple-500/30"
    >
      {/* Estrellas decorativas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-purple-300 rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 2 + 2 + 's',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Sección superior con logo/nombre */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Moon className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              La Madriguera de Lunaria
            </h3>
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-gray-400 text-sm text-center max-w-md">
            Un espacio mágico de guía espiritual y sabiduría ancestral
          </p>
        </div>

        {/* Línea divisoria decorativa */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-6"></div>

        {/* Sección de créditos */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Crédito musical */}
          <div className="bg-purple-900/20 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
            <div className="flex items-start gap-3">
              <Music className="w-5 h-5 text-pink-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-purple-300 font-semibold mb-1 text-sm">Música Ambiente</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Agradecimiento especial a <a 
                    href="https://www.youtube.com/@erinmusicbox" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 underline decoration-purple-500/50 hover:decoration-purple-300 transition-colors font-medium"
                  >
                    erinmusicbox
                  </a> por su hermosa música que acompaña este espacio mágico
                </p>
              </div>
            </div>
          </div>

          {/* Mensaje de amor y luz */}
          <div className="bg-pink-900/20 backdrop-blur-sm rounded-lg p-4 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-pink-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-pink-300 font-semibold mb-1 text-sm">Creado con Amor</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Este espacio fue creado con amor y dedicación para acompañarte en tu camino espiritual
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright y derechos */}
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-2">
            &copy; {new Date().getFullYear()} La Madriguera de Lunaria
          </p>
          <p className="text-gray-500 text-xs">
            Todos los derechos reservados • Hecho con magia y propósito ✨
          </p>
        </div>
      </div>

      {/* Brillo decorativo inferior */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
    </footer>
  );
};

export default AppFooter;
