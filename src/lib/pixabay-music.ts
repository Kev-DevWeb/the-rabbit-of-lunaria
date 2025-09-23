// Configuración de música de Pixabay
// Para obtener nuevas URLs:
// 1. Ve a https://pixabay.com/music
// 2. Busca música (mystic, ambient, meditation, forest, etc.)
// 3. Copia la URL del archivo MP3
// 4. Agrega aquí con sus metadatos

export interface PixabayTrack {
  src: string;
  title: string;
  artist: string;
  credits: string;
  tags: string[];
  duration?: string; // Opcional: duración estimada
}

// Playlists organizadas por temática
export interface Playlist {
  id: string;
  name: string;
  description: string;
  icon: string;
  tracks: PixabayTrack[];
}

export const allPixabayTracks: PixabayTrack[] = [
  // Música Mística y de Tarot
  {
    src: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
    title: 'Mystical Forest',
    artist: 'Music_For_Videos',
    credits: 'Por Music_For_Videos en Pixabay',
    tags: ['mystical', 'ambient', 'forest', 'tarot'],
    duration: '3:45'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2023/09/26/audio_d0c8a15b78.mp3',
    title: 'Mystic Ambient',
    artist: 'Lexin_Music',
    credits: 'Por Lexin_Music en Pixabay',
    tags: ['mystic', 'atmospheric', 'healing', 'tarot'],
    duration: '5:22'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2022/11/15/audio_4c8a42c8af.mp3',
    title: 'Celtic Dream',
    artist: 'Ashot-Danielyan-Composer',
    credits: 'Por Ashot-Danielyan-Composer en Pixabay',
    tags: ['celtic', 'mystical', 'ethereal', 'tarot'],
    duration: '3:28'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2021/08/04/audio_0f2c8b6d14.mp3',
    title: 'Magic Spell',
    artist: 'AudioCoffee',
    credits: 'Por AudioCoffee en Pixabay',
    tags: ['magic', 'mysterious', 'dark', 'tarot'],
    duration: '4:30'
  },
  
  // Música de Meditación
  {
    src: 'https://cdn.pixabay.com/audio/2022/03/10/audio_e2b6c6676f.mp3',
    title: 'Meditation Music',
    artist: 'SoundReality',
    credits: 'Por SoundReality en Pixabay',
    tags: ['meditation', 'relaxing', 'ambient', 'peace'],
    duration: '4:12'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2023/01/28/audio_7d49e5b7b0.mp3',
    title: 'Ambient Meditation',
    artist: 'SergeQuadrado',
    credits: 'Por SergeQuadrado en Pixabay',
    tags: ['ambient', 'meditation', 'peaceful', 'zen'],
    duration: '6:15'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2021/09/07/audio_d2c4b9e8f3.mp3',
    title: 'Deep Relaxation',
    artist: 'Meditation_Relax_Club',
    credits: 'Por Meditation_Relax_Club en Pixabay',
    tags: ['relaxation', 'deep', 'calm', 'healing'],
    duration: '7:20'
  },

  // Música Nocturna/Luna
  {
    src: 'https://cdn.pixabay.com/audio/2022/08/02/audio_45a2c8e1f2.mp3',
    title: 'Moonlight Serenity',
    artist: 'AudioCoffee',
    credits: 'Por AudioCoffee en Pixabay',
    tags: ['night', 'moon', 'serenity', 'nocturnal', 'lunar'],
    duration: '5:45'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2023/02/14/audio_b1c9d7e4a8.mp3',
    title: 'Lunar Whispers',
    artist: 'SergePavkinMusic',
    credits: 'Por SergePavkinMusic en Pixabay',
    tags: ['lunar', 'whispers', 'mystical', 'night', 'moon'],
    duration: '6:30'
  },
  
  // Más música mística para expandir colección
  {
    src: 'https://cdn.pixabay.com/audio/2021/11/22/audio_f3e1a2d5c8.mp3',
    title: 'Ancient Wisdom',
    artist: 'Grand_Project',
    credits: 'Por Grand_Project en Pixabay',
    tags: ['ancient', 'wisdom', 'mystical', 'tarot', 'spiritual'],
    duration: '4:18'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2022/09/30/audio_c8a1f5d2b9.mp3',
    title: 'Forest Spirits',
    artist: 'Music_Unlimited',
    credits: 'Por Music_Unlimited en Pixabay',
    tags: ['forest', 'spirits', 'nature', 'mystical', 'meditation'],
    duration: '7:12'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2023/06/18/audio_d9f2b7a4e1.mp3',
    title: 'Cosmic Journey',
    artist: 'Wellness',
    credits: 'Por Wellness en Pixabay',
    tags: ['cosmic', 'space', 'journey', 'meditation', 'healing'],
    duration: '8:45'
  }
];

// Definición de playlists temáticas
// Nueva playlist curada - Ambient Fancy Magic Music
export const ambientFancyMagicTracks: PixabayTrack[] = [
  // Jazz Background Tracks
  {
    src: 'https://cdn.pixabay.com/audio/2024/10/23/audio_3c79e62850.mp3',
    title: 'Jazz Background Music',
    artist: 'Tunetank',
    credits: 'Por Tunetank en Pixabay',
    tags: ['jazz', 'background', 'ambient', 'elegant'],
    duration: '2:45'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2025/01/04/audio_7b8f2e4c91.mp3',
    title: 'Trumpet Song (dark jazz)',
    artist: 'Surprising_Media',
    credits: 'Por Surprising_Media en Pixabay',
    tags: ['jazz', 'trumpet', 'dark', 'ambient'],
    duration: '3:20'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2025/01/20/audio_5d6a3f8b47.mp3',
    title: 'Jazz Song',
    artist: 'Icsilviu',
    credits: 'Por Icsilviu en Pixabay',
    tags: ['jazz', 'traditional', 'ambient', 'smooth'],
    duration: '2:58'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2021/02/01/audio_9a4e7c2d85.mp3',
    title: 'Dark Bar',
    artist: 'softsuicide',
    credits: 'Por softsuicide en Pixabay',
    tags: ['jazz', 'dark', 'bar', 'atmospheric'],
    duration: '4:12'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2025/01/02/audio_8f5b9d1a63.mp3',
    title: 'Piano Soul (dark jazz)',
    artist: 'Surprising_Media',
    credits: 'Por Surprising_Media en Pixabay',
    tags: ['jazz', 'piano', 'soul', 'dark'],
    duration: '3:45'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2024/12/30/audio_2c8e6a4f19.mp3',
    title: 'Sax and Guitar Duet (dark jazz)',
    artist: 'Surprising_Media',
    credits: 'Por Surprising_Media en Pixabay',
    tags: ['jazz', 'saxophone', 'guitar', 'duet'],
    duration: '4:05'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2025/01/01/audio_7d3b8f5e27.mp3',
    title: 'Dancing Saxophone (dark jazz)',
    artist: 'Surprising_Media',
    credits: 'Por Surprising_Media en Pixabay',
    tags: ['jazz', 'saxophone', 'dancing', 'ambient'],
    duration: '3:33'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2024/07/08/audio_4f9a2d6c83.mp3',
    title: "Jazz at Dizzy's",
    artist: 'TokyoRifft',
    credits: 'Por TokyoRifft en Pixabay',
    tags: ['jazz', 'club', 'ambient', 'sophisticated'],
    duration: '4:20'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2025/01/16/audio_6e2c9b4a58.mp3',
    title: 'Jazz',
    artist: 'PulseBox',
    credits: 'Por PulseBox en Pixabay',
    tags: ['jazz', 'smooth', 'background', 'ambient'],
    duration: '3:15'
  },
  
  // Classical & Piano Tracks
  {
    src: 'https://cdn.pixabay.com/audio/2022/10/25/audio_1b8f5e3a74.mp3',
    title: 'Calm and Peaceful',
    artist: 'music_for_video',
    credits: 'Por music_for_video en Pixabay',
    tags: ['classical', 'calm', 'peaceful', 'ambient'],
    duration: '3:42'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2021/08/30/audio_5c7d2f9b18.mp3',
    title: 'Music Box Music by Ernst Gottlieb Baron 6',
    artist: 'Nesrality',
    credits: 'Por Nesrality en Pixabay',
    tags: ['music-box', 'classical', 'delicate', 'ambient'],
    duration: '2:28'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2023/04/12/audio_8a3f6d4e92.mp3',
    title: 'What Child Is This Music Box',
    artist: 'Music_For_Videos',
    credits: 'Por Music_For_Videos en Pixabay',
    tags: ['music-box', 'classical', 'peaceful', 'ambient'],
    duration: '1:58'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2022/12/18/audio_7e9b2c5d41.mp3',
    title: 'What Child is This? (Christmas Music Box)',
    artist: 'music_for_video',
    credits: 'Por music_for_video en Pixabay',
    tags: ['music-box', 'christmas', 'peaceful', 'ambient'],
    duration: '2:15'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2022/11/03/audio_3d6f8a2b57.mp3',
    title: "Lili's Dream",
    artist: 'Alban_Gogh',
    credits: 'Por Alban_Gogh en Pixabay',
    tags: ['classical', 'dreamy', 'peaceful', 'ambient'],
    duration: '3:50'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2024/07/09/audio_9c4e7b3f26.mp3',
    title: 'Music Box Twilight',
    artist: 'Playlistsons',
    credits: 'Por Playlistsons en Pixabay',
    tags: ['music-box', 'twilight', 'peaceful', 'ambient'],
    duration: '2:35'
  },
  
  // Relaxing Piano Collection
  {
    src: 'https://cdn.pixabay.com/audio/2024/10/17/audio_2f8d6c4a95.mp3',
    title: 'Relaxing Piano Music 1',
    artist: 'Clavier-Music',
    credits: 'Por Clavier-Music en Pixabay',
    tags: ['piano', 'relaxing', 'peaceful', 'ambient'],
    duration: '4:22'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2024/05/28/audio_6b9e3f7c41.mp3',
    title: 'Peaceful Relaxing Piano Music',
    artist: 'Clavier-Music',
    credits: 'Por Clavier-Music en Pixabay',
    tags: ['piano', 'peaceful', 'relaxing', 'ambient'],
    duration: '3:48'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2024/11/03/audio_8d4f2a6c73.mp3',
    title: 'Soft Memories - Relaxing Piano Music',
    artist: 'Clavier-Music',
    credits: 'Por Clavier-Music en Pixabay',
    tags: ['piano', 'memories', 'soft', 'relaxing'],
    duration: '4:15'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2024/10/17/audio_5e7c9b2d86.mp3',
    title: 'Relaxing Piano Music 2',
    artist: 'Clavier-Music',
    credits: 'Por Clavier-Music en Pixabay',
    tags: ['piano', 'relaxing', 'peaceful', 'ambient'],
    duration: '3:55'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2024/12/05/audio_4a8f6d3c72.mp3',
    title: 'Relaxing Piano Music 3',
    artist: 'Clavier-Music',
    credits: 'Por Clavier-Music en Pixabay',
    tags: ['piano', 'relaxing', 'peaceful', 'ambient'],
    duration: '4:08'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2024/06/15/audio_7c2e9f4b83.mp3',
    title: 'Relaxing Piano Music 4',
    artist: 'Clavier-Music',
    credits: 'Por Clavier-Music en Pixabay',
    tags: ['piano', 'relaxing', 'peaceful', 'ambient'],
    duration: '3:32'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2024/05/20/audio_9b3d6f8c47.mp3',
    title: 'Relaxing Piano Music 5',
    artist: 'Clavier-Music',
    credits: 'Por Clavier-Music en Pixabay',
    tags: ['piano', 'relaxing', 'peaceful', 'ambient'],
    duration: '4:28'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2024/06/08/audio_2e7b4c9f35.mp3',
    title: 'Relaxing Piano Music 6',
    artist: 'Clavier-Music',
    credits: 'Por Clavier-Music en Pixabay',
    tags: ['piano', 'relaxing', 'peaceful', 'ambient'],
    duration: '3:45'
  }
];

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
    tracks: allPixabayTracks.filter(track => 
      track.tags.includes('mystical') || track.tags.includes('tarot') || track.tags.includes('magic')
    )
  },
  {
    id: 'meditation',
    name: 'Meditación',
    description: 'Música relajante para meditación y sanación espiritual',
    icon: '🧘',
    tracks: allPixabayTracks.filter(track => 
      track.tags.includes('meditation') || track.tags.includes('relaxing') || track.tags.includes('healing')
    )
  },
  {
    id: 'nocturnal',
    name: 'Lunar y Nocturna',
    description: 'Música nocturna inspirada en la luna y la noche',
    icon: '�',
    tracks: allPixabayTracks.filter(track => 
      track.tags.includes('night') || track.tags.includes('moon') || track.tags.includes('lunar')
    )
  },
  {
    id: 'forest',
    name: 'Naturaleza y Bosque',
    description: 'Sonidos de la naturaleza y bosques encantados',
    icon: '�',
    tracks: allPixabayTracks.filter(track => 
      track.tags.includes('forest') || track.tags.includes('nature') || track.tags.includes('water')
    )
  }
];

// Mantener compatibilidad con código existente
export const pixabayMusicTracks: PixabayTrack[] = musicPlaylists.find(p => p.id === 'tarot')?.tracks || allPixabayTracks;

// Función para obtener pistas por etiqueta
export const getTracksByTag = (tag: string): PixabayTrack[] => {
  return pixabayMusicTracks.filter(track => 
    track.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
};

// Función para obtener una pista aleatoria
export const getRandomTrack = (): PixabayTrack => {
  const randomIndex = Math.floor(Math.random() * pixabayMusicTracks.length);
  return pixabayMusicTracks[randomIndex];
};

// Función para validar si una URL de Pixabay está disponible
export const validatePixabayURL = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error validating Pixabay URL:', error);
    return false;
  }
};

// URLs de respaldo en caso de que alguna no funcione
export const fallbackTracks: PixabayTrack[] = [
  {
    src: 'https://cdn.pixabay.com/audio/2021/08/09/audio_0625c1539c.mp3',
    title: 'Peaceful Piano',
    artist: 'Grand_Project',
    credits: 'Por Grand_Project en Pixabay',
    tags: ['piano', 'peaceful', 'ambient'],
    duration: '2:45'
  },
  {
    src: 'https://cdn.pixabay.com/audio/2022/12/06/audio_abc123def4.mp3',
    title: 'Nature Sounds',
    artist: 'Natureza_Sounds',
    credits: 'Por Natureza_Sounds en Pixabay',
    tags: ['nature', 'relaxing', 'ambient'],
    duration: '8:00'
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