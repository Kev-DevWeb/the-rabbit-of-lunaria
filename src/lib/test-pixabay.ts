// Utilidad para probar URLs de Pixabay Music
// Uso: Ejecutar en consola del navegador

export const testPixabayURLs = async () => {
  const urls = [
    'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
    'https://cdn.pixabay.com/audio/2022/03/10/audio_e2b6c6676f.mp3',
    'https://cdn.pixabay.com/audio/2023/09/26/audio_d0c8a15b78.mp3'
  ];

  console.log('🎵 Probando URLs de Pixabay Music...\n');

  for (const url of urls) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        console.log(`✅ ${url} - OK`);
      } else {
        console.log(`❌ ${url} - Error ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${url} - Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  console.log('\n🚀 Prueba completada!');
};

// Para usar en la consola del navegador:
// testPixabayURLs();

export const createTestAudio = (url: string) => {
  const audio = new Audio(url);
  audio.crossOrigin = 'anonymous';
  
  audio.addEventListener('canplay', () => {
    console.log(`✅ Audio listo: ${url}`);
  });
  
  audio.addEventListener('error', (e) => {
    console.log(`❌ Error en audio: ${url}`, e);
  });
  
  return audio;
};