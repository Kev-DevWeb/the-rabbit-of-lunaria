"use client";
import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StarrySky from "../components/StarrySky";
import MagicHeroSection from "../components/MagicHeroSection";
import ServicesSection from '../components/ServicesSection';
import CommunitySection from '../components/CommunitySection';
import Header from '@/components/Header';
import AppFooter from '@/components/AppFooter';
import FloatingButton from "../components/FloatingButton";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [isCinematicDone, setIsCinematicDone] = useState(false);
  const [showCinematic, setShowCinematic] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const servicesSectionRef = useRef<HTMLDivElement>(null); // Ref for ServicesSection's parent section
  const communitySectionRef = useRef<HTMLDivElement>(null); // Ref for CommunitySection's parent section

  // Controlar si la StarrySky+audio deben mostrarse esta sesion
  useEffect(() => {
    // Usar sessionStorage para evitar repetir intro durante la sesion
    const alreadyShown = sessionStorage.getItem('starrySkyShown');
    if (!alreadyShown) {
      setShowCinematic(true);
    } else {
      setIsCinematicDone(true);
      setShowCinematic(false);
    }
  }, []);

  // El audio solo se dispara por botón del overlay
  const handleStartExperience = () => {
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.muted = false;
        audioRef.current.volume = 1;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log('No se pudo reproducir night.mp3:', error);
          });
        }
      } catch (e) {
        console.log('Error general al intentar reproducir night.mp3:', e);
      }
    }
    setShowOverlay(false);
  };

  useEffect(() => {
    if (isCinematicDone && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isCinematicDone]);

  useLayoutEffect(() => {
    if (!isCinematicDone) return;

    const ctx = gsap.context(() => {
      // Animaciones para ServicesSection
      if (servicesSectionRef.current) {
        const serviceTitle = servicesSectionRef.current.querySelector('.service-title');
        if (serviceTitle) {
          gsap.fromTo(serviceTitle,
            { autoAlpha: 0, y: 50 },
            { autoAlpha: 1, y: 0,
              scrollTrigger: {
                trigger: servicesSectionRef.current,
                start: 'top center',
                end: 'bottom center',
                toggleActions: 'play reverse play reverse',
                scrub: false,
                markers: false,
              }
            }
          );
        }
        const serviceText = servicesSectionRef.current.querySelector('.service-text');
        if (serviceText) {
          gsap.fromTo(serviceText,
            { autoAlpha: 0, y: 50 },
            { autoAlpha: 1, y: 0, delay: 0.3,
              scrollTrigger: {
                trigger: servicesSectionRef.current,
                start: 'top center',
                end: 'bottom center',
                toggleActions: 'play reverse play reverse',
                scrub: false,
                markers: false,
              }
            }
          );
        }
      }
      // Animaciones para CommunitySection
      if (communitySectionRef.current) {
        const communityTitle = communitySectionRef.current.querySelector('.community-title');
        if (communityTitle) {
          gsap.fromTo(communityTitle,
            { autoAlpha: 0, y: 50 },
            { autoAlpha: 1, y: 0, scrollTrigger: { trigger: communitySectionRef.current, start: 'top center', end: 'bottom center', toggleActions: 'play none none reverse' } }
          );
        }
        const communityText = communitySectionRef.current.querySelector('.community-text');
        if (communityText) {
          gsap.fromTo(communityText,
            { autoAlpha: 0, y: 50 },
            { autoAlpha: 1, y: 0, delay: 0.3, scrollTrigger: { trigger: communitySectionRef.current, start: 'top center', end: 'bottom center', toggleActions: 'play none none reverse' } }
          );
        }
        const communityCards = communitySectionRef.current.querySelectorAll('[class*="card-"]');
        if (communityCards && communityCards.length > 0) {
          gsap.fromTo(communityCards,
            { autoAlpha: 0, scale: 0.5 },
            { autoAlpha: 1, scale: 1, stagger: 0.2, scrollTrigger: { trigger: communitySectionRef.current, start: 'top center', end: 'bottom center', toggleActions: 'play none none reverse' } }
          );
        }
      }
    });
    return () => ctx.revert();
  }, [isCinematicDone]);

  const handleCinematicComplete = () => {
    setIsCinematicDone(true);
    setShowCinematic(false);
    sessionStorage.setItem('starrySkyShown', 'true');
    gsap.to('.cinematic-intro', { opacity: 0, duration: 1, pointerEvents: 'none', onComplete: () => {
      gsap.set('.cinematic-intro', { display: 'none' });
    }});
    // Esperar 1s y luego hacer fade out del audio
    setTimeout(() => {
      if (audioRef.current) {
        const fadeDuration = 2000; // ms
        const startVol = audioRef.current.volume;
        const steps = 20;
        let step = 0;
        const fade = setInterval(() => {
          step++;
          if (audioRef.current) {
            audioRef.current.volume = Math.max(startVol * (1 - step / steps), 0);
            if (step >= steps) {
              clearInterval(fade);
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
          } else {
            clearInterval(fade);
          }
        }, fadeDuration / steps);
      }
    }, 1000);
  };

  return (
    <div className='bg-black'>
      {/* Audio sincronizado con la intro StarrySky */}
      <audio
        ref={audioRef}
        src="/night.mp3"
        preload="auto"
        style={{ display: 'none' }}
      />

      {/* Capa de la cinemática inicial - Siempre presente pero oculta/visible */}
      {showCinematic && (
        <div className="fixed top-0 left-0 w-full h-screen z-50 cinematic-intro">
          {/* Overlay interactivo para habilitar sonido */}
          {showOverlay && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
              <button
                onClick={handleStartExperience}
                className="px-10 py-5 rounded-2xl bg-black text-white text-2xl font-extrabold outline outline-2 outline-white hover:scale-105 transition focus:outline-white focus:outline-4"
                autoFocus
              >
                Entrar a Lunaria
              </button>
            </div>
          )}
          {/* StarrySky solo aparece cuando el usuario da click */}
          {!showOverlay && <StarrySky onComplete={handleCinematicComplete} />}
        </div>
      )}

      {/* Contenido principal de la página - Revelado después de la cinemática */}
      <div 
        className={`w-full min-h-screen ${isCinematicDone ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} z-60`}
        style={{ transition: 'opacity 1s ease-in-out' }}
      >
        <Header />
        {isCinematicDone && <MagicHeroSection />}
        <main>
          <section ref={servicesSectionRef} className="min-h-screen flex items-center justify-center bg-black">
            <ServicesSection />
          </section>
          <section ref={communitySectionRef} className="min-h-screen flex items-center justify-center bg-black">
            <CommunitySection />
          </section>
        </main>
        <AppFooter />
        <FloatingButton />
      </div>
    </div>
  );
}
