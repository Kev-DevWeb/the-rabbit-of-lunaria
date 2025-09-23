import React, { createContext, useContext, useRef, useState, useEffect, useCallback, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { musicPlaylists, getPlaylistByRoute, type Playlist, type MusicTrack } from '@/lib/music-playlists';

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
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentPlaylistId, setCurrentPlaylistId] = useState('webpage'); // Comenzar con la playlist general
  const [isShuffleMode, setIsShuffleMode] = useState(true); // Activar shuffle por defecto
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(isPlaying); // Referencia para acceder al estado actual en los event listeners

  // Mantener la referencia actualizada
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Cambiar playlist automáticamente según la ruta
  useEffect(() => {
    const newPlaylistId = pathname.startsWith('/articulos') || pathname.startsWith('/autores') 
      ? 'grimoire' 
      : 'webpage';
    
    if (newPlaylistId !== currentPlaylistId) {
      setCurrentPlaylistId(newPlaylistId);
      // Resetear el índice cuando cambia la playlist
      setCurrentTrackIndex(0);
      console.log(`🎵 Playlist cambiada a: ${newPlaylistId === 'grimoire' ? 'Grimorio (estudio)' : 'General (mística)'}`);
    }
  }, [pathname, currentPlaylistId]);

  // Obtener playlist actual
  const currentPlaylist = musicPlaylists.find(p => p.id === currentPlaylistId) || musicPlaylists[0];
  
  // Convertir tracks de la playlist actual a formato compatible
  const trackList: Track[] = currentPlaylist.tracks.map((track: MusicTrack) => ({
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
      // Pausar reproducción si hay error
      setIsPlaying(false);
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
    console.log("⏭️ Avanzando a la siguiente pista");
    setCurrentTrackIndex((prev) => (prev + 1) % trackList.length);
  }, [trackList.length]);

  const prevTrack = useCallback(() => {
    console.log("⏮️ Retrocediendo a la pista anterior");
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

    if (!isPlaying) {
      console.log("▶️ Intentando reproducir...");
      try {
        // Configurar volumen inicial
        audio.volume = 0.7;
        
        // Reproducir directamente
        await audio.play();
        setIsPlaying(true);
        console.log("🎶 Audio reproduciendo exitosamente");
        
        if (!hasPlayedOnce) {
          setHasPlayedOnce(true);
        }
      } catch (error) {
        console.error("❌ Error al reproducir:", error);
        setIsPlaying(false);
      }
    } else {
      console.log("⏸️ Pausando audio...");
      audio.pause();
      setIsPlaying(false);
      console.log("⏹️ Audio pausado");
    }
  }, [isPlaying, hasPlayedOnce]);

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
