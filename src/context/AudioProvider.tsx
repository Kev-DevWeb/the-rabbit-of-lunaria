import React, { createContext, useContext, useRef, useState, useEffect, useCallback, ReactNode } from 'react';
import { musicPlaylists, type Playlist, type PixabayTrack } from '@/lib/pixabay-music';

interface Track {
  src: string;
  title: string;
  artist: string;
  credits: string;
}

interface AudioContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  currentTrack: Track;
  nextTrack: () => void;
  prevTrack: () => void;
  setTrack: (index: number) => void;
  trackList: Track[];
  currentTrackIndex: number;
  // Funciones para playlists
  currentPlaylist: Playlist;
  setPlaylist: (playlistId: string) => void;
  availablePlaylists: Playlist[];
  // Nuevas funciones para reproducción
  isShuffleMode: boolean;
  toggleShuffle: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentPlaylistId, setCurrentPlaylistId] = useState('ambient-fancy-magic'); // Comenzar con la playlist curada
  const [isShuffleMode, setIsShuffleMode] = useState(true); // Activar shuffle por defecto
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(isPlaying); // Referencia para acceder al estado actual en los event listeners

  // Mantener la referencia actualizada
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Obtener playlist actual
  const currentPlaylist = musicPlaylists.find(p => p.id === currentPlaylistId) || musicPlaylists[0];
  
  // Convertir tracks de la playlist actual a formato compatible
  const trackList: Track[] = currentPlaylist.tracks.map((track: PixabayTrack) => ({
    src: track.src,
    title: track.title,
    artist: track.artist,
    credits: track.credits
  }));

  // Crear orden aleatorio si está en modo shuffle
  useEffect(() => {
    if (isShuffleMode && trackList.length > 0) {
      const indices = Array.from({ length: trackList.length }, (_, i) => i);
      const shuffled = [...indices].sort(() => Math.random() - 0.5);
      setShuffledOrder(shuffled);
    }
  }, [isShuffleMode, trackList.length]);

  // Obtener el índice real según el modo de reproducción
  const getRealIndex = (displayIndex: number) => {
    if (isShuffleMode && shuffledOrder.length > 0) {
      return shuffledOrder[displayIndex] || 0;
    }
    return displayIndex;
  };

  const currentTrack = trackList[getRealIndex(currentTrackIndex)] || trackList[0];

  useEffect(() => {
    console.log('Creando nuevo elemento de audio para:', currentTrack.title, 'URL:', currentTrack.src);
    
    const audio = new Audio();
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    audio.volume = 0.7;
    audio.src = currentTrack.src; // Asignar src después de configurar propiedades
    audioRef.current = audio;

    const handleAudioEnd = () => {
      console.log('Audio terminó, isPlaying:', isPlayingRef.current);
      // Solo avanzar automáticamente si está reproduciéndose
      if (isPlayingRef.current) {
        setCurrentTrackIndex((prev) => (prev + 1) % trackList.length);
      }
    };

    const handleError = (error: Event) => {
      console.error('Error cargando audio desde', currentTrack.src, ':', error);
      // Solo avanzar automáticamente si está reproduciéndose y hay más de una pista
      if (isPlayingRef.current && trackList.length > 1) {
        setCurrentTrackIndex((prev) => (prev + 1) % trackList.length);
      } else {
        setIsPlaying(false); // Pausar si hay un error y no se está reproduciendo
      }
    };

    const handleCanPlay = () => {
      console.log('Audio listo para reproducir:', currentTrack.title);
    };

    const handleLoadStart = () => {
      console.log('Iniciando carga de:', currentTrack.src);
    };

    const handleLoadedData = () => {
      console.log('Datos cargados para:', currentTrack.title);
    };

    audio.addEventListener('ended', handleAudioEnd);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      audio.removeEventListener('ended', handleAudioEnd);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.pause();
      audioRef.current = null;
      console.log('Audio limpiado para:', currentTrack.title);
    };
  }, [currentTrackIndex, trackList.length, currentTrack.src, currentTrack.title]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        audio.pause();
      } else {
        if (isPlaying && hasPlayedOnce) {
          audio.play().catch(error => console.error("Error al reanudar el audio:", error));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPlaying, hasPlayedOnce]);

  const fadeAudio = useCallback((targetVolume: number, duration: number, onComplete?: () => void) => {
    if (!audioRef.current) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const audio = audioRef.current;
    const startVolume = audio.volume;
    const steps = 50;
    const stepDuration = duration / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const newVolume = startVolume + (targetVolume - startVolume) * (currentStep / steps);
      audio.volume = Math.max(0, Math.min(1, newVolume));

      if (currentStep >= steps) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        if (onComplete) onComplete();
      }
    }, stepDuration);
  }, []);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % trackList.length);
  }, [trackList.length]);

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + trackList.length) % trackList.length);
  }, [trackList.length]);

  const setTrack = useCallback((index: number) => {
    if (index >= 0 && index < trackList.length) {
      setCurrentTrackIndex(index);
    }
  }, [trackList.length]);

  // Función para cambiar de playlist
  const setPlaylist = useCallback((playlistId: string) => {
    const playlist = musicPlaylists.find(p => p.id === playlistId);
    if (playlist) {
      setCurrentPlaylistId(playlistId);
      setCurrentTrackIndex(0); // Reiniciar al primer track de la nueva playlist
    }
  }, []);

  const togglePlay = useCallback(async () => {
    console.log("🎵 togglePlay llamado, isPlaying:", isPlaying, "audioRef.current:", !!audioRef.current);
    
    if (!audioRef.current) {
      console.error("❌ No hay elemento de audio disponible");
      return;
    }
    
    const audio = audioRef.current;
    console.log("🎵 Audio src:", audio.src, "readyState:", audio.readyState, "networkState:", audio.networkState);

    if (!isPlaying) {
      console.log("▶️ Intentando reproducir...");
      setIsPlaying(true);
      audio.volume = 0;
      
      try {
        // Esperar a que el audio esté listo si es necesario
        if (audio.readyState < 2) { // HAVE_CURRENT_DATA
          console.log("⏳ Esperando que el audio esté listo...");
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              audio.removeEventListener('canplay', onCanPlay);
              audio.removeEventListener('error', onError);
              reject(new Error('Timeout esperando que el audio esté listo'));
            }, 10000); // 10 segundos timeout
            
            const onCanPlay = () => {
              clearTimeout(timeout);
              audio.removeEventListener('canplay', onCanPlay);
              audio.removeEventListener('error', onError);
              console.log("✅ Audio listo para reproducir");
              resolve(void 0);
            };
            const onError = (e: Event) => {
              clearTimeout(timeout);
              audio.removeEventListener('canplay', onCanPlay);
              audio.removeEventListener('error', onError);
              console.error("❌ Error cargando audio:", e);
              reject(new Error('Error cargando audio'));
            };
            audio.addEventListener('canplay', onCanPlay);
            audio.addEventListener('error', onError);
          });
        }
        
        await audio.play();
        console.log("🎶 Audio reproduciendo exitosamente");
        fadeAudio(0.7, 2000);
        if (!hasPlayedOnce) {
          setHasPlayedOnce(true);
        }
      } catch (error) {
        console.error("❌ Error al intentar reproducir el audio:", error);
        setIsPlaying(false);
        // Si hay error, intentar con la siguiente canción
        if (trackList.length > 1) {
          console.log("🔄 Intentando con la siguiente canción...");
          setTimeout(() => {
            setCurrentTrackIndex((prev) => (prev + 1) % trackList.length);
          }, 1000);
        }
      }
    } else {
      console.log("⏸️ Pausando audio...");
      setIsPlaying(false);
      fadeAudio(0, 1500, () => {
        audio.pause();
        console.log("⏹️ Audio pausado");
      });
    }
  }, [isPlaying, hasPlayedOnce, fadeAudio, trackList.length]);

  const toggleShuffle = useCallback(() => {
    setIsShuffleMode(!isShuffleMode);
    setCurrentTrackIndex(0); // Reiniciar al primer track
  }, [isShuffleMode]);

  return (
    <AudioContext.Provider value={{ 
      isPlaying, 
      togglePlay, 
      currentTrack,
      nextTrack,
      prevTrack,
      setTrack,
      trackList,
      currentTrackIndex,
      currentPlaylist,
      setPlaylist,
      availablePlaylists: musicPlaylists,
      isShuffleMode,
      toggleShuffle
    }}>
      {children}
    </AudioContext.Provider>
  );
};
