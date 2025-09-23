// Sistema de playlists simplificado usando solo archivos locales
// Esto garantiza que la música funcione sin problemas de CORS

export interface MusicTrack {
  src: string;
  title: string;
  artist: string;
  credits: string;
  license: string;
  tags: string[];
  duration?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  icon: string;
  tracks: MusicTrack[];
}

// PLAYLIST GENERAL - Página principal y secciones generales
export const webpagePlaylist: MusicTrack[] = [
  {
    src: '/musicafondo.mp3',
    title: 'Música de Fondo',
    artist: 'El Conejo de Lunaria',
    credits: 'Música Atmosférica - El Conejo de Lunaria',
    license: 'Libre',
    tags: ['mystical', 'ambient', 'atmospheric'],
    duration: '3:00',
  },
  {
    src: '/night.mp3',
    title: 'Noche Mágica',
    artist: 'El Conejo de Lunaria',
    credits: 'Sonidos de la Noche - El Conejo de Lunaria',
    license: 'Libre',
    tags: ['night', 'mystical', 'magical'],
    duration: '2:30',
  },
  {
    src: '/night.wav',
    title: 'Susurros Nocturnos',
    artist: 'El Conejo de Lunaria',
    credits: 'Sonidos Ambientales - El Conejo de Lunaria',
    license: 'Libre',
    tags: ['night', 'ambient', 'mystical', 'wav'],
    duration: '2:45',
  }
];

// PLAYLIST GRIMORIO - Artículos y contenido de estudio
export const grimoirePlaylist: MusicTrack[] = [
  {
    src: '/musicafondo.mp3',
    title: 'Estudio Místico',
    artist: 'El Conejo de Lunaria',
    credits: 'Música de Concentración - El Conejo de Lunaria',
    license: 'Libre',
    tags: ['study', 'focus', 'mystical', 'reading'],
    duration: '3:00',
  },
  {
    src: '/night.wav',
    title: 'Contemplación Nocturna',
    artist: 'El Conejo de Lunaria',
    credits: 'Sonidos para la Reflexión - El Conejo de Lunaria',
    license: 'Libre',
    tags: ['contemplation', 'study', 'ambient', 'night'],
    duration: '2:45',
  },
  {
    src: '/night.mp3',
    title: 'Lectura de Cartas',
    artist: 'El Conejo de Lunaria',
    credits: 'Música para Lecturas - El Conejo de Lunaria',
    license: 'Libre',
    tags: ['tarot', 'reading', 'mystical', 'focus'],
    duration: '2:30',
  }
];

// Configuración de playlists
export const musicPlaylists: Playlist[] = [
  {
    id: 'webpage',
    name: 'Música General',
    description: 'Música atmosférica para navegar por el sitio',
    icon: '🎵',
    tracks: webpagePlaylist
  },
  {
    id: 'grimoire',
    name: 'Grimorio',
    description: 'Música de concentración para leer artículos',
    icon: '📚',
    tracks: grimoirePlaylist
  }
];

// Función para obtener playlist por ruta
export function getPlaylistByRoute(pathname: string): Playlist {
  if (pathname.startsWith('/articulos') || pathname.startsWith('/autores')) {
    return musicPlaylists[1]; // grimoire
  }
  return musicPlaylists[0]; // webpage (default)
}

// Función para obtener una pista por defecto
export function getDefaultTrack(): MusicTrack {
  return webpagePlaylist[0]; // Música de Fondo
}