'use client';

import { useAudio } from '@/context/AudioProvider';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

// Iconos SVG
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

const SkipBackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="19 20 9 12 19 4 19 20"></polygon>
    <line x1="5" y1="19" x2="5" y2="5"></line>
  </svg>
);

const SkipForwardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 4 15 12 5 20 5 4"></polygon>
    <line x1="19" y1="5" x2="19" y2="19"></line>
  </svg>
);

const ShuffleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 3 21 8"></polyline>
    <line x1="4" y1="20" x2="21" y2="3"></line>
    <polyline points="21 16 21 21 16 21"></polyline>
    <line x1="15" y1="15" x2="21" y2="21"></line>
    <line x1="4" y1="4" x2="9" y2="9"></line>
  </svg>
);

const MusicNoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
);

export default function FloatingMusicPlayer() {
  const { 
    isPlaying, 
    togglePlay, 
    currentTrack, 
    nextTrack, 
    prevTrack,
    isShuffleMode,
    toggleShuffle
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });

  // Referencias para las animaciones GSAP
  const sphereRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const musicNotesRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);

  // Animaciones GSAP
  useGSAP(() => {
    if (!sphereRef.current || !glowRef.current) return;

    // Animación de entrada
    gsap.fromTo(sphereRef.current, 
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1, ease: "back.out(1.7)" }
    );

    // Animación de brillo constante (como el botón de agendar cita)
    gsap.to(glowRef.current, {
      scale: 1.2,
      opacity: 0.8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Animación de flotación suave
    gsap.to(sphereRef.current, {
      y: "+=10",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    // Rotación sutil cuando está reproduciendo
    if (isPlaying) {
      gsap.to(sphereRef.current, {
        rotation: "+=360",
        duration: 20,
        repeat: -1,
        ease: "none"
      });
    }
  }, [isPlaying]);

  // Animación de notas musicales cuando está reproduciéndose
  useGSAP(() => {
    if (!musicNotesRef.current) return;

    if (isPlaying) {
      // Crear notas musicales flotantes
      const notes = ['♪', '♫', '♩', '♬'];
      
      const animateNotes = () => {
        notes.forEach((note, index) => {
          const noteEl = document.createElement('div');
          noteEl.textContent = note;
          noteEl.className = 'absolute text-purple-400 text-lg font-bold pointer-events-none';
          noteEl.style.left = Math.random() * 60 + 'px';
          noteEl.style.top = Math.random() * 60 + 'px';
          
          if (musicNotesRef.current) {
            musicNotesRef.current.appendChild(noteEl);
            
            gsap.fromTo(noteEl, 
              { scale: 0, opacity: 0, y: 0 },
              { 
                scale: 1, 
                opacity: 1, 
                y: -50,
                duration: 2,
                delay: index * 0.3,
                ease: "power2.out",
                onComplete: () => noteEl.remove()
              }
            );
          }
        });
      };

      const interval = setInterval(animateNotes, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Animación de expansión
  useGSAP(() => {
    if (!expandedRef.current) return;

    if (isExpanded) {
      gsap.fromTo(expandedRef.current,
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [isExpanded]);

  // Efecto al hacer clic en play/pause
  const handlePlayToggle = () => {
    if (sphereRef.current) {
      gsap.to(sphereRef.current, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
    }
    togglePlay();
  };

  // Manejo de arrastre
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isExpanded) return;
    
    setIsDragging(true);
    const rect = sphereRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - offsetX,
        y: e.clientY - offsetY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <>
      {/* Esfera flotante principal */}
      <div
        ref={sphereRef}
        className={`fixed z-50 transition-all duration-300 cursor-pointer select-none ${
          isExpanded ? 'w-80 h-auto' : 'w-16 h-16'
        }`}
        style={{
          left: isExpanded ? '20px' : `${position.x}px`,
          bottom: isExpanded ? '20px' : `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
        onClick={isExpanded ? undefined : () => setIsExpanded(true)}
      >
        {!isExpanded ? (
          /* Esfera compacta con efectos GSAP */
          <div className="relative w-16 h-16">
            {/* Brillo de fondo (como el botón de agendar cita) */}
            <div 
              ref={glowRef}
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-60"
            />
            
            {/* Esfera principal */}
            <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-full shadow-2xl border-2 border-purple-300/30 flex items-center justify-center overflow-hidden">
              {/* Brillo interno */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 rounded-full" />
              
              {/* Icono central */}
              <div className="relative z-10 text-white">
                {isPlaying ? <PauseIcon /> : <MusicNoteIcon />}
              </div>
              
              {/* Ondas de sonido cuando está reproduciéndose */}
              {isPlaying && (
                <div className="absolute inset-0">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute inset-0 border-2 border-white/20 rounded-full animate-ping"
                      style={{ 
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: '2s'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Notas musicales flotantes */}
            <div ref={musicNotesRef} className="absolute inset-0 overflow-visible pointer-events-none" />
          </div>
        ) : (
          /* Panel expandido */
          <div 
            ref={expandedRef}
            className="bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-pink-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-400/30 overflow-hidden"
          >
            {/* Header con información de la pista */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 border-b border-purple-400/20">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-purple-300 font-medium uppercase tracking-wide">
                      {currentTrack.title.includes('Grimorio') || currentTrack.title.includes('Study') ? 'Grimorio' : 'Místico'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium truncate text-white">{currentTrack.title}</div>
                    <div className="text-xs text-purple-200 truncate">{currentTrack.artist}</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-purple-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Controles principales */}
            <div className="p-4">
              <div className="flex items-center justify-center space-x-6 mb-4">
                {/* Botón anterior */}
                <button
                  onClick={prevTrack}
                  className="p-3 hover:text-purple-400 transition-all duration-200 hover:bg-purple-600/20 rounded-full text-purple-200"
                  title="Canción anterior"
                >
                  <SkipBackIcon />
                </button>

                {/* Botón play/pausa con efectos */}
                <button
                  onClick={handlePlayToggle}
                  className="relative w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 group"
                  title={isPlaying ? 'Pausar' : 'Reproducir'}
                >
                  {/* Brillo del botón (como agendar cita) */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="relative z-10 text-white">
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                  </div>
                </button>

                {/* Botón siguiente */}
                <button
                  onClick={nextTrack}
                  className="p-3 hover:text-purple-400 transition-all duration-200 hover:bg-purple-600/20 rounded-full text-purple-200"
                  title="Siguiente canción"
                >
                  <SkipForwardIcon />
                </button>
              </div>

              {/* Controles secundarios */}
              <div className="flex items-center justify-center mb-4">
                <button
                  onClick={toggleShuffle}
                  className={`p-2 transition-all duration-200 rounded-lg ${
                    isShuffleMode 
                      ? 'text-purple-300 bg-gradient-to-r from-purple-600/30 to-pink-600/30 shadow-lg' 
                      : 'text-gray-400 hover:text-purple-300 hover:bg-purple-600/20'
                  }`}
                  title={`Modo aleatorio: ${isShuffleMode ? 'Activado' : 'Desactivado'}`}
                >
                  <ShuffleIcon />
                </button>
              </div>

              {/* Créditos */}
              <div className="pt-3 border-t border-purple-500/20">
                <div className="text-xs text-purple-300 text-center leading-relaxed">
                  {currentTrack.credits}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay para cerrar cuando se hace clic fuera */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
}