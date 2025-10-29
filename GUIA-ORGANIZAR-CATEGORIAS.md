# 🎓 GUÍA: Cómo Organizar Categorías en Sanity Studio

## 📚 Para Aprovechar el Nuevo Estante del Grimorio

---

## 🏗️ Estructura Recomendada

### **Paso 1: Crear Categorías Raíz (Nivel 1)**

Estas son las "secciones principales" del grimorio. Cada una tendrá un color único.

**Ejemplos sugeridos:**

```
✅ MAGIA
✅ TAROT
✅ CRISTALES Y GEMAS
✅ ASTROLOGÍA
✅ PLANTAS Y HIERBAS
✅ ESPIRITUALIDAD
✅ RITUALES
✅ MEDITACIÓN
✅ HECHIZOS
✅ HISTORIA ESOTÉRICA
```

**En Sanity Studio:**

1. Ir a **Categories** en el menú
2. Click en **"Create new"**
3. Campos:
   - **Title:** `MAGIA`
   - **Slug:** Auto-generar
   - **Description:** `Conocimientos fundamentales de las artes mágicas`
   - **Parent Category:** ❌ DEJAR VACÍO (es raíz)
   - **Order:** `1` (o el número que prefieras)

---

### **Paso 2: Crear Subcategorías (Nivel 2)**

Estas van **dentro** de las raíces. Heredan el color pero más claro.

**Ejemplo - Subcategorías de MAGIA:**

```
MAGIA (raíz)
├── Tipos de Magia
├── Herramientas Mágicas
├── Escuelas de Magia
└── Historia de la Magia
```

**En Sanity Studio:**

1. Crear nueva categoría
2. Campos:
   - **Title:** `Tipos de Magia`
   - **Slug:** Auto-generar
   - **Description:** `Clasificación de las diferentes magias`
   - **Parent Category:** 🎯 SELECCIONAR `MAGIA`
   - **Order:** `1`

---

### **Paso 3: Crear Sub-subcategorías (Nivel 3, 4, 5...)**

Puedes anidar hasta donde necesites. Cada nivel será más claro.

**Ejemplo - Jerarquía completa:**

```
MAGIA (nivel 1) - Color: #7c2d12 (rojo oscuro)
└── Tipos de Magia (nivel 2) - Color: #a64624 (naranja)
    ├── Magia Blanca (nivel 3) - Color: #c96538 (amarillo)
    ├── Magia Negra (nivel 3)
    └── Adivinación (nivel 3)
        ├── Tarot (nivel 4) - Color: #eb844c (verde claro)
        │   ├── Arcanos Mayores (nivel 5)
        │   └── Arcanos Menores (nivel 5)
        ├── Runas (nivel 4)
        └── I Ching (nivel 4)
```

**En Sanity Studio para "Tarot":**

1. Crear nueva categoría
2. Campos:
   - **Title:** `Tarot`
   - **Parent Category:** 🎯 SELECCIONAR `Adivinación`
   - **Order:** `1`

---

## 🎨 Sistema de Colores Automático

No necesitas configurar colores. El sistema los asigna automáticamente:

| Categoría Raíz | Color Base | Nivel 2 | Nivel 3 | Nivel 4 | Nivel 5 |
|----------------|------------|---------|---------|---------|---------|
| 1ª creada | #7c2d12 (rojo) | +15% | +30% | +45% | +60% |
| 2ª creada | #064e3b (verde) | +15% | +30% | +45% | +60% |
| 3ª creada | #1e3a8a (azul) | +15% | +30% | +45% | +60% |
| ... | ... | ... | ... | ... | ... |
| 10ª creada | #14532d (verde bosque) | +15% | +30% | +45% | +60% |

**Resultado visual:**

```
📕📕 MAGIA (rojo oscuro)
  📙📙 Tipos de Magia (naranja)
    📒📒 Adivinación (amarillo)
      📗📗 Tarot (verde claro)

📗📗 CRISTALES (verde esmeralda oscuro)
  📒📒 Cuarzos (verde claro)
```

---

## 📊 Campo "Order" (orderRank)

Controla el orden de aparición **dentro del mismo nivel**.

**Ejemplo:**

```
MAGIA (order: 1)
├── Historia de la Magia (order: 1) ← Aparece primero
├── Tipos de Magia (order: 2)
├── Herramientas (order: 3)
└── Escuelas (order: 4) ← Aparece último
```

**Recomendación:**
- Usa múltiplos de 10: `10, 20, 30, 40...`
- Así puedes insertar categorías entre medias después

---

## ✍️ Asignar Categorías a Artículos

Cuando crees un **Post** (artículo):

1. En el campo **"Categories"**
2. Selecciona **la categoría más específica posible**
3. ❌ NO selecciones múltiples de la misma jerarquía

**Ejemplo:**

**✅ CORRECTO:**
```
Artículo: "El Loco - Arcano Mayor"
Categoría: Magia > Tipos > Adivinación > Tarot > Arcanos Mayores
```

**❌ INCORRECTO:**
```
Artículo: "El Loco - Arcano Mayor"
Categorías: [Magia, Tipos de Magia, Tarot, Arcanos Mayores]
            ↑ No hace falta, solo usa la más específica
```

---

## 🎯 Ejemplos Completos de Estructuras

### **Ejemplo 1: Grimorio de Tarot**

```
📁 SANITY CATEGORIES:

MAGIA (order: 10, parent: null)
├── Adivinación (order: 10, parent: MAGIA)
│   ├── Tarot (order: 10, parent: Adivinación)
│   │   ├── Historia del Tarot (order: 10, parent: Tarot)
│   │   ├── Arcanos Mayores (order: 20, parent: Tarot)
│   │   ├── Arcanos Menores (order: 30, parent: Tarot)
│   │   └── Spreads y Tiradas (order: 40, parent: Tarot)
│   ├── Runas (order: 20, parent: Adivinación)
│   └── Astrología (order: 30, parent: Adivinación)
└── Hechizos (order: 20, parent: MAGIA)

CRISTALES (order: 20, parent: null)
└── Cuarzos (order: 10, parent: CRISTALES)
    ├── Cuarzo Rosa (order: 10, parent: Cuarzos)
    └── Cuarzo Blanco (order: 20, parent: Cuarzos)
```

**Resultado en el Estante:**

```
🔴 MAGIA
📕📕📕 (3 artículos generales de magia)
────────────────────────────────────

   🟠 Magia › ADIVINACIÓN
   📙📙 (2 artículos de adivinación en general)
   ────────────────────────────────────

      🟡 Magia › Adivinación › TAROT
      📒📒📒 (3 artículos generales de tarot)
      ────────────────────────────────────

         🟢 Magia › ... › Tarot › HISTORIA DEL TAROT
         📗📗 (2 artículos históricos)
         ────────────────────────────────────

         🟢 Magia › ... › Tarot › ARCANOS MAYORES
         📗📗📗📗📗📗📗 (7 artículos, uno por carta)
         ────────────────────────────────────

         🟢 Magia › ... › Tarot › ARCANOS MENORES
         📗📗📗📗 (4 artículos)
         ────────────────────────────────────

         🟢 Magia › ... › Tarot › SPREADS Y TIRADAS
         📗📗 (2 artículos)
         ────────────────────────────────────

      🟡 Magia › Adivinación › RUNAS
      📒📒 (2 artículos)
      ────────────────────────────────────

      🟡 Magia › Adivinación › ASTROLOGÍA
      📒📒📒 (3 artículos)
      ────────────────────────────────────

   🟠 Magia › HECHIZOS
   📙📙📙 (3 artículos)
   ────────────────────────────────────

🟢 CRISTALES
📗📗 (2 artículos generales)
────────────────────────────────────

   🟡 Cristales › CUARZOS
   📒📒 (2 artículos generales de cuarzos)
   ────────────────────────────────────

      🟢 Cristales › Cuarzos › CUARZO ROSA
      📗📗 (2 artículos)
      ────────────────────────────────────

      🟢 Cristales › Cuarzos › CUARZO BLANCO
      📗📗 (2 artículos)
      ────────────────────────────────────
```

---

### **Ejemplo 2: Grimorio de Plantas**

```
PLANTAS Y HIERBAS (order: 10, parent: null)
├── Hierbas Medicinales (order: 10, parent: PLANTAS Y HIERBAS)
│   ├── Lavanda (order: 10, parent: Hierbas Medicinales)
│   ├── Manzanilla (order: 20, parent: Hierbas Medicinales)
│   └── Romero (order: 30, parent: Hierbas Medicinales)
├── Plantas Mágicas (order: 20, parent: PLANTAS Y HIERBAS)
│   ├── Salvia Blanca (order: 10, parent: Plantas Mágicas)
│   └── Palo Santo (order: 20, parent: Plantas Mágicas)
└── Cultivo y Cuidado (order: 30, parent: PLANTAS Y HIERBAS)
```

---

## 🚀 Workflow Recomendado

### **Al empezar tu grimorio:**

1. **Planifica las 3-5 categorías raíz principales**
   - Ejemplo: MAGIA, TAROT, CRISTALES, ASTROLOGÍA, PLANTAS

2. **Crea las raíces en Sanity**
   - Usa `order: 10, 20, 30...` para mantener orden

3. **Crea 2-3 subcategorías por raíz**
   - Define bien la jerarquía antes de empezar

4. **Crea artículos asignándolos a la categoría más específica**
   - El sistema automáticamente los agrupará correctamente

5. **Observa el resultado en `/articulos`**
   - Los colores se asignan automáticamente
   - La jerarquía se muestra con sangría y breadcrumbs

---

## 💡 Tips Pro

### **Nomenclatura:**
- ✅ Usa nombres **descriptivos y claros**
- ✅ Mayúsculas en raíces para destacarlas: `MAGIA`
- ✅ Title Case en subcategorías: `Tipos de Magia`

### **Descriptions:**
- ✅ Escribe descripciones breves (1 línea)
- ✅ Ayudan al usuario a entender la sección
- ✅ Se muestran bajo el título del estante

### **Order:**
- ✅ Usa múltiplos de 10: `10, 20, 30...`
- ✅ Así puedes insertar entre medias después
- ✅ Ejemplo: insertar categoría entre 10 y 20 → usar 15

### **Profundidad:**
- ✅ Máximo recomendado: **4-5 niveles**
- ⚠️ Más de 5 niveles puede ser confuso
- ✅ Si necesitas más, reconsidera la estructura

---

## ❓ FAQ

### **P: ¿Puedo cambiar el orden después?**
**R:** Sí, solo edita el campo `order` en Sanity.

### **P: ¿Puedo mover una categoría a otro padre?**
**R:** Sí, cambia el campo `Parent Category`. Los colores se recalcularán automáticamente.

### **P: ¿Qué pasa si no asigno parent?**
**R:** Se crea como categoría raíz (nivel 1) y recibe un color base nuevo.

### **P: ¿Puedo tener artículos en categorías padre Y en hijas?**
**R:** Sí, perfectamente. Por ejemplo:
- 2 artículos en "MAGIA" (nivel 1)
- 5 artículos en "Tipos de Magia" (nivel 2)

### **P: ¿Los títulos largos se cortarán?**
**R:** Sí, automáticamente. Se truncan a ~35 caracteres. El título completo se muestra en el tooltip.

### **P: ¿Cuántos colores hay disponibles?**
**R:** 10 colores base. Si creas más de 10 raíces, los colores se reutilizan cíclicamente.

---

## ✅ Checklist de Organización

Antes de publicar tu grimorio:

- [ ] Categorías raíz creadas (máximo 10 recomendado)
- [ ] Cada raíz tiene descripción clara
- [ ] Subcategorías organizadas lógicamente
- [ ] Campo `order` configurado en todas las categorías
- [ ] Artículos asignados a categorías específicas (no múltiples)
- [ ] Probado en `/articulos` que se ven correctamente
- [ ] Jerarquía tiene sentido visualmente
- [ ] Colores se ven bien juntos

---

**¡Listo para crear tu grimorio perfecto!** 📚✨

Con esta estructura, tus conocimientos estarán **organizados, accesibles y visualmente hermosos**.
