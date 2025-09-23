// Configuración de música libre de Internet Archive (Free Music Archive)
// Sistema dual de playlists: General (toda la web) + Grimorio (solo artículos)
// Fuente: https://freemusicarchive.org/member/kevin-garcia-rojas/
// Todas las pistas tienen licencia Creative Commons o dominio público

export interface MusicTrack {
  src: string;
  title: string;
  artist: string;
  credits: string;
  license: string;
  tags: string[];
  duration?: string;
  albumUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  icon: string;
  tracks: MusicTrack[];
}

// PLAYLIST GENERAL - Para toda la página web (música mística y cajas musicales)
// Basada en: https://freemusicarchive.org/member/kevin-garcia-rojas/webpage/
export const webpagePlaylist: MusicTrack[] = [
  // Música relajante y ambiente mágico para toda la web
  {
    src: 'https://ia800605.us.archive.org/16/items/LoboLoco-RelaxingLounge/Lobo_Loco_-_01_-_Fog_Light_Walk_ID_1834.mp3',
    title: 'Fog Light Walk',
    artist: 'Lobo Loco',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['jazz', 'ambient', 'lounge', 'piano', 'instrumental', 'relaxing'],
    duration: '5:05',
    albumUrl: 'https://freemusicarchive.org/music/Lobo_Loco/relaxing-lounge/'
  },
  {
    src: 'https://ia800605.us.archive.org/16/items/LoboLoco-RelaxingLounge/Lobo_Loco_-_06_-_Storys_of_Wiener_Wald_ID_1839.mp3',
    title: 'Storys of Wiener Wald',
    artist: 'Lobo Loco',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['jazz', 'ambient', 'lounge', 'latin', 'piano', 'instrumental'],
    duration: '4:22',
    albumUrl: 'https://freemusicarchive.org/music/Lobo_Loco/relaxing-lounge/'
  },
  {
    src: 'https://ia600605.us.archive.org/16/items/SquireTuck-MusicalBox/Squire_Tuck_-_03_-_The_Consequences_of_Others.mp3',
    title: 'The Consequences of Others',
    artist: 'Squire Tuck',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['instrumental', 'music-box', 'mystical', 'magical'],
    duration: '2:06',
    albumUrl: 'https://freemusicarchive.org/music/Squire_Tuck/Musical_Box/'
  },
  {
    src: 'https://ia600605.us.archive.org/16/items/AlenaSmirnova-MyFilmMusic/Alena_Smirnova_-_music_box_waltz.mp3',
    title: 'Music Box Waltz',
    artist: 'Alena Smirnova',
    credits: 'Free Music Archive - CC0',
    license: 'Public Domain',
    tags: ['music-box', 'waltz', 'mystical', 'film-music'],
    duration: '0:35',
    albumUrl: 'https://freemusicarchive.org/music/alena-smirnova/my-film-music/'
  },
  {
    src: 'https://ia600605.us.archive.org/16/items/DanielBirch-AmbientVol3/Daniel_Birch_-_Music_Box_Sunshine.mp3',
    title: 'Music Box & Sunshine',
    artist: 'Daniel Birch',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['ambient', 'soundtrack', 'new-age', 'downtempo', 'instrumental'],
    duration: '3:01',
    albumUrl: 'https://freemusicarchive.org/music/Daniel_Birch/Ambient_Vol3/'
  },
  {
    src: 'https://ia600605.us.archive.org/16/items/Komiku-PoupisIncredibleAdventures/Komiku_-_46_Merfolk_Music_Box.mp3',
    title: 'Merfolk Music Box',
    artist: 'Komiku',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['folk', 'soundtrack', 'chiptune', 'instrumental', 'magical'],
    duration: '1:03',
    albumUrl: 'https://freemusicarchive.org/music/Komiku/Poupis_incredible_adventures_/'
  },
  {
    src: 'https://ia600605.us.archive.org/16/items/GregorQuendel-ClassicalMusicBox/Gregor_Quendel_-_Bach_Air_from_Orchestral_Suite_No_3_BWV_1068_Movement_2_Arr_for_Music_Box.mp3',
    title: 'Bach - Air (Music Box Arr.)',
    artist: 'Gregor Quendel',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['classical', 'music-box', 'bach', 'orchestral', 'peaceful'],
    duration: '4:14',
    albumUrl: 'https://freemusicarchive.org/music/gregor-quendel/classical-music-box/'
  },
  {
    src: 'https://ia600605.us.archive.org/16/items/GregorQuendel-ClassicalMusicBox/Gregor_Quendel_-_Ave_Maria_Bach_Gounod_for_Music_Box_and_Celesta.mp3',
    title: 'Ave Maria (Music Box)',
    artist: 'Gregor Quendel',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['classical', 'music-box', 'sacred', 'peaceful', 'spiritual'],
    duration: '3:12',
    albumUrl: 'https://freemusicarchive.org/music/gregor-quendel/classical-music-box/'
  },
  {
    src: 'https://ia600605.us.archive.org/16/items/GregorQuendel-ClassicalMusicBox/Gregor_Quendel_-_Debussy_Clair_De_Lune_Arr_for_Music_Box.mp3',
    title: 'Debussy - Clair De Lune (Music Box)',
    artist: 'Gregor Quendel',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['classical', 'music-box', 'debussy', 'lunar', 'peaceful'],
    duration: '4:45',
    albumUrl: 'https://freemusicarchive.org/music/gregor-quendel/classical-music-box/'
  },
  {
    src: 'https://ia600605.us.archive.org/16/items/GregorQuendel-ClassicalMusicBox/Gregor_Quendel_-_Beethoven_For_Elise_Arr_for_Music_Box_WoO_59.mp3',
    title: 'Beethoven - Für Elise (Music Box)',
    artist: 'Gregor Quendel',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['classical', 'music-box', 'beethoven', 'peaceful', 'nostalgic'],
    duration: '3:12',
    albumUrl: 'https://freemusicarchive.org/music/gregor-quendel/classical-music-box/'
  }
];

// PLAYLIST GRIMORIO - Para /articulos, /articulos/[slug] y /autores/[slug] (música de estudio y relajación)
// Basada en: https://freemusicarchive.org/member/kevin-garcia-rojas/grimorie/
export const grimoirePlaylist: MusicTrack[] = [
  // Música perfecta para leer, estudiar y concentrarse
  {
    src: 'https://ia800605.us.archive.org/16/items/LoboLoco-RelaxingLounge/Lobo_Loco_-_02_-_Raining_Softly_ID_1827.mp3',
    title: 'Raining Softly',
    artist: 'Lobo Loco',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['lofi', 'ambient', 'rain', 'studying', 'relaxing', 'instrumental'],
    duration: '5:20',
    albumUrl: 'https://freemusicarchive.org/music/Lobo_Loco/relaxing-lounge/'
  },
  {
    src: 'https://ia800605.us.archive.org/16/items/HoliznaPATREON-RELAX/HoliznaPATREON_-_Getting_Clean.mp3',
    title: 'Getting Clean',
    artist: 'HoliznaPATREON',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['jazz', 'chill', 'instrumental', 'studying', 'focus'],
    duration: '3:45',
    albumUrl: 'https://freemusicarchive.org/music/holiznapatreon/relax/'
  },
  {
    src: 'https://ia800605.us.archive.org/16/items/HoliznaPATREON-RELAX/HoliznaPATREON_-_DownTown.mp3',
    title: 'DownTown',
    artist: 'HoliznaPATREON',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['blues', 'jazz', 'lounge', 'chill-out', 'studying', 'urban'],
    duration: '4:12',
    albumUrl: 'https://freemusicarchive.org/music/holiznapatreon/relax/'
  },
  {
    src: 'https://ia800605.us.archive.org/16/items/HoliznaPATREON-RELAX/HoliznaPATREON_-_Moon_Beam.mp3',
    title: 'Moon Beam',
    artist: 'HoliznaPATREON',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['new-age', 'minimal', 'lunar', 'peaceful', 'studying', 'meditation'],
    duration: '3:58',
    albumUrl: 'https://freemusicarchive.org/music/holiznapatreon/relax/'
  },
  {
    src: 'https://ia800605.us.archive.org/16/items/HoliznaPATREON-RELAX/HoliznaPATREON_-_Porch_Swing.mp3',
    title: 'Porch Swing',
    artist: 'HoliznaPATREON',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['hip-hop-beats', 'chill', 'lounge', 'studying', 'relaxed'],
    duration: '3:33',
    albumUrl: 'https://freemusicarchive.org/music/holiznapatreon/relax/'
  },
  {
    src: 'https://ia800605.us.archive.org/16/items/HoliznaPATREON-RELAX/HoliznaPATREON_-_Salt_Water.mp3',
    title: 'Salt Water',
    artist: 'HoliznaPATREON',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['blues', 'jazz', 'new-age', 'ocean', 'studying', 'peaceful'],
    duration: '4:07',
    albumUrl: 'https://freemusicarchive.org/music/holiznapatreon/relax/'
  },
  {
    src: 'https://ia800605.us.archive.org/16/items/HoliznaPATREON-RELAX/HoliznaPATREON_-_Nostalgia.mp3',
    title: 'Nostalgia',
    artist: 'HoliznaPATREON',
    credits: 'Free Music Archive - CC BY',
    license: 'Creative Commons BY 4.0',
    tags: ['blues', 'jazz', 'nostalgic', 'chill-out', 'studying', 'contemplative'],
    duration: '3:29',
    albumUrl: 'https://freemusicarchive.org/music/holiznapatreon/relax/'
  },
  {
    src: 'https://ia800605.us.archive.org/16/items/HoliznaCC0-WinterLofi/HoliznaCC0_-_Fire_Place.mp3',
    title: 'Fire Place',
    artist: 'HoliznaCC0',
    credits: 'Free Music Archive - CC0',
    license: 'Public Domain',
    tags: ['lofi-hip-hop', 'chill-out', 'cozy', 'studying', 'winter', 'fireplace'],
    duration: '2:45',
    albumUrl: 'https://freemusicarchive.org/music/holiznacc0/winter-lofi/'
  },
  {
    src: 'https://ia800605.us.archive.org/16/items/HoliznaCC0-WinterLofi/HoliznaCC0_-_Snow_Drift.mp3',
    title: 'Snow Drift',
    artist: 'HoliznaCC0',
    credits: 'Free Music Archive - CC0',
    license: 'Public Domain',
    tags: ['lofi-hip-hop', 'chill-out', 'winter', 'studying', 'snow', 'peaceful'],
    duration: '2:52',
    albumUrl: 'https://freemusicarchive.org/music/holiznacc0/winter-lofi/'
  },
  {
    src: 'https://ia800605.us.archive.org/16/items/HoliznaCC0-PublicDomainLofi/HoliznaCC0_-_Tokyo_Sunset_Lofi_Peaceful_Soft.mp3',
    title: 'Tokyo Sunset (Lofi, Peaceful, Soft)',
    artist: 'HoliznaCC0',
    credits: 'Free Music Archive - CC0',
    license: 'Public Domain',
    tags: ['lofi-hip-hop', 'peaceful', 'soft', 'studying', 'sunset', 'urban'],
    duration: '2:18',
    albumUrl: 'https://freemusicarchive.org/music/holiznacc0/public-domain-lofi/'
  },
  {
    src: 'https://ia800605.us.archive.org/16/items/HoliznaCC0-PublicDomainLofi/HoliznaCC0_-_Bubbles_Lofi_Bright_Relaxed.mp3',
    title: 'Bubbles (Lofi, Bright, Relaxed)',
    artist: 'HoliznaCC0',
    credits: 'Free Music Archive - CC0',
    license: 'Public Domain',
    tags: ['lofi-hip-hop', 'bright', 'relaxed', 'studying', 'uplifting'],
    duration: '2:27',
    albumUrl: 'https://freemusicarchive.org/music/holiznacc0/public-domain-lofi/'
  }
];

// Todas las pistas disponibles (combinación de ambas playlists)
export const allFreeMusicTracks: MusicTrack[] = [
  ...webpagePlaylist,
  ...grimoirePlaylist
];

// Para mantener compatibilidad con código existente
export const ambientFancyMagicTracks: MusicTrack[] = webpagePlaylist;

export const musicPlaylists: Playlist[] = [
  {
    id: 'webpage',
    name: 'Música General',
    description: 'Música mística y cajas musicales para toda la página web',
    icon: '✨',
    tracks: webpagePlaylist
  },
  {
    id: 'grimoire',
    name: 'Grimorio de Estudio',
    description: 'Música de concentración para artículos, lecturas y estudio',
    icon: '📚',
    tracks: grimoirePlaylist
  },
  {
    id: 'mystical',
    name: 'Mística y Tarot',
    description: 'Todas las pistas místicas combinadas',
    icon: '🔮',
    tracks: allFreeMusicTracks.filter((track: MusicTrack) => 
      track.tags.includes('mystical') || 
      track.tags.includes('magical') || 
      track.tags.includes('spiritual')
    )
  }
];

// Mantener compatibilidad con código existente
export const freeMusicTracks: MusicTrack[] = webpagePlaylist;

// Función para obtener playlist según la ruta
export const getPlaylistByRoute = (pathname: string): MusicTrack[] => {
  // Si está en /articulos, /articulos/[slug] o /autores/[slug], usar grimorio
  if (pathname.startsWith('/articulos') || pathname.startsWith('/autores')) {
    return grimoirePlaylist;
  }
  // Para todas las demás rutas, usar playlist general
  return webpagePlaylist;
};

// Funciones utilitarias
export const getTracksByTag = (tag: string): MusicTrack[] => {
  return allFreeMusicTracks.filter((track: MusicTrack) => 
    track.tags.some((t: string) => t.toLowerCase().includes(tag.toLowerCase()))
  );
};

export const getRandomTrack = (playlist?: MusicTrack[]): MusicTrack => {
  const tracks = playlist || webpagePlaylist;
  return tracks[Math.floor(Math.random() * tracks.length)];
};

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
  webpagePlaylist[0], // Fog Light Walk
  grimoirePlaylist[0]  // Raining Softly
];

// Configuración de streaming
export const streamingConfig = {
  preload: 'auto' as 'auto' | 'metadata' | 'none',
  crossOrigin: 'anonymous' as 'anonymous' | 'use-credentials',
  volume: 0.7,
  fadeInDuration: 2000,
  fadeOutDuration: 1500,
  autoLoop: true, // Nueva configuración para loop automático
  shuffleMode: true
};