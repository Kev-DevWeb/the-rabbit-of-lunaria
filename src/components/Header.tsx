'use client';
import { useState, useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useBackgroundMusic } from "@/context/BackgroundMusicProvider";
import { Volume2, VolumeX } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { isMuted, toggleMute, isInGrimoire } = useBackgroundMusic();

  useGSAP(() => {
    const links = gsap.utils.toArray<Element>('.animated-link');
    links.forEach((link: Element) => {
      const onMouseEnter = () => {
        gsap.to(link, { y: -2, color: "#d1d5db", duration: 0.2 });
      };
      const onMouseLeave = () => {
        gsap.to(link, { y: 0, color: "#ffffff", duration: 0.2 });
      };
      link.addEventListener('mouseenter', onMouseEnter);
      link.addEventListener('mouseleave', onMouseLeave);

      // Cleanup
      return () => {
        link.removeEventListener('mouseenter', onMouseEnter);
        link.removeEventListener('mouseleave', onMouseLeave);
      }
    });

    gsap.to(headerRef.current, {
      padding: "1rem 2rem",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      backdropFilter: "blur(10px)",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "+=100",
        scrub: 1,
      },
    });

    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
      const onMouseEnter = () => {
        gsap.to(ctaButton, { rotation: 5, duration: 0.1, ease: 'power2.inOut', repeat: 1, yoyo: true });
      };
      const onMouseLeave = () => {
        gsap.to(ctaButton, { rotation: 0, duration: 0.1, ease: 'power2.inOut' });
      };
      ctaButton.addEventListener('mouseenter', onMouseEnter);
      ctaButton.addEventListener('mouseleave', onMouseLeave);

      // Cleanup
      return () => {
        ctaButton.removeEventListener('mouseenter', onMouseEnter);
        ctaButton.removeEventListener('mouseleave', onMouseLeave);
      }
    }
  }, { scope: headerRef });


  return (
    <header ref={headerRef} className="absolute top-0 left-0 w-full p-4 sm:p-8 text-white z-50">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl sm:text-2xl font-bold hover:text-gray-300 navbar-title animated-link">
          La madriguera de Lunaria
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-6">
            <li><Link href="/sobre-mi" className="animated-link">Sobre mí</Link></li>
            <li><Link href="/articulos" className="animated-link whitespace-nowrap">El grimorio de Lunaria</Link></li>
            <li><Link href="/citas" className="font-semibold px-4 py-2 rounded-full bg-purple-600/50 text-white ring-1 ring-purple-400 hover:bg-purple-600/80 transition-all shadow-[0_0_15px_rgba(168,85,247,0.6)] hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] cta-button">Agendar Cita</Link></li>
          </ul>
          
          {/* Botón de mutear - solo fuera del grimorio */}
          {!isInGrimoire && (
            <button 
              onClick={toggleMute}
              className="p-2 rounded-full bg-purple-600/20 hover:bg-purple-600/40 transition-all duration-300 text-white/80 hover:text-white"
              aria-label={isMuted ? "Activar música" : "Silenciar música"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none" aria-label="Abrir menú">
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4">
          <ul className="flex flex-col items-center space-y-4 bg-black bg-opacity-80 backdrop-blur-sm p-4 rounded-lg">
            <li><Link href="/sobre-mi" className="block py-2 hover:text-gray-300 animated-link" onClick={() => setIsOpen(false)}>Sobre mí</Link></li>
            <li><Link href="/articulos" className="block py-2 hover:text-gray-300 animated-link" onClick={() => setIsOpen(false)}>El grimorio de Lunaria</Link></li>
            <li><Link href="/citas" className="block py-2 px-5 rounded-full bg-purple-600/50 text-white ring-1 ring-purple-400 hover:bg-purple-600/80 transition-all shadow-[0_0_15px_rgba(168,85,247,0.6)]" onClick={() => setIsOpen(false)}>Agendar Cita</Link></li>
            
            {/* Botón de mutear - solo fuera del grimorio */}
            {!isInGrimoire && (
              <li>
                <button 
                  onClick={toggleMute}
                  className="flex items-center space-x-2 py-2 px-4 rounded-full bg-purple-600/20 hover:bg-purple-600/40 transition-all duration-300 text-white/80 hover:text-white"
                  aria-label={isMuted ? "Activar música" : "Silenciar música"}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  <span className="text-sm">{isMuted ? "Música OFF" : "Música ON"}</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;