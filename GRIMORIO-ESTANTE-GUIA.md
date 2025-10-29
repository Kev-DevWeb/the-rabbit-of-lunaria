# 📚 DISEÑO DEL GRIMORIO - Guía Comparativa

## 🔄 Cambios Implementados

### 1. **Solución al Scroll de Sanity Studio** ✅

**Problema:** Lenis (smooth scroll) capturaba los eventos del mouse wheel en Sanity Studio.

**Solución aplicada:**
- **LenisProvider actualizado** (`src/context/LenisProvider.tsx`):
  - Detecta si estamos en `/studio`
  - Desactiva Lenis completamente en Studio
  - Añade función `prevent` para excluir elementos Sanity
  
- **CSS mejorado** (`src/sanity/studio.css`):
  - Fuerza scroll nativo en elementos Sanity
  - `overscroll-behavior: contain` en editores

**Resultado:** Ahora puedes usar la rueda del ratón normalmente en Sanity Studio.

---

## 📖 Dos Diseños Disponibles

### **Diseño 1: Índice Tradicional** (Original)
📁 `src/components/ArticulosContent.tsx`

#### Características:
- ✅ Estilo índice de libro antiguo
- ✅ Categorías anidadas con sangría progresiva (hasta 8 niveles)
- ✅ Líneas punteadas tipo índice
- ✅ Vista de lista compacta
- ✅ Muestra imagen miniatura de cada artículo

#### Ideal para:
- Muchos artículos por categoría
- Lectura rápida de títulos
- Navegación tipo tabla de contenidos

#### Problema en móvil:
- ❌ Con 5+ categorías hijas, el texto se comprime
- ❌ Difícil de leer en pantallas pequeñas
- ❌ Mucho scroll vertical

---

### **Diseño 2: Estante de Libros** ⭐ (NUEVO - Recomendado)
📁 `src/components/BookshelfGrimorio.tsx`

#### Características:
- ✅ **Libros en 3D** con efecto de lomo
- ✅ **Colores por categoría raíz** (mismo tomo = mismo color)
  - Ejemplo: Todos los artículos de "Tarot" serán rojos
  - Subcategorías mantienen el color del padre
- ✅ **Hover interactivo:**
  - El libro se eleva
  - Tooltip con info completa
- ✅ **Estantes de madera** realistas
- ✅ **Responsive perfecto:**
  - Móvil: 10px ancho de libro
  - Tablet: 12px ancho
  - Desktop: ajuste automático
- ✅ **Animaciones GSAP:**
  - Estantes aparecen con stagger
  - Libros saltan al entrar
- ✅ **10 colores de libros** antiguos predefinidos

#### Sistema de Colores:
```javascript
const bookColors = [
  '#7c2d12', // Marrón rojizo - ej: Tarot
  '#064e3b', // Verde esmeralda - ej: Cristales
  '#1e3a8a', // Azul profundo - ej: Astrología
  '#581c87', // Púrpura oscuro - ej: Hechizos
  '#831843', // Rosa profundo - ej: Amor
  // ... hasta 10 colores
];
```

#### Organización:
```
Categoría Raíz: TAROT (Color: Marrón rojizo)
├── Estante 1: "Arcanos Mayores"
│   └── 📕📕📕 (todos marrones)
├── Estante 2: "Arcanos Menores" 
│   └── 📕📕📕📕 (todos marrones)
└── Estante 3: "Lecturas"
    └── 📕📕 (todos marrones)

Categoría Raíz: CRISTALES (Color: Verde esmeralda)
├── Estante 1: "Cuarzos"
│   └── 📗📗📗 (todos verdes)
└── Estante 2: "Obsidianas"
    └── 📗📗 (todos verdes)
```

#### Ideal para:
- ✅ Experiencia visual inmersiva
- ✅ Móviles (no se aplasta)
- ✅ Identificación rápida por color
- ✅ Temática mística/biblioteca antigua

---

## 🎯 Cómo Cambiar entre Diseños

En `src/app/articulos/page.tsx`:

```tsx
// OPCIÓN 1: Estante de libros (activo)
import BookshelfGrimorio from '@/components/BookshelfGrimorio';

export default function ArticulosPage() {
  return (
    <Suspense>
      <BookshelfGrimorio />
    </Suspense>
  );
}

// OPCIÓN 2: Índice tradicional
// Comenta BookshelfGrimorio y descomenta:
// import ArticulosContent from '@/components/ArticulosContent';
// <ArticulosContent />
```

---

## 📊 Comparativa Detallada

| Característica | Índice Tradicional | Estante de Libros |
|----------------|-------------------|-------------------|
| **Móviles** | ⚠️ Se comprime | ✅ Perfecto |
| **Visual** | 📄 Lista | 🎨 3D inmersivo |
| **Colores** | ❌ No | ✅ Por categoría raíz |
| **Animaciones** | ✅ Básicas | ✅ Avanzadas (hover, stagger) |
| **Información** | ✅ Todo visible | 📌 Tooltip al hover |
| **Jerarquía** | ✅ Sangría clara | ✅ Etiquetas de estante |
| **Espacio** | ✅ Compacto | ⚠️ Más espacioso |
| **Rendimiento** | ✅ Muy rápido | ✅ Rápido (GSAP optimizado) |

---

## 🎨 Personalización del Estante

### Cambiar colores de libros:
Edita `bookColors` en `BookshelfGrimorio.tsx` (línea 50):

```typescript
const bookColors = [
  '#tu-color-hex', // Añade tus colores
  // ...
];
```

### Ajustar tamaño de libros:
Busca en el componente `Book` (línea 223):

```tsx
className="relative h-48 w-10 sm:h-56 sm:w-12"
//          ↑ altura  ↑ancho mobile  ↑ancho desktop
```

### Cambiar animación de hover:
Línea 218:

```tsx
style={{
  transform: isHovered 
    ? 'translateY(-12px) scale(1.05)'  // Ajusta píxeles y escala
    : 'translateY(0) scale(1)',
}}
```

---

## 🚀 Recomendación Final

**Usa el Estante de Libros** porque:
1. ✅ Resuelve el problema de compresión en móviles
2. ✅ Sistema de colores ayuda a identificar categorías
3. ✅ Experiencia más inmersiva y única
4. ✅ Mejor UX en dispositivos táctiles
5. ✅ Mantiene la temática mística del sitio

**El diseño de Índice** es mejor si:
- Tienes 100+ artículos y necesitas vista compacta
- Prefieres ver todos los títulos sin interacción
- Quieres carga ultra-rápida (menos CSS)

---

## 🐛 Solución de Problemas

### Si los libros se ven muy juntos en móvil:
```tsx
// En línea 434, ajusta gap:
className="flex flex-wrap gap-2 sm:gap-3"
//                          ↑ aumenta a gap-3 o gap-4
```

### Si necesitas más colores:
Añade más hex codes al array `bookColors` (línea 50)

### Si el scroll sigue sin funcionar en Studio:
1. Verifica que `isStudioPage` detecta correctamente en `LenisProvider`
2. Revisa que el CSS de Studio no tenga `overflow: hidden`
3. Inspecciona con DevTools si hay conflictos de z-index

---

## 📝 Notas Técnicas

- **GSAP ScrollTrigger:** Ambas versiones usan animaciones al scroll
- **Sanity Queries:** Idénticas en ambos diseños
- **Performance:** Bookshelf usa más CSS pero es igual de rápido
- **Accesibilidad:** Ambos tienen tooltips y aria-labels apropiados

---

**Creado:** Octubre 2025  
**Versión:** 2.0 - Diseño Estante de Libros
