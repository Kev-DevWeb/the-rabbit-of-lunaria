'use client';

import { useAudio } from '@/context/AudioProvider';
import { useState, useEffect, useRef } from 'react';

// Iconos SVG

const PrevIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="19 20 9 12 19 4 19 20"></polygon>
    <line x1="5" y1="19" x2="5" y2="5"></line>
  </svg>
);

const NextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 4 15 12 5 20 5 4"></polygon>
    <line x1="19" y1="5" x2="19" y2="19"></line>
  </svg>
);

const MusicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

export default function MusicControl() {
  const { 
    isPlaying, 
    togglePlay, 
    currentTrack, 
    nextTrack, 
    prevTrack, 
    trackList,
    currentTrackIndex,
    currentPlaylist,
    setPlaylist,
    availablePlaylists
  } = useAudio();
  
  const [showTrackInfo, setShowTrackInfo] = useState(false);
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);
  const controlsRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (controlsRef.current && !controlsRef.current.contains(event.target as Node)) {
        setShowTrackInfo(false);
        setShowPlaylistSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={controlsRef} className="flex items-center space-x-2 relative">
      {/* Información de la pista (tooltip) */}
      {showTrackInfo && (
        <div className="absolute bottom-12 right-0 bg-black/90 backdrop-blur-sm text-white p-3 rounded-lg shadow-lg min-w-64 z-50">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{currentPlaylist.icon}</span>
            <div className="text-xs text-gray-400">{currentPlaylist.name}</div>
          </div>
          <div className="text-sm font-medium">{currentTrack.title}</div>
          <div className="text-xs text-gray-300">{currentTrack.artist}</div>
          <div className="text-xs text-gray-400 mt-1">{currentTrack.credits}</div>
          <div className="text-xs text-purple-400 mt-1">
            Pista {currentTrackIndex + 1} de {trackList.length}
          </div>
        </div>
      )}

      {/* Controles de pista (solo si hay múltiples pistas) */}
      {trackList.length > 1 && (
        <>
          <button
            onClick={prevTrack}
            className="p-1 hover:text-purple-400 transition-colors"
            title="Pista anterior"
          >
            <PrevIcon />
          </button>
          
          <button
            onClick={nextTrack}
            className="p-1 hover:text-purple-400 transition-colors"
            title="Siguiente pista"
          >
            <NextIcon />
          </button>
        </>
      )}

      {/* Selector de playlist */}
      <div className="relative">
        <button
          onClick={() => setShowPlaylistSelector(!showPlaylistSelector)}
          className="p-1 hover:text-purple-400 transition-colors text-sm"
          title={`Playlist: ${currentPlaylist.name}`}
        >
          <span>{currentPlaylist.icon}</span>
        </button>
        
        {showPlaylistSelector && (
          <div className="absolute bottom-12 right-0 bg-black/95 backdrop-blur-sm text-white rounded-lg shadow-lg z-50 min-w-48">
            <div className="p-2 border-b border-gray-700">
              <div className="text-xs text-gray-400">Seleccionar Playlist</div>
            </div>
            {availablePlaylists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => {
                  setPlaylist(playlist.id);
                  setShowPlaylistSelector(false);
                }}
                className={`w-full text-left p-3 hover:bg-gray-800 transition-colors flex items-center space-x-2 ${
                  currentPlaylist.id === playlist.id ? 'bg-purple-600/20 text-purple-300' : ''
                }`}
              >
                <span className="text-lg">{playlist.icon}</span>
                <div>
                  <div className="text-sm font-medium">{playlist.name}</div>
                  <div className="text-xs text-gray-400">{playlist.description}</div>
                  <div className="text-xs text-gray-500">{playlist.tracks.length} pistas</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Botón de información de música */}
      <button
        onClick={() => setShowTrackInfo(!showTrackInfo)}
        className="p-1 hover:text-purple-400 transition-colors"
        title="Información de la música"
      >
        <MusicIcon />
      </button>

      {/* Botón de play/pause */}
      <button
        onClick={togglePlay}
        className="p-2 hover:text-purple-400 transition-colors"
        title={isPlaying ? 'Pausar música' : 'Reproducir música'}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
    </div>
  );
}