"use client";
import { useState, useEffect } from 'react';
import StarrySky from "../components/StarrySky";
import MagicHeroSection from "../components/MagicHeroSection";
import ServicesSection from '../components/ServicesSection';
import CommunitySection from '../components/CommunitySection';
import FloatingButton from "../components/FloatingButton";

export default function Home() {
  const [isCinematicDone, setIsCinematicDone] = useState(false);
  const [showCinematic, setShowCinematic] = useState(false);

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
    // Esta función se pasa a la cinemática, pero la lógica del audio de fondo
    // ahora es manejada por el AudioProvider y el MuteButton. No se necesita código aquí.
  };

  const handleCinematicComplete = () => {
    setIsCinematicDone(true);
    setShowCinematic(false);
    sessionStorage.setItem('starrySkyShown', 'true');
  };

  return (
    <div className='bg-black'>
      {/* Capa de la cinemática inicial - Siempre presente pero oculta/visible */}
      {showCinematic && (
        <div className="fixed top-0 left-0 w-full h-screen z-50 cinematic-intro">
          <StarrySky onComplete={handleCinematicComplete} onEnter={handleStartExperience} />
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
