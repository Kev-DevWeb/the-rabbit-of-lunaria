// Jamendo API para música libre de derechos con soporte CORS completo
// API Docs: https://developer.jamendo.com/v3.0/docs
// Registro: https://devportal.jamendo.com/

export interface JamendoTrack {
  id: string;
  name: string;
  duration: string;
  artist_name: string;
  artist_idstr: string;
  album_name: string;
  album_id: string;
  license_ccurl: string;
  position: number;
  releasedate: string;
  album_image: string;
  audio: string;
  audiodownload: string;
  prourl: string;
  shorturl: string;
  shareurl: string;
  waveform: string;
  acousticbrainz_id: string;
  musicbrainz_id: string;
}

export interface JamendoResponse {
  headers: {
    status: string;
    code: number;
    error_message: string;
    warnings: string;
    results_count: number;
  };
  results: JamendoTrack[];
}

// Configuración de la API
const JAMENDO_API_BASE = 'https://api.jamendo.com/v3.0';
const JAMENDO_CLIENT_ID = process.env.NEXT_PUBLIC_JAMENDO_CLIENT_ID || 'YOUR_CLIENT_ID';

// Categorías y tags para diferentes tipos de música
// mystical: Para toda la página (excepto grimorio)
// study: Para el grimorio (artículos y autores)
export const jamendoCategories = {
  mystical: {
    tags: 'ambient,meditation,mystical,newage,atmospheric',
    acoustictags: 'calm,peaceful,spiritual',
    genre: 'ambient'
  },
  study: {
    tags: 'instrumental,piano,classical,focus,lofi',
    acoustictags: 'calm,peaceful,happy',
    genre: 'classical'
  }
};

// IDs específicos de tracks que te gustan de Jamendo
// mystical: Para toda la página (excepto grimorio) 
// study: Para el grimorio (artículos y autores)
export const customJamendoTracks = {
  mystical: [
    '1416550', '1588568', '1532813', '1343800', '1901440', '516471', '1163742', '455743'
  ],
  study: [
    '1954189', '2208903', '2204826', '2206240', '1931247', '1861777', '2257436', '2257436','1864302','1862242'
  ]
};

// Función para obtener tracks específicos por IDs
export async function fetchJamendoTracksByIds(trackIds: string[]): Promise<JamendoTrack[]> {
  try {
    if (!JAMENDO_CLIENT_ID || JAMENDO_CLIENT_ID === 'YOUR_CLIENT_ID') {
      console.warn('⚠️ No se encontró Client ID de Jamendo');
      return [];
    }

    if (trackIds.length === 0) {
      return [];
    }

    const params = new URLSearchParams({
      client_id: JAMENDO_CLIENT_ID,
      format: 'json',
      include: 'musicinfo'
    });

    // Agregar cada ID como parámetro separado
    trackIds.forEach(id => {
      params.append('id', id);
    });

    const url = `${JAMENDO_API_BASE}/tracks/?${params}`;
    console.log(`🎯 Obteniendo tracks específicos de Jamendo: ${trackIds.join(', ')}`);
    console.log(`🔗 URL específica de Jamendo: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Jamendo API error: ${response.status}`);
    }

    const data: JamendoResponse = await response.json();
    
    if (data.headers.code !== 0) {
      throw new Error(`Jamendo API error: ${data.headers.error_message}`);
    }

    console.log(`✅ ${data.results.length} tracks específicos obtenidos de Jamendo`);
    return data.results;
    
  } catch (error) {
    console.error('❌ Error obteniendo tracks específicos de Jamendo:', error);
    return [];
  }
}

// Función principal para buscar música en Jamendo
export async function fetchJamendoMusic(
  category: keyof typeof jamendoCategories, 
  limit: number = 20
): Promise<JamendoTrack[]> {
  try {
    if (!JAMENDO_CLIENT_ID || JAMENDO_CLIENT_ID === 'YOUR_CLIENT_ID') {
      console.warn('⚠️ No se encontró Client ID de Jamendo');
      return [];
    }

    // Primero intentar obtener tus tracks personalizados
    const customTracks = customJamendoTracks[category] || [];
    if (customTracks.length > 0) {
      console.log(`🎯 Usando tracks personalizados para ${category}`);
      const specificTracks = await fetchJamendoTracksByIds(customTracks);
      if (specificTracks.length > 0) {
        return specificTracks;
      } else {
        console.warn(`⚠️ No se pudieron cargar tracks específicos, usando fallback local para mantener coherencia`);
        return []; // Esto hará que use los fallback locales
      }
    }

    // Si no hay tracks personalizados, buscar por tags como antes
    const categoryConfig = jamendoCategories[category];
    
    // Buscar por tags específicos para mantener coherencia
    const params = new URLSearchParams({
      client_id: JAMENDO_CLIENT_ID,
      format: 'json',
      limit: limit.toString(),
      tags: categoryConfig.tags,
      include: 'musicinfo',
      audioformat: 'mp3',
      order: 'popularity_week'
    });

    const url = `${JAMENDO_API_BASE}/tracks/?${params}`;
    console.log(`🎵 Buscando música en Jamendo para categoria: ${category}`);
    console.log(`🔗 URL de Jamendo: ${url}`);
    
    const response = await fetch(url);
    
    console.log(`📊 Respuesta de Jamendo - Status: ${response.status}, OK: ${response.ok}`);
    
    if (!response.ok) {
      console.error(`❌ Error HTTP de Jamendo: ${response.status} ${response.statusText}`);
      throw new Error(`Jamendo API error: ${response.status}`);
    }

    const data: JamendoResponse = await response.json();
    console.log(`📊 Datos de Jamendo recibidos:`, data);
    
    if (data.headers.code !== 0) {
      console.error(`❌ Error en headers de Jamendo: ${data.headers.error_message}`);
      throw new Error(`Jamendo API error: ${data.headers.error_message}`);
    }

    console.log(`✅ ${data.results.length} pistas obtenidas de Jamendo para categoria: ${category} (búsqueda por tags)`);
    
    // Log de las primeras pistas para debug
    if (data.results.length > 0) {
      console.log(`🎵 Primera pista de ejemplo (tags ${categoryConfig.tags}):`, data.results[0]);
    }
    
    return data.results;
    
  } catch (error) {
    console.error('❌ Error obteniendo música de Jamendo:', error);
    return [];
  }
}

// Función para convertir track de Jamendo a nuestro formato
export function convertJamendoToMusicTrack(jamendoTrack: JamendoTrack) {
  return {
    src: jamendoTrack.audio,
    title: jamendoTrack.name,
    artist: jamendoTrack.artist_name,
    credits: `${jamendoTrack.artist_name} - ${jamendoTrack.album_name}`,
    license: jamendoTrack.license_ccurl || 'Creative Commons',
    tags: ['jamendo', 'libre'],
    duration: formatDuration(parseInt(jamendoTrack.duration)),
    albumImage: jamendoTrack.album_image,
    shareUrl: jamendoTrack.shareurl
  };
}

// Función para formatear duración de segundos a mm:ss
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Pistas de fallback en caso de que falle la API
export const jamendoFallbackTracks = [
  {
    src: '/musicafondo.mp3',
    title: 'Música de Fondo Local',
    artist: 'El Conejo de Lunaria',
    credits: 'Audio Local - El Conejo de Lunaria',
    license: 'Libre',
    tags: ['local', 'fallback', 'mystical'],
    duration: '3:00',
  },
  {
    src: '/night.mp3',
    title: 'Noche Mágica Local',
    artist: 'El Conejo de Lunaria',
    credits: 'Audio Local - El Conejo de Lunaria',
    license: 'Libre',
    tags: ['local', 'fallback', 'night'],
    duration: '2:30',
  },
  {
    src: '/night.wav',
    title: 'Susurros Nocturnos Local',
    artist: 'El Conejo de Lunaria',
    credits: 'Audio Local - El Conejo de Lunaria',
    license: 'Libre',
    tags: ['local', 'fallback', 'ambient'],
    duration: '2:45',
  }
];