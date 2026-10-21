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

const PLAYLIST_ID = 'PL4SJvJ-lWGWX2CFXEi7l92UJk-q91szHJ';
// Si la persona apagó la música, no se la volvemos a poner al recargar
const PREFERENCE_KEY = 'lunaria-music';

const readPreferenceOff = () => {
  try {
    return localStorage.getItem(PREFERENCE_KEY) === 'off';
  } catch {
    return false;
  }
};

const savePreference = (on: boolean) => {
  try {
    localStorage.setItem(PREFERENCE_KEY, on ? 'on' : 'off');
  } catch {
    // Sin almacenamiento (modo privado): solo no se recuerda
  }
};

export const BackgroundMusicProvider: React.FC<BackgroundMusicProviderProps> = ({ children }) => {
  const playerRef = useRef<YouTubePlayerService | null>(null);
  const isReadyRef = useRef(false);
  const lastTrackTitleRef = useRef<string | null>(null);
  // La intención de la persona (¿quiere música?) es la fuente de verdad de los botones,
  // separada de lo que esté haciendo el video. Así el icono responde al instante.
  const [wantsMusic, setWantsMusic] = useState(false);
  const wantsMusicRef = useRef(false);
  const fadeIdRef = useRef(0);
  const [youtubeState, setYoutubeState] = useState<YouTubePlayerState | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { notifications, showNotification, closeNotification } = useMusicNotifications();
  const showNotificationRef = useRef(showNotification);
  showNotificationRef.current = showNotification;

  // Aplica la intención al player. Un clic nuevo cancela el desvanecido anterior en vez de esperarlo.
  const applyIntent = useCallback(async (want: boolean, fadeMs: number) => {
    const player = playerRef.current;
    if (!player || !isReadyRef.current) return; // se aplica al estar listo
    const fadeId = ++fadeIdRef.current;
    setIsProcessing(true);
    try {
      if (want) await player.fadeIn(fadeMs);
      else await player.fadeOut(1500);
    } finally {
      if (fadeId === fadeIdRef.current) setIsProcessing(false);
    }
  }, []);

  const setIntent = useCallback((want: boolean, fadeMs = 2000) => {
    wantsMusicRef.current = want;
    setWantsMusic(want);
    void applyIntent(want, fadeMs);
  }, [applyIntent]);

  // Inicializar YouTube Player — UNA SOLA VEZ
  useEffect(() => {
    if (playerRef.current) return;

    // Contenedor oculto para el iframe
    let container = document.getElementById('youtube-player-bg');
    if (!container) {
      container = document.createElement('div');
      container.id = 'youtube-player-bg';
      Object.assign(container.style, {
        position: 'fixed', top: '-1000px', left: '-1000px', width: '1px', height: '1px', opacity: '0', pointerEvents: 'none',
      });
      document.body.appendChild(container);
    }

    const player = new YouTubePlayerService(PLAYLIST_ID);
    playerRef.current = player;

    player.onStateChange((state) => {
      setYoutubeState(state);

      // Notificación cuando cambia la canción y la música se oye
      const title = state.currentTrack?.title;
      if (title && title !== lastTrackTitleRef.current && wantsMusicRef.current && state.isPlaying && !state.isMuted) {
        lastTrackTitleRef.current = title;
        showNotificationRef.current(title, state.currentTrack!.channelTitle, state.currentTrack!.thumbnail);
      }
    });

    player.initialize('youtube-player-bg')
      .then(() => {
        isReadyRef.current = true;
        // Si la persona pidió música antes de que el player estuviera listo, se respeta ahora
        if (wantsMusicRef.current) void applyIntent(true, 2000);
        else player.setMuted(true);
      })
      .catch(() => {
        // Error silencioso: el reproductor se reintenta al recargar
      });
  }, [applyIntent]);

  const toggleMute = useCallback(() => {
    const want = !wantsMusicRef.current;
    savePreference(want);
    setIntent(want);
  }, [setIntent]);

  const nextTrack = useCallback(() => {
    playerRef.current?.nextTrack();
  }, []);

  const previousTrack = useCallback(() => {
    playerRef.current?.previousTrack();
  }, []);

  // Tras la intro de la puerta. No se fuerza si la persona ya la había apagado antes.
  const startMusicAfterAnimation = useCallback(() => {
    if (wantsMusicRef.current || readPreferenceOff()) return;
    setIntent(true, 3000);
  }, [setIntent]);

  return (
    <BackgroundMusicContext.Provider value={{
      isMuted: !wantsMusic,
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
