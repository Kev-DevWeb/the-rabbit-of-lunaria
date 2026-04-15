'use client';

import React, { createContext, useContext, useRef, useState, useEffect, useCallback, ReactNode } from 'react';
import YouTubePlayerService, { YouTubePlayerState } from '@/lib/youtube-player';
import { useMusicNotifications, MusicNotification } from '@/components/MusicNotificationFixed';

interface BackgroundMusicContextType {
  isMuted: boolean;
  toggleMute: () => void;
  currentTrack: string | null;
  isPlaying: boolean;
  nextTrack: () => void;
  previousTrack: () => void;
  youtubeState: YouTubePlayerState | null;
  startMusicAfterAnimation: () => void;
  isProcessing: boolean;
  notifications: MusicNotification[];
  closeNotification: (id: string) => void;
}

const BackgroundMusicContext = createContext<BackgroundMusicContextType | undefined>(undefined);

export const useBackgroundMusic = () => {
  const context = useContext(BackgroundMusicContext);
  if (!context) {
    throw new Error('useBackgroundMusic debe ser usado dentro de BackgroundMusicProvider');
  }
  return context;
};

export const useGlobalMusicNotifications = () => {
  const context = useContext(BackgroundMusicContext);
  if (!context) {
    throw new Error('useGlobalMusicNotifications debe ser usado dentro de BackgroundMusicProvider');
  }
  return {
    notifications: context.notifications,
    closeNotification: context.closeNotification
  };
};

interface BackgroundMusicProviderProps {
  children: ReactNode;
}

export const BackgroundMusicProvider: React.FC<BackgroundMusicProviderProps> = ({ children }) => {
  const youtubePlayerRef = useRef<YouTubePlayerService | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const lastTrackTitleRef = useRef<string | null>(null);
  const isMutedRef = useRef(true); // Ref para acceso sincrónico en callbacks
  const [isMuted, setIsMuted] = useState(true);
  const [youtubeState, setYoutubeState] = useState<YouTubePlayerState | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { notifications, showNotification, closeNotification } = useMusicNotifications();
  const showNotificationRef = useRef(showNotification);
  showNotificationRef.current = showNotification;
  
  const PLAYLIST_ID = 'PL4SJvJ-lWGWX2CFXEi7l92UJk-q91szHJ';

  // Sync ref con state
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Inicializar YouTube Player — UNA SOLA VEZ
  useEffect(() => {
    if (youtubePlayerRef.current) return;

    // Crear container hidden para el player
    if (!playerContainerRef.current) {
      const container = document.createElement('div');
      container.id = 'youtube-player-bg';
      container.style.position = 'fixed';
      container.style.top = '-1000px';
      container.style.left = '-1000px';
      container.style.width = '1px';
      container.style.height = '1px';
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      document.body.appendChild(container);
      playerContainerRef.current = container;
    }

    youtubePlayerRef.current = new YouTubePlayerService(PLAYLIST_ID);
    
    youtubePlayerRef.current.initialize('youtube-player-bg')
      .then(() => {
        // Configurar callback de cambios de estado
        youtubePlayerRef.current?.onStateChange((state) => {
          setYoutubeState(state);
          
          // Sincronizar el estado de React con el del player real
          // Esto es clave: el player es la fuente de verdad
          const playerIsPlaying = state.isPlaying && !state.isMuted;
          setIsMuted(!playerIsPlaying);
          isMutedRef.current = !playerIsPlaying;
          
          // Mostrar notificación cuando cambia la canción
          const lastTrackTitle = lastTrackTitleRef.current;
          
          if (state.currentTrack && 
              state.currentTrack.title !== lastTrackTitle && 
              state.isPlaying && 
              !state.isMuted) {
            
            lastTrackTitleRef.current = state.currentTrack.title;
            
            showNotificationRef.current(
              state.currentTrack.title,
              state.currentTrack.channelTitle,
              state.currentTrack.thumbnail
            );
          }
        });
        
        // Aplicar estado de mute inicial
        youtubePlayerRef.current?.setMuted(true);
      })
      .catch(() => {
        // Error silencioso - el reproductor se intentará inicializar de nuevo al recargar
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sin dependencias — inicializar solo una vez

  const toggleMute = useCallback(async () => {
    if (!youtubePlayerRef.current || isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      // Dejar que el player determine qué hacer basado en su estado REAL
      await youtubePlayerRef.current.togglePlayPauseWithFade();
      
      // Después del fade, sincronizar estado de React con el player real
      const state = youtubePlayerRef.current.getCurrentState();
      const newMuted = !state.isPlaying;
      setIsMuted(newMuted);
      isMutedRef.current = newMuted;
      
      setIsProcessing(false);
    } catch {
      setIsProcessing(false);
      // No revertir — dejar que el onStateChange callback sincronice
    }
  }, [isProcessing]);

  const nextTrack = useCallback(() => {
    youtubePlayerRef.current?.nextTrack();
  }, []);

  const previousTrack = useCallback(() => {
    youtubePlayerRef.current?.previousTrack();
  }, []);

  const startMusicAfterAnimation = useCallback(async () => {
    if (!youtubePlayerRef.current || !isMutedRef.current) return;
    
    try {
      setIsProcessing(true);
      
      await youtubePlayerRef.current.fadeIn(3000);
      
      // Sincronizar estado con player real
      setIsMuted(false);
      isMutedRef.current = false;
      setIsProcessing(false);
    } catch {
      setIsProcessing(false);
    }
  }, []);

  return (
    <BackgroundMusicContext.Provider value={{
      isMuted,
      toggleMute,
      currentTrack: youtubeState?.currentTrack?.title || null,
      isPlaying: youtubeState?.isPlaying || false,
      nextTrack,
      previousTrack,
      youtubeState,
      startMusicAfterAnimation,
      isProcessing,
      notifications,
      closeNotification
    }}>
      {children}
    </BackgroundMusicContext.Provider>
  );
};