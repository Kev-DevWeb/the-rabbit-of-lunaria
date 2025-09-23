# 🎵 **Guía Completa del Sistema de Playlists**

## 📱 **Cómo Usar las Playlists**

### **Selector de Playlist**
- **Icono actual**: El emoji en el control de música muestra la playlist activa
- **Menú desplegable**: Haz clic en el icono para ver todas las playlists disponibles
- **Cambio automático**: Al seleccionar una playlist, la música cambia inmediatamente

### **Playlists Disponibles**

#### 🔮 **Lectura de Tarot**
- **Propósito**: Sesiones de tarot y adivinación
- **Características**: Música mística, atmosférica, que favorece la concentración
- **Pistas**: Mystical Forest, Mystic Ambient, Celtic Dream, Magic Spell, Ancient Wisdom

#### 🧘‍♀️ **Meditación**
- **Propósito**: Meditación profunda y relajación
- **Características**: Sonidos calmantes, frecuencias relajantes
- **Pistas**: Meditation Music, Ambient Meditation, Deep Relaxation, Cosmic Journey

#### 🌙 **Energía Lunar**
- **Propósito**: Rituales nocturnos y conexión con la luna
- **Características**: Música nocturna, atmosferas lunares
- **Pistas**: Moonlight Serenity, Lunar Whispers

#### ✨ **Místico General**
- **Propósito**: Ambiente místico para cualquier actividad espiritual
- **Características**: Selección amplia de música mística
- **Pistas**: Todas las canciones con temática mística

#### 💚 **Sanación y Energía**
- **Propósito**: Trabajo energético y sanación espiritual
- **Características**: Frecuencias sanadoras, música terapéutica
- **Pistas**: Enfoque en healing, zen, y equilibrio

#### 🌿 **Conexión Natural**
- **Propósito**: Conectar con la naturaleza y los elementos
- **Características**: Sonidos naturales, música orgánica
- **Pistas**: Forest Spirits y música con elementos naturales

#### 🎵 **Todas las Pistas**
- **Propósito**: Reproducción completa de la colección
- **Características**: Rotación por toda la música disponible

## 🎮 **Controles Disponibles**

### **Selector de Playlist** (Emoji)
- Clic para abrir menú de playlists
- El icono cambia según la playlist activa

### **Controles de Pista** (← →)
- Solo aparecen si hay múltiples pistas en la playlist
- Navegación manual entre canciones

### **Información** (🎵)
- Muestra título, artista, créditos
- Indica playlist actual y posición

### **Volumen** (🔊/🔇)
- Activar/silenciar música
- Efectos de fade in/out

## 📝 **Características Técnicas**

### **Streaming Inteligente**
- Música transmitida directamente desde Pixabay
- Sin descargas - carga instantánea
- Cambio automático de pista al final

### **Manejo de Errores**
- Si una URL falla, pasa automáticamente a la siguiente
- Sistema de reintentos integrado
- Logs de debug en consola

### **Persistencia**
- La playlist seleccionada se mantiene durante la sesión
- Posición de pista conservada al cambiar playlist
- Configuración de volumen persistente

## 🔧 **Agregar Nueva Música**

### **1. Encontrar URLs de Pixabay**
```typescript
// Ir a https://pixabay.com/music/
// Buscar: "mystical", "ambient", "meditation", etc.
// Copiar URL directa del MP3
```

### **2. Agregar al Array**
```typescript
{
  src: 'https://cdn.pixabay.com/audio/YYYY/MM/DD/audio_XXXXXX.mp3',
  title: 'Nombre de la Pista',
  artist: 'Artista_Pixabay',
  credits: 'Por Artista_Pixabay en Pixabay',
  tags: ['etiqueta1', 'etiqueta2', 'temática'],
  duration: 'MM:SS'
}
```

### **3. Configurar Etiquetas**
- `tarot`: Para lecturas de cartas
- `meditation`: Para meditación
- `night/lunar/moon`: Para rituales lunares
- `healing`: Para sanación
- `nature/forest`: Para conexión natural
- `mystical/mystic`: Para ambiente general

## 🎯 **Recomendaciones de Uso**

### **Por Contexto:**
- **Lectura de Tarot**: Playlist "🔮 Lectura de Tarot"
- **Meditación matutina**: Playlist "🧘‍♀️ Meditación"  
- **Rituales de luna llena**: Playlist "🌙 Energía Lunar"
- **Navegación general**: Playlist "✨ Místico General"
- **Trabajo energético**: Playlist "💚 Sanación y Energía"

### **Flujo Sugerido:**
1. Entrar al sitio → Música en modo silencioso
2. Seleccionar actividad → Cambiar a playlist apropiada
3. Activar música → Disfrutar la experiencia
4. Cambiar contexto → Seleccionar nueva playlist

## 🚀 **Próximas Funciones**

- [ ] Playlist personalizada por usuario
- [ ] Reproducción aleatoria vs secuencial
- [ ] Control de volumen granular
- [ ] Favoritos individuales
- [ ] Modo bucle de pista
- [ ] Visualización de espectro de audio