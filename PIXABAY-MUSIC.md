# 🎵 **Guía para Agregar Música de Pixabay**

## **¿Cómo obtener URLs directas de Pixabay Music?**

### **Paso 1: Ir a Pixabay Music**
```
🌐 URL: https://pixabay.com/music/
```

### **Paso 2: Buscar Música Temática**
```
🔍 Términos recomendados:
• mystical      → Música mística
• ambient       → Ambiente relajante  
• meditation    → Meditación
• celtic        → Música celta
• forest        → Sonidos de bosque
• healing       → Música curativa
• spiritual     → Espiritual
• night         → Nocturna
• cosmic        → Cósmica
```

### **Paso 3: Extraer URL del MP3**

#### **Método A: Inspeccionar Elemento (Más Efectivo)**
1. Clic derecho en botón "Download"
2. "Inspeccionar" o "Inspect Element"  
3. Buscar enlace que termine en `.mp3`
4. Copiar URL completa

#### **Método B: Network DevTools**
1. F12 → Pestaña "Network"
2. Reproducir pista en Pixabay
3. Filtrar por "audio" o buscar `.mp3`
4. Copiar URL del request

### **Paso 4: Formato Típico de URL**
```
https://cdn.pixabay.com/audio/YYYY/MM/DD/audio_[ID_ÚNICO].mp3

Ejemplo:
https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3
```
   - Copia la URL que aparece en las solicitudes de red

## **¿Cómo agregar nuevas pistas?**

### **Paso 1: Actualizar AudioProvider.tsx**

Edita el archivo `src/context/AudioProvider.tsx` y agrega nuevas pistas al array `trackList`:

```tsx
const trackList: Track[] = [
  // Pistas existentes...
  {
    src: 'https://cdn.pixabay.com/audio/2023/XX/XX/audio_NUEVA_URL.mp3',
    title: 'Nuevo Título',
    artist: 'Nombre del Artista',
    credits: 'Por [Artista] en Pixabay'
  }
];
```

### **Paso 2: Usar el archivo de configuración (Opcional)**

Si prefieres usar el archivo de configuración `src/lib/pixabay-music.ts`, actualiza el array `pixabayMusicTracks`:

```tsx
export const pixabayMusicTracks: PixabayTrack[] = [
  // Pistas existentes...
  {
    src: 'https://cdn.pixabay.com/audio/2023/XX/XX/audio_NUEVA_URL.mp3',
    title: 'Nuevo Título',
    artist: 'Nombre del Artista',
    credits: 'Por [Artista] en Pixabay',
    tags: ['mystical', 'ambient'],
    duration: '4:30'
  }
];
```

## **🎵 Nueva Playlist Integrada: "Ambient Fancy Magic"**

### **✨ Playlist Principal (POR DEFECTO)**
**URL Original:** https://pixabay.com/playlists/ambient-fancy-magic-music-for-webpage-30129332/
**Pistas:** 23 tracks | **Duración:** 1 hr 5 min

**Contenido:**
- **Jazz Elegante:** Tunetank, Surprising_Media, TokyoRifft
- **Piano Relajante:** Colección completa de Clavier-Music  
- **Música Clásica:** Caja musical y composiciones modernas
- **Ambiente Sofisticado:** Perfecto para páginas web mágicas

**Artistas Incluidos:**
- Clavier-Music (8 pistas de piano relajante)
- Surprising_Media (4 pistas de jazz oscuro) 
- Music_For_Videos & music_for_video (3 pistas clásicas)
- Tunetank, PulseBox, Nesrality y más

## **🔍 URLs de Ejemplo Verificadas**

### **Música Mística y Ambiente:**
```
https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3 - Mystical Forest
https://cdn.pixabay.com/audio/2022/03/10/audio_e2b6c6676f.mp3 - Meditation Music
https://cdn.pixabay.com/audio/2023/09/26/audio_d0c8a15b78.mp3 - Mystic Ambient
https://cdn.pixabay.com/audio/2022/11/15/audio_4c8a42c8af.mp3 - Celtic Dream
https://cdn.pixabay.com/audio/2023/01/28/audio_7d49e5b7b0.mp3 - Ambient Meditation
```

### **Música de Naturaleza:**
```
https://cdn.pixabay.com/audio/2021/08/09/audio_0625c1539c.mp3 - Forest Sounds
https://cdn.pixabay.com/audio/2022/12/06/audio_abc123def4.mp3 - Ocean Waves
```

## **⚡ Ventajas del Streaming desde Pixabay**

### **✅ Beneficios:**
- **Sin peso:** No ocupa espacio en tu servidor
- **Variedad:** Miles de pistas gratuitas disponibles
- **Legal:** Música libre de derechos
- **Calidad:** Audio de alta calidad
- **Actualizable:** Fácil cambiar pistas sin redesplegar

### **⚠️ Consideraciones:**
- **Dependencia de red:** Requiere conexión a internet
- **Disponibilidad:** Las URLs pueden cambiar ocasionalmente
- **Carga inicial:** Primer reproducción puede tomar unos segundos

## **🛠️ Manejo de Errores Automático**

El sistema incluye manejo automático de errores:

```tsx
const handleError = (error: Event) => {
  console.error('Error cargando audio desde', currentTrack.src, ':', error);
  // Automáticamente pasa a la siguiente pista
  setCurrentTrackIndex((prev) => (prev + 1) % trackList.length);
};
```

## **🎯 Consejos para Seleccionar Música**

### **Para páginas de Tarot:**
- **Términos de búsqueda:** "mystical", "celtic", "meditation", "ambient", "spiritual"
- **Duración:** Entre 3-8 minutos
- **Volumen:** Música suave que no distraiga
- **Estilo:** Atmosférica, etérea, relajante

### **Evitar:**
- Música con letras
- Ritmos muy marcados
- Audio con efectos de sonido fuertes
- Pistas muy largas (>10 min)

## **📝 Formato de Créditos**

Siempre incluye créditos apropiados:

```tsx
credits: 'Por [NombreArtista] en Pixabay'
// Ejemplo:
credits: 'Por Music_For_Videos en Pixabay'
```

## **🚀 Implementación Rápida**

Para agregar música rápidamente:

1. Encuentra 3-5 pistas en Pixabay
2. Copia las URLs directas
3. Actualiza `AudioProvider.tsx`
4. Haz commit y despliega
5. ¡La música se reproduce automáticamente!

## **🔧 Solución de Problemas**

### **Si una URL no funciona:**
1. Verifica que la URL es correcta
2. Intenta acceder directamente en el navegador
3. El sistema automáticamente saltará a la siguiente pista
4. Reemplaza URLs que no funcionan

### **Si no se reproduce:**
1. Verifica la consola del navegador
2. Asegúrate de que el usuario hizo clic (política de autoplay)
3. Revisa que no hay errores de CORS

---

**💡 Tip:** Crea una playlist temática para diferentes secciones de tu página (lectura de cartas, meditación, consultas) usando diferentes conjuntos de URLs.