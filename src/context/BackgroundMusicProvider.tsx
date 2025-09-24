'use client';

import React, { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface BackgroundMusicContextType {
  isMuted: boolean;
  toggleMute: () => void;
  isInGrimoire: boolean;
}

const BackgroundMusicContext = createContext<BackgroundMusicContextType | undefined>(undefined);

export const useBackgroundMusic = () => {
  const context = useContext(BackgroundMusicContext);
  if (!context) {
    throw new Error('useBackgroundMusic debe ser usado dentro de BackgroundMusicProvider');
  }
  return context;
};

interface BackgroundMusicProviderProps {
  children: ReactNode;
}

export const BackgroundMusicProvider: React.FC<BackgroundMusicProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  // Determinar si estamos en el grimorio
  const isInGrimoire = pathname.startsWith('/articulos') || pathname.startsWith('/autores');
  
  // Inicializar audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/musicafondo.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3; // Volumen suave para música de fondo
    }

    const audio = audioRef.current;

    // Solo reproducir si NO estamos en el grimorio
    if (!isInGrimoire && !isMuted) {
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('🎵 Audio requiere interacción del usuario:', error);
        });
      }
    } else {
      audio.pause();
    }

    return () => {
      if (audio && !audio.paused) {
        audio.pause();
      }
    };
  }, [isInGrimoire, isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => {
      const newMutedState = !prev;
      
      if (audioRef.current) {
        if (newMutedState || isInGrimoire) {
          audioRef.current.pause();
        } else if (!isInGrimoire) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.log('🎵 Audio requiere interacción del usuario:', error);
            });
          }
        }
      }
      
      return newMutedState;
    });
  };

  return (
    <BackgroundMusicContext.Provider value={{
      isMuted,
      toggleMute,
      isInGrimoire
    }}>
      {children}
    </BackgroundMusicContext.Provider>
  );
};