'use client';

import React, { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import YouTubePlayerService, { YouTubePlayerState } from '@/lib/youtube-player';
import { useMusicNotifications, MusicNotification } from '@/components/MusicNotificationFixed';

interface BackgroundMusicContextType {
  isMuted: boolean;
  toggleMute: () => void;
  isInGrimoire: boolean;
  // Nuevos estados para YouTube
  currentTrack: string | null;
  isPlaying: boolean;
  nextTrack: () => void;
  previousTrack: () => void;
  youtubeState: YouTubePlayerState | null;
  // Función para iniciar después de animación
  startMusicAfterAnimation: () => void;
  // Estado para feedback inmediato
  isProcessing: boolean;
  // Sistema de notificaciones
  notifications: MusicNotification[];
  closeNotification: (id: string) => void;
  // Comunicación entre reproductores
  pauseFromExternalPlayer: () => void;
  resumeFromExternalPlayer: () => void;
}

const BackgroundMusicContext = createContext<BackgroundMusicContextType | undefined>(undefined);

export const useBackgroundMusic = () => {
  const context = useContext(BackgroundMusicContext);
  if (!context) {
    throw new Error('useBackgroundMusic debe ser usado dentro de BackgroundMusicProvider');
  }
  return context;
};

// Hook específico para notificaciones que usa el contexto
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
  const pathname = usePathname();
  const youtubePlayerRef = useRef<YouTubePlayerService | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const lastTrackTitleRef = useRef<string | null>(null); // Usar ref en lugar de state
  const [isMuted, setIsMuted] = useState(true); // Empezar muteado por políticas de autoplay
  const [youtubeState, setYoutubeState] = useState<YouTubePlayerState | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Sistema de notificaciones - usar el archivo arreglado
  const { notifications, showNotification, closeNotification } = useMusicNotifications();
  
  // Determinar si estamos en el grimorio
  const isInGrimoire = pathname.startsWith('/articulos') || pathname.startsWith('/autores');
  
  // ID de la playlist de YouTube (extraído de la URL)
  const PLAYLIST_ID = 'PL4SJvJ-lWGWX2CFXEi7l92UJk-q91szHJ';

  // Inicializar YouTube Player
  useEffect(() => {
    if (!youtubePlayerRef.current) {
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

      // Inicializar YouTube Player Service
      youtubePlayerRef.current = new YouTubePlayerService(PLAYLIST_ID);
      
      youtubePlayerRef.current.initialize('youtube-player-bg')
        .then(() => {
          console.log('🎥 YouTube Player initialized successfully');
          
          // Configurar callback de cambios de estado
          youtubePlayerRef.current?.onStateChange((state) => {
            setYoutubeState(state);
            
            // Mostrar notificación cuando cambia la canción
            const lastTrackTitle = lastTrackTitleRef.current;
            console.log('📊 Notification check:', {
              hasTrack: !!state.currentTrack,
              trackTitle: state.currentTrack?.title,
              lastTrackTitle,
              titleChanged: state.currentTrack?.title !== lastTrackTitle,
              isPlaying: state.isPlaying,
              isMuted: state.isMuted,
              providerMuted: isMuted
            });
            
            // Mostrar notificación solo si:
            // 1. Hay track actual
            // 2. El título cambió (nueva canción) 
            // 3. Está reproduciéndose
            // 4. No está muteado
            if (state.currentTrack && 
                state.currentTrack.title !== lastTrackTitle && 
                state.isPlaying && 
                !state.isMuted) {
              
              // Actualizar el ref del último track INMEDIATAMENTE
              lastTrackTitleRef.current = state.currentTrack.title;
              
              console.log('🔔 Showing notification for:', state.currentTrack.title);
              showNotification(
                state.currentTrack.title,
                state.currentTrack.channelTitle,
                state.currentTrack.thumbnail
              );
            } else {
              console.log('❌ Notification blocked - conditions not met');
            }
          });
          
          // Aplicar estado de mute inicial
          youtubePlayerRef.current?.setMuted(isMuted);
        })
        .catch((error) => {
          console.error('❌ Error initializing YouTube Player:', error);
        });
    }

    // Cleanup cuando salimos de página no-grimorio
    if (isInGrimoire && youtubePlayerRef.current) {
      youtubePlayerRef.current.pause();
    }

    return () => {
      if (isInGrimoire && youtubePlayerRef.current) {
        youtubePlayerRef.current.destroy();
        youtubePlayerRef.current = null;
        
        if (playerContainerRef.current) {
          document.body.removeChild(playerContainerRef.current);
          playerContainerRef.current = null;
        }
      }
    };
  }, [isInGrimoire, isMuted, showNotification]);

  const toggleMute = async () => {
    if (youtubePlayerRef.current) {
      try {
        // Cambiar estado inmediatamente para feedback del usuario
        setIsProcessing(true);
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        
        // Si se está activando YouTube, pausar música de la esfera
        if (!newMutedState) {
          console.log("🔇 Pausando música de la esfera por activar YouTube");
          window.dispatchEvent(new CustomEvent('pauseAudioFromYoutube'));
        }
        
        // Ejecutar fade en background
        await youtubePlayerRef.current.togglePlayPauseWithFade();
        
        setIsProcessing(false);
        // El estado se actualiza automáticamente via callback
      } catch (error) {
        console.error('❌ Error en toggle fade:', error);
        setIsProcessing(false);
        // Revertir estado si hay error
        setIsMuted(prev => !prev);
      }
    }
  };

  const nextTrack = () => {
    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.nextTrack();
    }
  };

  const previousTrack = () => {
    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.previousTrack();
    }
  };

  // Función para auto-reproducir después de animación
  const startMusicAfterAnimation = async () => {
    if (youtubePlayerRef.current && isMuted) {
      try {
        console.log('🎬 Animación completada, iniciando música...');
        // Primero cambiar el estado local
        setIsProcessing(true);
        setIsMuted(false);
        
        await youtubePlayerRef.current.fadeIn(3000); // 3 segundos de fade in
        
        setIsProcessing(false);
        console.log('✅ Música iniciada post-animación exitosamente');
      } catch (error) {
        console.error('❌ Error iniciando música post-animación:', error);
        setIsProcessing(false);
      }
    } else {
      console.log('🚫 Condiciones no cumplidas para auto-start:', {
        hasPlayer: !!youtubePlayerRef.current,
        isMuted
      });
    }
  };

  // Función de prueba para notificaciones
  const testNotification = () => {
    console.log('🧪 Testing notification system...');
    showNotification(
      '♫ Canción de Prueba',
      'Playlist de Lunaria',
      'https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg'
    );
  };

  // Hacer testNotification disponible globalmente para debug
  if (typeof window !== 'undefined') {
    (window as typeof window & { 
      testNotification: typeof testNotification;
      clearNotifications: () => void;
      showManualNotification: () => void;
    }).testNotification = testNotification;
    (window as typeof window & { 
      clearNotifications: () => void;
    }).clearNotifications = () => {
      // Limpiar todas las notificaciones
      notifications.forEach(n => closeNotification(n.id));
    };
    (window as typeof window & { 
      showManualNotification: () => void;
    }).showManualNotification = () => {
      console.log('🧪 Manual notification test...');
      showNotification(
        '🧪 Notificación Manual',
        'Sistema de Prueba',
        'https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg'
      );
    };
  }

  // Funciones para comunicación con otros reproductores
  const pauseFromExternalPlayer = () => {
    if (youtubePlayerRef.current && youtubeState?.isPlaying) {
      youtubePlayerRef.current.pause();
    }
  };

  const resumeFromExternalPlayer = () => {
    // Opcional: podrías implementar lógica para reanudar si es necesario
    // Por ahora, solo pausamos cuando otro reproductor se activa
  };

  return (
    <BackgroundMusicContext.Provider value={{
      isMuted,
      toggleMute,
      isInGrimoire,
      currentTrack: youtubeState?.currentTrack?.title || null,
      isPlaying: youtubeState?.isPlaying || false,
      nextTrack,
      previousTrack,
      youtubeState,
      startMusicAfterAnimation,
      isProcessing,
      notifications,
      closeNotification,
      pauseFromExternalPlayer,
      resumeFromExternalPlayer
    }}>
      {children}
    </BackgroundMusicContext.Provider>
  );
};