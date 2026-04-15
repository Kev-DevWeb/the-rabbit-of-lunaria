"use client";
import { useState, useEffect } from 'react';
import StarrySky from "../components/StarrySky";
import { useBackgroundMusic } from '@/context/BackgroundMusicProvider';
import MagicHeroSection from "../components/MagicHeroSection";
import ServicesSection from '../components/ServicesSection';
import CommunitySection from '../components/CommunitySection';
import FloatingButton from "../components/FloatingButton";

export default function Home() {
  const [isCinematicDone, setIsCinematicDone] = useState(false);
  const [showCinematic, setShowCinematic] = useState(false);
  const { startMusicAfterAnimation } = useBackgroundMusic();

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

  const handleCinematicComplete = () => {
    setIsCinematicDone(true);
    setShowCinematic(false);
    sessionStorage.setItem('starrySkyShown', 'true');
    
    // Iniciar música automáticamente después de la animación
    setTimeout(() => {
      startMusicAfterAnimation();
    }, 1000); // Esperar 1 segundo para que termine la transición
  };

  return (
    <div className='bg-black'>
      {/* Capa de la cinemática inicial - Siempre presente pero oculta/visible */}
      {showCinematic && (
        <div className="fixed top-0 left-0 w-full h-screen z-50 cinematic-intro">
          <StarrySky onComplete={handleCinematicComplete} />
        </div>
      )}

      {/* Contenido principal de la página - Revelado después de la cinemática */}
      <div 
        className={`w-full min-h-screen ${isCinematicDone ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} z-60`}
        style={{ transition: 'opacity 1s ease-in-out' }}
      >
        {isCinematicDone && <MagicHeroSection />}
        {/* El Header y Footer ahora están en layout.tsx */}
        <ServicesSection />
        <CommunitySection />
        <FloatingButton />
      </div>
    </div>
  );
}
