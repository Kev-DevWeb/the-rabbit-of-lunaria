# 📚 ESTANTE DE LIBROS - Jerarquía Visual Mejorada

## ✅ Problemas Solucionados

### 1. **Títulos Largos en Lomos** ✂️

**Antes:**
- ❌ Títulos completos que se salían del lomo
- ❌ Texto ilegible en libros angostos

**Ahora:**
- ✅ **Truncado inteligente:** Títulos se cortan en el último espacio
- ✅ **Libros más anchos:** 
  - Móvil: 12px (antes 10px)
  - Tablet: 14px (antes 12px)
  - Desktop: 16px (antes 12px)
- ✅ **Texto más pequeño pero legible:**
  - Móvil: 9px
  - Tablet: 10px
  - Desktop: 12px
- ✅ **Tooltip con título completo** al hacer hover

**Función de truncado:**
```typescript
truncateTitle("Guía Completa de los Arcanos Mayores del Tarot", 35)
// → "Guía Completa de los Arcanos..."
```

---

### 2. **Jerarquía de Categorías** 🏛️

**Antes:**
- ❌ Todas las categorías al mismo nivel
- ❌ "Magia" separado de "Tipos de Magia"
- ❌ No se veía relación padre-hijo

**Ahora - Ejemplo Visual:**

```
┌─────────────────────────────────────────────────────┐
│ 🔴 Nivel 1                                          │
│ MAGIA                                               │
│ "Conocimientos fundamentales de las artes mágicas" │
│ Nivel 1 • •                                         │
└─────────────────────────────────────────────────────┘
📕📕📕📕📕 (todos color #7c2d12 - rojo oscuro)
─────────────────────────────────────────────────────
   └─────────────────────────────────────────────────┐
   │ 🟠 Nivel 2                                       │
   │ Magia › TIPOS DE MAGIA                          │
   │ "Clasificación de las distintas magias"         │
   │ Nivel 2 • • •                                    │
   └──────────────────────────────────────────────────┘
   📙📙📙 (todos color #a64624 - naranja, +15% brillo)
   ─────────────────────────────────────────────────
      └──────────────────────────────────────────────┐
      │ 🟡 Nivel 3                                    │
      │ Magia › Tipos de Magia › ADIVINACIÓN         │
      │ "Prácticas para ver el futuro"               │
      │ Nivel 3 • • • •                               │
      └───────────────────────────────────────────────┘
      📒📒📒📒 (color #c96538 - amarillo, +30% brillo)
      ─────────────────────────────────────────────
         └───────────────────────────────────────────┐
         │ 🟢 Nivel 4                                 │
         │ Magia › ... › Adivinación › TAROT         │
         │ "El arte de leer las cartas"              │
         │ Nivel 4 • • • • •                          │
         └────────────────────────────────────────────┘
         📗📗📗 (color #eb844c - verde, +45% brillo)
         ─────────────────────────────────────────
            └────────────────────────────────────────┐
            │ 🔵 Nivel 5                              │
            │ ... › Tarot › ARCANOS MAYORES          │
            │ Nivel 5 • • • • • •                     │
            └─────────────────────────────────────────┘
            📘📘📘📘📘📘 (color más claro)
            ─────────────────────────────────────

┌─────────────────────────────────────────────────────┐
│ 🟢 Nivel 1                                          │
│ CRISTALES                                           │
│ "Poderes de las gemas y minerales"                 │
│ Nivel 1 •                                           │
└─────────────────────────────────────────────────────┘
📗📗📗📗 (todos color #064e3b - verde esmeralda)
```

---

## 🎨 Sistema de Colores por Profundidad

### **Cálculo Automático:**

```typescript
// Categoría raíz "MAGIA" tiene color base: #7c2d12 (marrón rojizo)

Nivel 1 (Magia):                    #7c2d12 ██ (color base)
Nivel 2 (Tipos de Magia):           #a64624 ██ (+15% brillo)
Nivel 3 (Adivinación):              #c96538 ██ (+30% brillo)
Nivel 4 (Tarot):                    #eb844c ██ (+45% brillo)
Nivel 5+ (Arcanos Mayores):         #ff9f5f ██ (+60% brillo)
```

### **10 Colores Base Predefinidos:**

```css
#7c2d12  ██  Marrón rojizo      → Magia, Hechizos
#064e3b  ██  Verde esmeralda    → Cristales, Plantas
#1e3a8a  ██  Azul profundo      → Astrología, Cosmos
#581c87  ██  Púrpura oscuro     → Espiritualidad
#831843  ██  Rosa profundo      → Amor, Relaciones
#78350f  ██  Marrón dorado      → Alquimia, Metales
#0c4a6e  ██  Azul oceánico      → Agua, Emociones
#4c1d95  ██  Violeta profundo   → Adivinación
#713f12  ██  Bronce antiguo     → Historia, Tradiciones
#14532d  ██  Verde bosque       → Naturaleza, Hierbas
```

Cada color se **aclara progresivamente** en subcategorías.

---

## 📐 Elementos Visuales de Jerarquía

### **1. Badge de Color**
- Círculo pequeño con el color de la categoría
- Efecto de brillo (box-shadow con el mismo color)

### **2. Breadcrumb (Ruta de Navegación)**
- Solo se muestra en niveles 2+
- Formato: `Padre1 › Padre2 › Padre3 ›`
- Color: gris/púrpura transparente

### **3. Nombre de Categoría**
- Tamaño según profundidad:
  - Nivel 1: `text-2xl sm:text-3xl` (grande)
  - Nivel 2: `text-xl sm:text-2xl` (mediano)
  - Nivel 3: `text-lg sm:text-xl` (normal)
  - Nivel 4+: `text-base sm:text-lg` (pequeño)

### **4. Indicador de Nivel**
- Texto: "Nivel 1", "Nivel 2", etc.
- Puntos visuales que aumentan con profundidad
- Opacidad creciente: • •• ••• ••••

### **5. Sangría (Indentación)**
- Nivel 1: 0px
- Nivel 2: 20px (ml-5)
- Nivel 3: 40px (ml-10)
- Nivel 4: 60px (ml-15)
- Nivel 5+: 80px (ml-20)

---

## 🔄 Orden de Aparición (Jerárquico)

### **Algoritmo de Ordenamiento:**

```
1. Agrupar por categoría raíz (alfabético)
2. Dentro de cada raíz, ordenar por path completo
3. Los padres SIEMPRE aparecen antes que los hijos

Resultado:
- Magia (nivel 1)
  - Magia > Adivinación (nivel 2)
    - Magia > Adivinación > Tarot (nivel 3)
      - Magia > Adivinación > Tarot > Arcanos Mayores (nivel 4)
      - Magia > Adivinación > Tarot > Arcanos Menores (nivel 4)
  - Magia > Tipos de Magia (nivel 2)
    - Magia > Tipos de Magia > Blanca (nivel 3)
    - Magia > Tipos de Magia > Negra (nivel 3)
```

---

## 📱 Responsive (Móvil)

### **Ajustes Automáticos:**

**Libros:**
- Ancho: 12px (antes 10px) → Más espacio para texto
- Alto: 192px (12rem) igual
- Gap: 1.5px (muy juntos) → Caben más libros

**Etiquetas:**
- Breadcrumb: Se ajusta automáticamente (wrap)
- Títulos: Tamaños escalados (sm:)
- Sangría: Se mantiene pero es proporcional

**Estantes:**
- Padding reducido: px-2 (antes px-4)
- Gap entre libros: 1.5px (antes 2px)

---

## 🎯 Ejemplos de Uso

### **Caso 1: Grimorio de Tarot**

```
🔴 MAGIA (nivel 1) - Color base rojo #7c2d12
├── 📕 Introducción a la Magia
├── 📕 Historia de las Artes
└── 📕 Fundamentos Básicos

    🟠 MAGIA › ADIVINACIÓN (nivel 2) - Color naranja #a64624
    ├── 📙 Qué es la Adivinación
    └── 📙 Tipos de Oráculos

        🟡 MAGIA › ADIVINACIÓN › TAROT (nivel 3) - Amarillo #c96538
        ├── 📒 Historia del Tarot
        ├── 📒 Cómo leer las cartas
        └── 📒 Spreads básicos

            🟢 MAGIA › ... › TAROT › ARCANOS MAYORES (nivel 4) - Verde #eb844c
            ├── 📗 El Loco
            ├── 📗 El Mago
            ├── 📗 La Sacerdotisa
            └── 📗 ... (22 cartas)
```

### **Caso 2: Múltiples Raíces**

```
🔴 MAGIA - #7c2d12 (rojo)
├── 📕📕📕 (3 artículos)

    🟠 MAGIA › HECHIZOS - #a64624
    ├── 📙📙📙📙 (4 artículos)

🟢 CRISTALES - #064e3b (verde)
├── 📗📗 (2 artículos)

    🟡 CRISTALES › CUARZOS - #0a6b50
    ├── 📒📒📒 (3 artículos)

🔵 ASTROLOGÍA - #1e3a8a (azul)
├── 📘📘📘📘📘 (5 artículos)
```

---

## 🛠️ Personalización

### **Cambiar colores base:**

En `BookshelfGrimorio.tsx` línea 50:

```typescript
const bookColors = [
  '#tu-color-1', // Para primera raíz
  '#tu-color-2', // Para segunda raíz
  // ... hasta 10 colores
];
```

### **Ajustar degradado de profundidad:**

Línea 161:

```typescript
const brightnessIncrease = Math.min(depth - 1, 3) * 0.15;
//                                                   ↑ Cambia este valor
// 0.10 = degradado sutil (10% por nivel)
// 0.15 = degradado normal (15% por nivel)
// 0.20 = degradado fuerte (20% por nivel)
```

### **Cambiar sangría:**

Línea 461:

```typescript
const indentClass = depth === 1 ? '' : 
                   depth === 2 ? 'ml-5' :  // 20px
                   depth === 3 ? 'ml-10' : // 40px
                   // Ajusta los valores ml-X
```

### **Ajustar truncado de títulos:**

Línea 246:

```typescript
const truncateTitle = (title: string, maxLength: number = 35) => {
//                                                        ↑ Cambia este número
// 25 = títulos más cortos
// 35 = balance recomendado
// 50 = títulos más largos
```

---

## 📊 Comparativa Visual

| Elemento | Antes | Ahora |
|----------|-------|-------|
| **Orden** | Aleatorio por profundidad | Jerárquico (padres → hijos) |
| **Colores** | Todos iguales por raíz | Degradado por profundidad |
| **Títulos** | Se salían del lomo | Truncados inteligentemente |
| **Jerarquía** | Difícil de ver | Clara con breadcrumbs y sangría |
| **Ancho libro** | 10px → 12px móvil | 12px → 14px → 16px responsive |
| **Identificación** | Solo por posición | Color + nivel + breadcrumb |

---

## ✨ Resultado Final

Ahora verás algo como esto:

```
🏚️ EL ESTANTE DE LUNARIA

🔴 MAGIA (grande, sin sangría)
    📕📕📕📕📕 (rojos oscuros)
─────────────────────────────────
   🟠 Magia › TIPOS DE MAGIA (mediano, sangría 20px)
       📙📙📙 (naranjas)
   ─────────────────────────────────
      🟡 Magia › Tipos › ADIVINACIÓN (pequeño, sangría 40px)
          📒📒📒📒 (amarillos)
      ─────────────────────────────────

🟢 CRISTALES (grande, sin sangría)
    📗📗📗 (verdes oscuros)
─────────────────────────────────
```

**Todos los artículos relacionados están visualmente conectados** por:
- ✅ Colores de la misma familia
- ✅ Aparición secuencial
- ✅ Sangría progresiva
- ✅ Breadcrumbs de navegación

---

**¡Ahora el grimorio tiene una estructura visual clara y lógica!** 📚✨
