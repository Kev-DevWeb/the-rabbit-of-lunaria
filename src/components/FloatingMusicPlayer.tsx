'use client';

import { useAudio } from '@/context/AudioProvider';
import { useState, useEffect, useRef } from 'react';

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
    toggleShuffle,
    currentPlaylist
  } = useAudio();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 80 }); // Posición inicial en la izquierda
  const playerRef = useRef<HTMLDivElement>(null);

  // Auto-contraer después de un tiempo sin interacción
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isExpanded && !isDragging) {
      timeoutId = setTimeout(() => {
        setIsExpanded(false);
      }, 5000); // 5 segundos
    }
    return () => clearTimeout(timeoutId);
  }, [isExpanded, isDragging]);

  // Manejo de arrastre (opcional)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isExpanded) return; // No arrastrar cuando está expandido
    
    setIsDragging(true);
    const rect = playerRef.current?.getBoundingClientRect();
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
        ref={playerRef}
        className={`fixed z-50 transition-all duration-300 cursor-pointer select-none ${
          isExpanded ? 'w-80 h-auto' : 'w-16 h-16'
        }`}
        style={{
          left: isExpanded ? '20px' : `${position.x}px`,
          bottom: isExpanded ? '20px' : `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
      >
        {!isExpanded ? (
          /* Esfera compacta */
          <div
            onClick={() => setIsExpanded(true)}
            className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
          >
            {/* Efecto de brillo giratorio */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-spin opacity-50"></div>
            
            {/* Icono de música */}
            <div className="relative z-10 text-white group-hover:scale-110 transition-transform duration-200">
              <MusicNoteIcon />
            </div>

            {/* Indicador de reproducción */}
            {isPlaying && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
        ) : (
          /* Panel expandido */
          <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl text-white overflow-hidden">
            {/* Header con información de la pista */}
            <div className="p-4 border-b border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{currentPlaylist.icon}</span>
                  <span className="text-sm text-gray-400">{currentPlaylist.name}</span>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium truncate">{currentTrack.title}</div>
                <div className="text-xs text-gray-300 truncate">{currentTrack.artist}</div>
              </div>
            </div>

            {/* Controles principales */}
            <div className="p-4">
              <div className="flex items-center justify-center space-x-4 mb-4">
                {/* Botón anterior */}
                <button
                  onClick={prevTrack}
                  className="p-2 hover:text-purple-400 transition-colors"
                  title="Canción anterior"
                >
                  <SkipBackIcon />
                </button>

                {/* Botón play/pausa */}
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  title={isPlaying ? 'Pausar' : 'Reproducir'}
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>

                {/* Botón siguiente */}
                <button
                  onClick={nextTrack}
                  className="p-2 hover:text-purple-400 transition-colors"
                  title="Siguiente canción"
                >
                  <SkipForwardIcon />
                </button>
              </div>

              {/* Controles secundarios */}
              <div className="flex items-center justify-center">
                <button
                  onClick={toggleShuffle}
                  className={`p-2 transition-colors ${
                    isShuffleMode 
                      ? 'text-purple-400 bg-purple-400/20 rounded-lg' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title={`Modo aleatorio: ${isShuffleMode ? 'Activado' : 'Desactivado'}`}
                >
                  <ShuffleIcon />
                </button>
              </div>

              {/* Créditos */}
              <div className="mt-3 pt-3 border-t border-purple-500/20">
                <div className="text-xs text-gray-500 text-center">
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
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
}