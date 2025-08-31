"use client";
import { useState, useLayoutEffect, useRef } from 'react';
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
  const servicesSectionRef = useRef(null); // Ref for ServicesSection's parent section
  const communitySectionRef = useRef(null); // Ref for CommunitySection's parent section

  useLayoutEffect(() => {
    if (!isCinematicDone) return;

    const ctx = gsap.context(() => {
      // Animaciones para ServicesSection
      gsap.fromTo(servicesSectionRef.current.querySelector('.service-title'), 
        { autoAlpha: 0, y: 50 }, 
        { autoAlpha: 1, y: 0, scrollTrigger: { trigger: servicesSectionRef.current, start: 'top center', end: 'bottom center', toggleActions: 'play none none reverse' } }
      );
      gsap.fromTo(servicesSectionRef.current.querySelector('.service-text'), 
        { autoAlpha: 0, y: 50 }, 
        { autoAlpha: 1, y: 0, delay: 0.3, scrollTrigger: { trigger: servicesSectionRef.current, start: 'top center', end: 'bottom center', toggleActions: 'play none none reverse' } }
      );

      // Animaciones para CommunitySection
      gsap.fromTo(communitySectionRef.current.querySelector('.community-title'), 
        { autoAlpha: 0, y: 50 }, 
        { autoAlpha: 1, y: 0, scrollTrigger: { trigger: communitySectionRef.current, start: 'top center', end: 'bottom center', toggleActions: 'play none none reverse' } }
      );
      gsap.fromTo(communitySectionRef.current.querySelector('.community-text'), 
        { autoAlpha: 0, y: 50 }, 
        { autoAlpha: 1, y: 0, delay: 0.3, scrollTrigger: { trigger: communitySectionRef.current, start: 'top center', end: 'bottom center', toggleActions: 'play none none reverse' } }
      );
      gsap.fromTo(communitySectionRef.current.querySelectorAll('[class*="card-"]'), 
        { autoAlpha: 0, scale: 0.5 }, 
        { autoAlpha: 1, scale: 1, stagger: 0.2, scrollTrigger: { trigger: communitySectionRef.current, start: 'top center', end: 'bottom center', toggleActions: 'play none none reverse' } }
      );

    });
    return () => ctx.revert();
  }, [isCinematicDone]);

  const handleCinematicComplete = () => {
    setIsCinematicDone(true);
    gsap.to('.cinematic-intro', { opacity: 0, duration: 1, pointerEvents: 'none', onComplete: () => {
      gsap.set('.cinematic-intro', { display: 'none' });
    }});
  };

  return (
    <div className='bg-black'>
      {/* Capa de la cinemática inicial - Siempre presente pero oculta/visible */}
      <div className="fixed top-0 left-0 w-full h-screen z-50 cinematic-intro">
        <StarrySky onComplete={handleCinematicComplete} />
      </div>

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
