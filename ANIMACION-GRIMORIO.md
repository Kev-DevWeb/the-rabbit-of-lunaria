# 📚 Documentación: Animación del Grimorio en MainPage

## 🎨 Cambios Implementados

### 1. **Reemplazo de Imágenes Lun### 🎯 Elementos de la Composición

### Orden de capas (superpuestas con z-index - TAMAÑO GRANDE):
1. **Partículas estelares** (fondo de la página)
2. **Luna** (CELL_Luna.png) - z-index: 0 (capa base) - 320x320px
3. **Conejo** (CELL_Conejo.png) - z-index: 10 - 300x300px - **SUPERPUESTO sobre la luna**
4. **Grimorio** (CELL X_Grimorio.png) - z-index: 20 - 220x220px - **SUPERPUESTO sobre el conejo**, interactivo
5. **Estrellas decorativas** (estrella.svg) - 80x80px (izq) y 60x60px (der)
6. **Texto principal** - Posicionado al 65% (más abajo para no tapar imágenes)

**IMPORTANTE**: Todos los elementos (Luna, Conejo, Grimorio) están **centrados en el mismo punto** y se superponen usando capas z-index, NO están separados verticalmente.o**
- ❌ **Antes**: `lunallena.svg` y `rabbit.svg`
- ✅ **Ahora**: `CELL_Luna.png` y `CELL_Conejo.png`

### 2. **Nueva Imagen del Grimorio**
- **Ubicación**: Superpuesto sobre el conejo (capas z-index)
- **Archivo inicial**: `CELL 1_Grimorio.png`
- **Tamaño**: 150x150px
- **Efecto hover**: Escala 105% al pasar el mouse

### Composición actualizada (CAPAS SUPERPUESTAS - TAMAÑO GRANDE):
- **Contenedor**: 384x384px (w-96 h-96) - cuadrado grande
- **Capa 1 (fondo)**: Luna 320x320px
- **Capa 2 (medio)**: Conejo 300x300px - SUPERPUESTO sobre la luna
- **Capa 3 (frente)**: Grimorio 220x220px - SUPERPUESTO sobre el conejo
- **Todos centrados** en el mismo punto usando `flex items-center justify-center`
- **Posición del texto**: Movido al 65% de altura para no tapar las imágenes

### 3. **Animación de Frames del Grimorio**

#### Funcionamiento:
```
Al pasar el mouse sobre el grimorio:
  - Inicia loop de animación
  - Cambia de CELL 1_Grimorio.png → CELL 10_Grimorio.png
  - Velocidad: 100ms por frame (10 FPS)
  - Se repite infinitamente mientras el cursor esté encima

Al quitar el mouse:
  - Detiene la animación
  - Vuelve a CELL 1_Grimorio.png
```

#### Archivos de frames utilizados:
- `CELL 1_Grimorio.png`
- `CELL 2_Grimorio.png`
- `CELL 3_Grimorio.png`
- `CELL 4_Grimorio.png`
- `CELL 5_Grimorio.png`
- `CELL 6_Grimorio.png`
- `CELL 7_Grimorio.png`
- `CELL 8_Grimorio.png`
- `CELL 9_Grimorio.png`
- `CELL 10_Grimorio.png`

### 4. **Nuevo Favicon**
- **Fuente**: `Plantilla diseño.png`
- **Conversión**: PNG → ICO (32x32)
- **Ubicación**: `src/app/favicon.ico`

#### Iconos adicionales creados:
- `src/app/icon.png` (192x192) - Para PWA/Android
- `src/app/apple-icon.png` (180x180) - Para dispositivos Apple

---

## 🔧 Implementación Técnica

### Archivo modificado:
`src/components/MagicHeroSection.tsx`

### Estado de React para animación:
```tsx
const [currentFrame, setCurrentFrame] = useState(1);
const [isHovering, setIsHovering] = useState(false);
const animationRef = useRef<NodeJS.Timeout | null>(null);
```

### Loop de animación:
```tsx
useEffect(() => {
  if (isHovering) {
    animationRef.current = setInterval(() => {
      setCurrentFrame((prev) => (prev >= 10 ? 1 : prev + 1));
    }, 100);
  } else {
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }
    setCurrentFrame(1);
  }
  return () => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }
  };
}, [isHovering]);
```

### Handlers de eventos:
```tsx
onMouseEnter={() => setIsHovering(true)}
onMouseLeave={() => setIsHovering(false)}
```

---

## 📱 Características

### Interactividad:
- ✅ **Hover detection**: Detecta cuando el cursor está sobre el grimorio
- ✅ **Loop infinito**: La animación se repite mientras el mouse esté encima
- ✅ **Reset automático**: Vuelve al frame 1 al quitar el cursor
- ✅ **Cleanup**: Limpia el interval al desmontar el componente

### Rendimiento:
- ✅ **60 FPS en partículas** de fondo
- ✅ **10 FPS en animación** del grimorio (óptimo para pixel art)
- ✅ **Preloading con Next.js Image**: Las imágenes se cargan de forma optimizada

### Responsive:
- ✅ Mantiene las mismas posiciones responsive que antes
- ✅ El grimorio tiene `pointer-events-auto` para interactividad
- ✅ El resto de elementos mantienen `pointer-events-none`

---

## 🎯 Elementos de la Composición

### Orden de capas (de atrás hacia adelante):
1. **Partículas estelares** (fondo)
2. **Luna** (CELL_Luna.png)
3. **Conejo** (CELL_Conejo.png) - dentro de la luna
4. **Grimorio** (CELL X_Grimorio.png) - arriba del conejo, interactivo
5. **Estrellas decorativas** (estrella.svg)
6. **Texto principal**

### Posiciones (TAMAÑO GRANDE):
- **Contenedor principal**: 384x384px (w-96 h-96) - cuadrado grande centrado
- **Posición vertical**: 15% desde arriba (más prominente)
- **Todos los elementos**: Centrados en el mismo punto usando Flexbox
  - `absolute inset-0 flex items-center justify-center`
- **Luna**: Capa base (z-0), 320x320px
- **Conejo**: Capa media (z-10), 300x300px, centrado sobre la luna
- **Grimorio**: Capa frontal (z-20), 220x220px, centrado sobre el conejo
- **Estrellas decorativas**: 
  - Izquierda: `top-[40%] left-[20%]` (80x80px) - más grandes
  - Derecha: `top-[35%] right-[20%]` (60x60px) - más grandes
- **Texto principal**: `top-[65%]` - movido más abajo para no tapar las imágenes
  - Títulos: text-3xl → text-6xl (responsive)
  - Subtítulo: text-xl → text-3xl (responsive)
  - Sombra más prominente para mejor legibilidad

**Técnica de superposición**: Usando `position: absolute` con `inset-0` y `flex center` para superponer perfectamente todos los elementos en el mismo punto.

---

## 🚀 Para Probar

1. **Recarga la página** para ver el nuevo favicon
2. **Observa la composición en CAPAS SUPERPUESTAS**: 
   - Luna (fondo)
   - Conejo (medio) - superpuesto sobre la luna
   - Grimorio (frente) - superpuesto sobre el conejo
3. **Todos centrados en el mismo punto** - NO separados verticalmente
4. **Pasa el mouse sobre el grimorio** (al centro) para ver la animación
5. **Quita el cursor** para ver que vuelve al frame inicial

**Composición visual inspirada en la imagen de referencia:**
```
        ╔═══════════════╗
        ║  🌕 (fondo)   ║
        ║   🐰 (medio)  ║  <- Superpuestos
        ║  📖 (frente)  ║  <- en capas
        ╚═══════════════╝
          (centrados)
```

**NO es una disposición vertical**, es una **superposición de capas** como en tu imagen de referencia.

---

## 🔄 Mantenimiento

### Para cambiar la velocidad de animación:
Modifica el valor en `setInterval`:
```tsx
setInterval(() => { ... }, 100); // 100ms = 10 FPS
// Valores sugeridos: 50ms (20 FPS), 75ms (13 FPS), 150ms (6.6 FPS)
```

### Para agregar más frames:
1. Agrega más archivos `CELL XX_Grimorio.png` en `/public`
2. Cambia el límite en el código:
```tsx
setCurrentFrame((prev) => (prev >= 10 ? 1 : prev + 1));
//                              ^^
// Cambia este número al total de frames
```

---

## 📝 Notas

- El grimorio es **clickeable** aunque actualmente solo tiene efecto hover
- Se puede agregar funcionalidad `onClick` para abrir el grimorio/artículos
- La animación usa `setInterval` en lugar de `requestAnimationFrame` para mantener velocidad constante
- El cleanup del interval evita memory leaks

---

## ✨ Efectos Visuales

### Luna:
- Drop shadow: `0 0 20px rgba(255, 255, 255, 0.5)`
- Animación GSAP: Elastic ease-out al aparecer

### Grimorio:
- Transición de escala: `hover:scale-110`
- Duración: `200ms`
- Animación de frames al hover

### Estrellas:
- Aparición escalonada (stagger 0.3s)
- Elastic ease-out

---

**Fecha de implementación**: 3 de octubre de 2025
**Componente**: `MagicHeroSection.tsx`
**Assets utilizados**: CELL_Luna.png, CELL_Conejo.png, CELL 1-10_Grimorio.png, Plantilla diseño.png
