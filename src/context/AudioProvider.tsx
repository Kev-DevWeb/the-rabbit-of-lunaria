import React, { createContext, useContext, useRef, useState, useEffect, useCallback, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { musicPlaylists, getPlaylistByRoute, type Playlist, type MusicTrack } from '@/lib/music-playlists-simple';
import { fetchJamendoMusic, convertJamendoToMusicTrack, jamendoFallbackTracks } from '@/lib/jamendo-api';

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
  // Estado de carga de Jamendo
  isLoadingJamendo: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio debe ser usado dentro de AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Estados básicos
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentPlaylistId, setCurrentPlaylistId] = useState('webpage');
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [isShuffleMode, setIsShuffleMode] = useState(false);
  
  // Estados para Jamendo
  const [jamendoTracks, setJamendoTracks] = useState<Track[]>([]);
  const [isLoadingJamendo, setIsLoadingJamendo] = useState(false);

  // Cargar música de Jamendo cuando cambie la playlist
  useEffect(() => {
    const loadJamendoMusic = async () => {
      setIsLoadingJamendo(true);
      try {
        const category = currentPlaylistId === 'grimoire' ? 'study' : 'mystical';
        console.log(`🎵 Cargando música de Jamendo para categoria: ${category}`);
        
        const tracks = await fetchJamendoMusic(category, 8);
        if (tracks && tracks.length > 0) {
          const convertedTracks = tracks.map(convertJamendoToMusicTrack);
          setJamendoTracks(convertedTracks);
          console.log(`✅ ${convertedTracks.length} pistas cargadas de Jamendo`);
        } else {
          console.warn('⚠️ No se encontraron pistas en Jamendo, usando fallback');
          setJamendoTracks(jamendoFallbackTracks);
        }
      } catch (error) {
        console.error('❌ Error cargando música de Jamendo:', error);
        setJamendoTracks(jamendoFallbackTracks);
      } finally {
        setIsLoadingJamendo(false);
      }
    };

    // Cargar siempre para debug - más tarde optimizamos
    console.log(`🔄 Forzando carga de Jamendo para playlist: ${currentPlaylistId}`);
    loadJamendoMusic();
  }, [currentPlaylistId, jamendoTracks.length]);

  // Cambiar playlist automáticamente según la ruta
  useEffect(() => {
    const newPlaylistId = pathname.startsWith('/articulos') || pathname.startsWith('/autores') 
      ? 'grimoire' 
      : 'webpage';
    
    if (newPlaylistId !== currentPlaylistId) {
      setCurrentPlaylistId(newPlaylistId);
      setCurrentTrackIndex(0);
    }
  }, [pathname, currentPlaylistId]);

  // Crear elemento de audio una sola vez
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
      console.log("🎵 Elemento de audio creado");
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Obtener playlist actual
  const currentPlaylist = musicPlaylists.find(p => p.id === currentPlaylistId) || musicPlaylists[0];
  
  // Usar pistas de Jamendo si están disponibles, sino usar playlist local
  const trackList: Track[] = jamendoTracks.length > 0 
    ? jamendoTracks 
    : currentPlaylist.tracks.map((track: MusicTrack) => ({
        src: track.src,
        title: track.title,
        artist: track.artist,
        credits: track.credits
      }));

  // Obtener pista actual (con protección de índices)
  const currentTrack = trackList[currentTrackIndex] || trackList[0] || {
    src: '/musicafondo.mp3',
    title: 'Música por defecto',
    artist: 'El Conejo de Lunaria',
    credits: 'Audio local'
  };

  // Cargar nueva pista en el elemento de audio
  useEffect(() => {
    if (audioRef.current && currentTrack.src) {
      console.log(`🎵 Cargando pista: ${currentTrack.title} - ${currentTrack.src}`);
      audioRef.current.src = currentTrack.src;
      audioRef.current.load();
    }
  }, [currentTrack.src, currentTrack.title]);

  // Función para pasar a la siguiente pista
  const nextTrack = useCallback(() => {
    console.log("⏭️ Siguiente pista solicitada");
    
    if (isShuffleMode) {
      // Modo aleatorio: seleccionar una pista diferente a la actual
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * trackList.length);
      } while (randomIndex === currentTrackIndex && trackList.length > 1);
      
      console.log(`🔀 Modo aleatorio: saltando a pista ${randomIndex}`);
      setCurrentTrackIndex(randomIndex);
    } else {
      // Modo secuencial: siguiente pista en orden
      const nextIndex = (currentTrackIndex + 1) % trackList.length;
      console.log(`➡️ Siguiente pista: ${nextIndex}`);
      setCurrentTrackIndex(nextIndex);
    }
    
    // Si estaba reproduciendo, continuar reproduciendo la nueva pista
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        audioRef.current?.play().catch(error => {
          console.error("❌ Error al reproducir siguiente pista:", error);
        });
      }, 100); // Pequeño delay para permitir que se cargue la nueva pista
    }
  }, [currentTrackIndex, trackList.length, isPlaying, isShuffleMode]);

  // Función para ir a la pista anterior
  const prevTrack = useCallback(() => {
    console.log("⏮️ Pista anterior solicitada");
    
    if (isShuffleMode) {
      // En modo aleatorio, también ir a una pista aleatoria
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * trackList.length);
      } while (randomIndex === currentTrackIndex && trackList.length > 1);
      
      console.log(`🔀 Modo aleatorio: saltando a pista ${randomIndex}`);
      setCurrentTrackIndex(randomIndex);
    } else {
      // Modo secuencial: pista anterior en orden
      const prevIndex = currentTrackIndex === 0 ? trackList.length - 1 : currentTrackIndex - 1;
      console.log(`⬅️ Pista anterior: ${prevIndex}`);
      setCurrentTrackIndex(prevIndex);
    }
    
    // Si estaba reproduciendo, continuar reproduciendo la nueva pista
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        audioRef.current?.play().catch(error => {
          console.error("❌ Error al reproducir pista anterior:", error);
        });
      }, 100);
    }
  }, [currentTrackIndex, trackList.length, isPlaying, isShuffleMode]);

  // Configurar eventos del elemento de audio
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    
    const handleEnded = () => {
      console.log("🔚 Pista terminada, pasando a la siguiente automáticamente");
      nextTrack();
    };

    const handleError = (error: Event) => {
      console.error("❌ Error en elemento de audio:", error);
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      console.log("📡 Iniciando carga de audio...");
    };

    const handleCanPlay = () => {
      console.log("✅ Audio listo para reproducir");
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [nextTrack]);

  // Función para establecer una pista específica
  const setTrack = useCallback((index: number) => {
    if (index >= 0 && index < trackList.length) {
      console.log(`🎯 Estableciendo pista ${index}: ${trackList[index]?.title}`);
      setCurrentTrackIndex(index);
    }
  }, [trackList]);

  // Función para cambiar de playlist
  const setPlaylist = useCallback((playlistId: string) => {
    const playlist = musicPlaylists.find(p => p.id === playlistId);
    if (playlist) {
      setCurrentPlaylistId(playlistId);
      setCurrentTrackIndex(0); // Reiniciar al primer track de la nueva playlist
      
      // Cargar pistas de Jamendo para la nueva playlist
      const loadJamendoMusic = async () => {
        setIsLoadingJamendo(true);
        try {
          const category = playlistId === 'grimoire' ? 'study' : 'mystical';
          console.log(`🎵 Cargando música de Jamendo para categoria: ${category}`);
          
          const tracks = await fetchJamendoMusic(category);
          if (tracks && tracks.length > 0) {
            const convertedTracks = tracks.map(convertJamendoToMusicTrack);
            setJamendoTracks(convertedTracks);
            console.log(`✅ ${convertedTracks.length} pistas cargadas de Jamendo`);
          } else {
            console.warn('⚠️ No se encontraron pistas en Jamendo, usando fallback');
            setJamendoTracks(jamendoFallbackTracks);
          }
        } catch (error) {
          console.error('❌ Error cargando música de Jamendo:', error);
          setJamendoTracks(jamendoFallbackTracks);
        } finally {
          setIsLoadingJamendo(false);
        }
      };
      
      loadJamendoMusic();
    }
  }, []);

  // Función para alternar entre modo aleatorio y secuencial
  const toggleShuffle = useCallback(() => {
    setIsShuffleMode(!isShuffleMode);
    setCurrentTrackIndex(0); // Reiniciar al primer track
  }, [isShuffleMode]);

  const togglePlay = useCallback(async () => {
    console.log("🎵 togglePlay llamado, isPlaying:", isPlaying, "audioRef.current:", !!audioRef.current);
    
    if (!audioRef.current) {
      console.error("❌ No hay elemento de audio disponible");
      return;
    }
    
    const audio = audioRef.current;

    if (!isPlaying) {
      console.log("▶️ Intentando reproducir:", currentTrack.title);
      
      try {
        // Verificar que el audio esté listo
        if (audio.readyState < 2) {
          console.log("⏳ Audio no está listo, esperando...");
          await new Promise<void>((resolve) => {
            const handleCanPlay = () => {
              audio.removeEventListener('canplaythrough', handleCanPlay);
              resolve();
            };
            audio.addEventListener('canplaythrough', handleCanPlay);
            
            // Timeout de seguridad
            setTimeout(() => {
              audio.removeEventListener('canplaythrough', handleCanPlay);
              resolve();
            }, 3000);
          });
        }

        await audio.play();
        setIsPlaying(true);
        setHasPlayedOnce(true);
        console.log("✅ Audio reproduciéndose correctamente");
        
      } catch (error) {
        console.error("❌ Error al reproducir:", error);
        console.error("❌ Detalles del error:", {
          message: (error as Error).message,
          src: currentTrack.src,
          readyState: audio.readyState,
          networkState: audio.networkState
        });
        setIsPlaying(false);
      }
    } else {
      console.log("⏸️ Pausando audio...");
      audio.pause();
      setIsPlaying(false);
      console.log("⏹️ Audio pausado");
    }
  }, [isPlaying, hasPlayedOnce, currentTrack.title, currentTrack.src]);

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
      toggleShuffle,
      isLoadingJamendo
    }}>
      {children}
    </AudioContext.Provider>
  );
};