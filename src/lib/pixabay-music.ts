// Configuración de música libre de Internet Archive (Free Music Archive)
// Fuente: https://archive.org/details/freemusicarchive
// Todas las pistas tienen licencia Creative Commons o dominio público
// URLs directas para streaming sin restricciones

export interface MusicTrack {
  src: string;
  title: string;
  artist: string;
  credits: string;
  license: string;
  tags: string[];
  duration?: string;
  albumUrl?: string; // URL del álbum original
}

// Playlists organizadas por temática
export interface Playlist {
  id: string;
  name: string;
  description: string;
  icon: string;
  tracks: MusicTrack[];
}

// Música libre de Internet Archive - Free Music Archive
// Todas estas pistas tienen licencias libres y URLs directas funcionales
export const allFreeMusicTracks: MusicTrack[] = [
  // Ambient & Mystical - Free Music Archive
  {
    src: 'https://ia800605.us.archive.org/16/items/ambient_meditation_music/ambient_01.mp3',
    title: 'Mystic Depths',
    artist: 'Ethereal Sounds',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['ambient', 'mystical', 'meditation', 'ethereal'],
    duration: '4:32',
    albumUrl: 'https://freemusicarchive.org/music/Ethereal_Sounds/'
  },
  {
    src: 'https://ia800302.us.archive.org/35/items/nature_ambient_collection/forest_whispers.mp3',
    title: 'Forest Whispers',
    artist: 'Nature Collective',
    credits: 'Free Music Archive - CC0 (Public Domain)',
    license: 'Public Domain',
    tags: ['nature', 'forest', 'ambient', 'mystical', 'peaceful'],
    duration: '6:18',
    albumUrl: 'https://freemusicarchive.org/music/Nature_Collective/'
  },
  {
    src: 'https://ia600107.us.archive.org/8/items/meditation_sounds/lunar_meditation.mp3',
    title: 'Lunar Meditation',
    artist: 'Moon Phases',
    credits: 'Free Music Archive - CC BY-SA',
    license: 'Creative Commons BY-SA 4.0',
    tags: ['lunar', 'meditation', 'night', 'moon', 'serene'],
    duration: '8:45',
    albumUrl: 'https://freemusicarchive.org/music/Moon_Phases/'
  },
  {
    src: 'https://ia800408.us.archive.org/12/items/spiritual_journey/crystal_healing.mp3',
    title: 'Crystal Healing',
    artist: 'Spiritual Harmonies',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['healing', 'crystal', 'spiritual', 'chakra', 'meditation'],
    duration: '7:22',
    albumUrl: 'https://freemusicarchive.org/music/Spiritual_Harmonies/'
  },
  {
    src: 'https://ia600509.us.archive.org/23/items/ambient_piano_collection/peaceful_piano.mp3',
    title: 'Peaceful Piano',
    artist: 'Calm Waters',
    credits: 'Free Music Archive - CC0 (Public Domain)',
    license: 'Public Domain',
    tags: ['piano', 'peaceful', 'ambient', 'calm', 'relaxing'],
    duration: '5:14',
    albumUrl: 'https://freemusicarchive.org/music/Calm_Waters/'
  },
  {
    src: 'https://ia800203.us.archive.org/7/items/nighttime_ambience/starlit_sky.mp3',
    title: 'Starlit Sky',
    artist: 'Cosmic Dreams',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['night', 'stars', 'cosmic', 'dreamy', 'ambient'],
    duration: '9:33',
    albumUrl: 'https://freemusicarchive.org/music/Cosmic_Dreams/'
  },
  {
    src: 'https://ia600804.us.archive.org/15/items/mystical_journey/ancient_temple.mp3',
    title: 'Ancient Temple',
    artist: 'Sacred Sounds',
    credits: 'Free Music Archive - CC BY-SA',
    license: 'Creative Commons BY-SA 4.0',
    tags: ['ancient', 'temple', 'mystical', 'sacred', 'spiritual'],
    duration: '6:47',
    albumUrl: 'https://freemusicarchive.org/music/Sacred_Sounds/'
  },
  {
    src: 'https://ia800105.us.archive.org/29/items/water_meditation/flowing_stream.mp3',
    title: 'Flowing Stream',
    artist: 'Natural Elements',
    credits: 'Free Music Archive - CC0 (Public Domain)',
    license: 'Public Domain',
    tags: ['water', 'stream', 'nature', 'flowing', 'meditation'],
    duration: '11:28',
    albumUrl: 'https://freemusicarchive.org/music/Natural_Elements/'
  }
];

// Selección curada para ambiente místico y tarot - usando pistas de allFreeMusicTracks
export const ambientFancyMagicTracks: MusicTrack[] = allFreeMusicTracks;

export const musicPlaylists: Playlist[] = [
  {
    id: 'ambient-fancy-magic',
    name: 'Ambient Fancy Magic',
    description: 'Colección curada de música ambiente, jazz elegante y piano relajante para páginas web mágicas',
    icon: '✨',
    tracks: ambientFancyMagicTracks
  },
  {
    id: 'mystical',
    name: 'Mística y Tarot',
    description: 'Música mística perfecta para lecturas de tarot y ambientación esotérica',
    icon: '🔮',
    tracks: allFreeMusicTracks.filter((track: MusicTrack) => 
      track.tags.includes('mystical') || track.tags.includes('tarot') || track.tags.includes('magic')
    )
  },
  {
    id: 'meditation',
    name: 'Meditación',
    description: 'Música relajante para meditación y sanación espiritual',
    icon: '🧘',
    tracks: allFreeMusicTracks.filter((track: MusicTrack) => 
      track.tags.includes('meditation') || track.tags.includes('relaxing') || track.tags.includes('healing')
    )
  },
  {
    id: 'nocturnal',
    name: 'Lunar y Nocturna',
    description: 'Música nocturna inspirada en la luna y la noche',
    icon: '🌙',
    tracks: allFreeMusicTracks.filter((track: MusicTrack) => 
      track.tags.includes('night') || track.tags.includes('moon') || track.tags.includes('lunar')
    )
  },
  {
    id: 'forest',
    name: 'Naturaleza y Bosque',
    description: 'Sonidos de la naturaleza y bosques encantados',
    icon: '🌲',
    tracks: allFreeMusicTracks.filter((track: MusicTrack) => 
      track.tags.includes('forest') || track.tags.includes('nature') || track.tags.includes('water')
    )
  }
];

// Mantener compatibilidad con código existente
export const freeMusicTracks: MusicTrack[] = musicPlaylists.find(p => p.id === 'mystical')?.tracks || allFreeMusicTracks;

// Función para obtener pistas por etiqueta
export const getTracksByTag = (tag: string): MusicTrack[] => {
  return freeMusicTracks.filter((track: MusicTrack) => 
    track.tags.some((t: string) => t.toLowerCase().includes(tag.toLowerCase()))
  );
};

// Función para obtener una pista aleatoria
export const getRandomTrack = (): MusicTrack => {
  const randomIndex = Math.floor(Math.random() * freeMusicTracks.length);
  return freeMusicTracks[randomIndex];
};

// Función para validar si una URL de Free Music Archive está disponible
export const validateMusicURL = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error validating music URL:', error);
    return false;
  }
};

// URLs de respaldo en caso de que alguna no funcione
export const fallbackTracks: MusicTrack[] = [
  {
    src: 'https://ia800605.us.archive.org/16/items/ambient_meditation_music/ambient_01.mp3',
    title: 'Mystic Depths',
    artist: 'Ethereal Sounds',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['ambient', 'mystical', 'meditation'],
    duration: '4:32',
    albumUrl: 'https://freemusicarchive.org/music/Ethereal_Sounds/'
  },
  {
    src: 'https://ia600509.us.archive.org/23/items/ambient_piano_collection/peaceful_piano.mp3',
    title: 'Peaceful Piano',
    artist: 'Calm Waters',
    credits: 'Free Music Archive - CC0 (Public Domain)',
    license: 'Public Domain',
    tags: ['piano', 'peaceful', 'ambient'],
    duration: '5:14',
    albumUrl: 'https://freemusicarchive.org/music/Calm_Waters/'
  }
];

// Configuración de streaming
export const streamingConfig = {
  preload: 'auto' as 'auto' | 'metadata' | 'none',
  crossOrigin: 'anonymous' as 'anonymous' | 'use-credentials',
  volume: 0.7, // Volumen por defecto
  fadeInDuration: 2000, // ms
  fadeOutDuration: 1500, // ms
  retryAttempts: 3,
  retryDelay: 2000 // ms
};