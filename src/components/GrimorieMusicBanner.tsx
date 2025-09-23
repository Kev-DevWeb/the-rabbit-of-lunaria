'use client';
import { useState, useEffect } from 'react';
import { useAudio } from '@/context/AudioProvider';
import { Volume2, VolumeX, Music, BookOpen, X, Play, Pause } from 'lucide-react';

export default function GrimorieMusicBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { isPlaying, togglePlay, currentTrack } = useAudio();

  // Mostrar el banner después de un breve delay
  useEffect(() => {
    // Verificar si el usuario ya interactuó con el banner en esta sesión
    const hasSeenBanner = sessionStorage.getItem('grimoire-music-banner-seen');
    
    if (!hasSeenBanner) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000); // Mostrar después de 2 segundos

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptMusic = () => {
    togglePlay();
    setHasInteracted(true);
    setIsVisible(false);
    sessionStorage.setItem('grimoire-music-banner-seen', 'true');
  };

  const handleDecline = () => {
    setIsVisible(false);
    sessionStorage.setItem('grimoire-music-banner-seen', 'true');
  };

  // No mostrar si ya interactuó o si no está visible
  if (!isVisible || hasInteracted) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300" />
      
      {/* Banner */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
        <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl border border-purple-400/30 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header con brillo */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 border-b border-purple-400/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Music className="w-6 h-6 text-purple-300" />
                  <div className="absolute inset-0 bg-purple-400 rounded-full blur-sm opacity-50 animate-pulse"></div>
                </div>
                <h3 className="text-lg font-semibold text-white font-cinzel-decorative">
                  Música para Estudiar
                </h3>
              </div>
              <button 
                onClick={handleDecline}
                className="text-purple-300 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-purple-100 leading-relaxed mb-4">
                  ¿Te gustaría acompañar tu lectura con música relajante especialmente seleccionada para estudios místicos?
                </p>
                <div className="bg-purple-800/30 rounded-lg p-3 mb-4 border border-purple-500/20">
                  <p className="text-sm text-purple-200 flex items-center">
                    <Music className="w-4 h-4 mr-2 text-purple-400" />
                    Playlist: <span className="font-medium ml-1">Lo-fi & Jazz para Concentración</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex space-x-3">
              <button
                onClick={handleAcceptMusic}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Sí, reproducir música</span>
              </button>
              <button
                onClick={handleDecline}
                className="px-4 py-3 bg-purple-800/50 hover:bg-purple-700/50 text-purple-200 hover:text-white font-medium rounded-lg transition-all duration-200 border border-purple-600/30"
              >
                No, gracias
              </button>
            </div>

            <p className="text-xs text-purple-300 mt-3 text-center">
              Puedes activar o desactivar la música usando el reproductor flotante 🎵
            </p>
          </div>
        </div>
      </div>
    </>
  );
}