// API de Pixabay para obtener música libre de derechos dinámicamente
// API key gratuita: https://pixabay.com/accounts/register/
// Documentación: https://pixabay.com/api/docs/

export interface PixabayAudioTrack {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  duration: number;
  picture_id: string;
  user_id: number;
  user: string;
  size_url: string;
  download_url: string;
  name: string;
}

interface PixabayAudioResponse {
  total: number;
  totalHits: number;
  hits: PixabayAudioTrack[];
}

// Nota: Pixabay no tiene API de música disponible públicamente
// Usaremos archivos locales que ya funcionan
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY || '';
const PIXABAY_MUSIC_FALLBACK = true; // Activar modo fallback

// Categorías de música para diferentes secciones
export const musicCategories = {
  mystical: ['ambient', 'meditation', 'mystical', 'spiritual', 'new age'],
  study: ['lofi', 'piano', 'classical', 'ambient', 'focus'],
  relaxing: ['chill', 'peaceful', 'calm', 'soft', 'gentle'],
  atmospheric: ['atmospheric', 'cinematic', 'dark ambient', 'mystery']
};

export async function fetchPixabayMusic(category: keyof typeof musicCategories, perPage: number = 20): Promise<PixabayAudioTrack[]> {
  try {
    // Pixabay no tiene API de música disponible, devolver array vacío
    // para que el sistema use las pistas de fallback locales
    console.log(`🎵 Pixabay API no disponible para música, usando fallback local para categoria: ${category}`);
    return [];
  } catch (error) {
    console.error('❌ Error obteniendo música de Pixabay:', error);
    return [];
  }
}

// Función para convertir pistas de Pixabay al formato de nuestro reproductor
export function convertPixabayToMusicTrack(pixabayTrack: PixabayAudioTrack) {
  return {
    src: pixabayTrack.download_url || pixabayTrack.size_url,
    title: pixabayTrack.name || `Track ${pixabayTrack.id}`,
    artist: pixabayTrack.user,
    credits: 'Pixabay Music - Royalty Free',
    license: 'Pixabay Content License',
    tags: pixabayTrack.tags.split(', '),
    duration: `${Math.floor(pixabayTrack.duration / 60)}:${(pixabayTrack.duration % 60).toString().padStart(2, '0')}`,
    albumUrl: pixabayTrack.pageURL
  };
}

// URLs de ejemplo que funcionan (para fallback)
export const pixabayFallbackTracks = [
  {
    src: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    title: 'Lofi Study',
    artist: 'Coma-Media',
    credits: 'Pixabay Music',
    license: 'Pixabay License',
    tags: ['lofi', 'study'],
    duration: '1:48'
  },
  {
    src: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=deep-meditation-192828.mp3',
    title: 'Deep Meditation',
    artist: 'SergePavkinMusic',
    credits: 'Pixabay Music',
    license: 'Pixabay License',
    tags: ['meditation', 'ambient'],
    duration: '4:31'
  }
];