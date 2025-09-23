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
    const audio = new Audio(currentTrack.src);
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    audio.volume = 0.7;
    audioRef.current = audio;

    const handleAudioEnd = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % trackList.length);
    };

    const handleError = (error: Event) => {
      console.error('Error cargando audio desde', currentTrack.src, ':', error);
      setCurrentTrackIndex((prev) => (prev + 1) % trackList.length);
    };

    const handleCanPlay = () => {
      console.log('Audio listo:', currentTrack.title);
    };

    audio.addEventListener('ended', handleAudioEnd);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      audio.removeEventListener('ended', handleAudioEnd);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.pause();
      audioRef.current = null;
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
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (!isPlaying) {
      setIsPlaying(true);
      audio.volume = 0;
      try {
        await audio.play();
        fadeAudio(0.7, 2000);
        if (!hasPlayedOnce) {
          setHasPlayedOnce(true);
        }
      } catch (error) {
        console.error("Error al intentar reproducir el audio:", error);
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(false);
      fadeAudio(0, 1500, () => {
        audio.pause();
      });
    }
  }, [isPlaying, hasPlayedOnce, fadeAudio]);

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
