# 🗂️ Sistema de Categorías Anidadas Multinivel

## ¿Qué es?

Ahora puedes crear jerarquías de categorías de cualquier profundidad, como un árbol de organización:

```
Magia
└── Tipos de Magia
    └── Adivinación  
        └── Tarot
            ├── Artículo sobre Arcanos Mayores
            ├── Artículo sobre Lectura de Cartas
            └── Artículo sobre Historia del Tarot
```

## 🚀 Cómo crear la jerarquía

### En Sanity Studio:

1. **Crear categoría raíz**: 
   - Nombre: "Magia"
   - Parent Category: (dejar vacío)

2. **Crear subcategoría nivel 1**:
   - Nombre: "Tipos de Magia" 
   - Parent Category: Seleccionar "Magia"

3. **Crear subcategoría nivel 2**:
   - Nombre: "Adivinación"
   - Parent Category: Seleccionar "Tipos de Magia"

4. **Crear subcategoría nivel 3**:
   - Nombre: "Tarot"
   - Parent Category: Seleccionar "Adivinación"

5. **Asignar artículos**:
   - En cada artículo, seleccionar la categoría más específica: "Tarot"

## 📊 Cómo se muestra en el índice

### Jerarquía visual automática:
- **Nivel 0**: Título grande (3xl) con sparkles grandes
- **Nivel 1**: Título mediano (2xl) con sparkles medianos  
- **Nivel 2+**: Título pequeño (xl) con sparkles pequeños
- **Indentación**: Cada nivel se mueve 8px hacia la derecha

### Ejemplo visual:
```
✨ Magia ✨ (nivel 0 - sin indentación)
   ⭐ Tipos de Magia ⭐ (nivel 1 - 8px indentación)
      ⭐ Adivinación ⭐ (nivel 2 - 16px indentación)  
         ⭐ Tarot ⭐ (nivel 3 - 24px indentación)
            • Artículo 1 ............... 15/01/2024
            • Artículo 2 ............... 20/01/2024
```

## 🔧 Características técnicas

### Renderizado recursivo:
- ✅ Soporte para infinitos niveles de anidación
- ✅ Indentación automática progresiva
- ✅ Tamaños de título adaptativos por nivel
- ✅ Animaciones GSAP independientes por nivel

### Consulta optimizada:
```groq
"categories": categories[]->{
  title, 
  description,
  slug,
  parent->{
    title,
    slug,
    parent->{
      title,
      slug,
      parent->{
        title,
        slug,
        parent->{
          title,
          slug
        }
      }
    }
  }
}
```

### Estructura de datos:
```typescript
interface CategoryNode {
  title: string;
  description?: string;
  subcategories: {
    [subcategoryName: string]: CategoryNode;
  };
  articles: Article[];
}
```

## 💡 Mejores prácticas

### 📝 Nomenclatura:
- **Nivel 1**: Temas generales (Magia, Espiritualidad, Rituales)
- **Nivel 2**: Especialidades (Tipos de Magia, Meditación, Ceremonias)
- **Nivel 3**: Subcategorías (Adivinación, Protección, Luna Nueva)
- **Nivel 4+**: Especializaciones (Tarot, Runas, Eclipse)

### 🎯 Organización sugerida:
```
Espiritualidad
├── Meditación
│   ├── Técnicas Básicas
│   └── Meditación Avanzada
├── Rituales
│   ├── Luna Nueva
│   ├── Luna Llena  
│   └── Estaciones
└── Protección
    ├── Amuletos
    └── Cristales

Magia
├── Tipos de Magia
│   ├── Adivinación
│   │   ├── Tarot
│   │   ├── Runas
│   │   └── Péndulo
│   └── Hechicería
│       ├── Pociones
│       └── Hechizos
└── Herramientas Mágicas
    ├── Cristales
    └── Velas
```

## ⚡ Beneficios

- **Navegación intuitiva**: Estructura clara tipo árbol
- **SEO mejorado**: URLs y estructura jerárquica
- **Escalabilidad**: Agregar nuevas categorías sin límites
- **Flexibilidad**: Reorganizar fácilmente desde Sanity
- **UX consistente**: Diseño visual coherente en todos los niveles

---

*¡Tu grimorio ahora puede organizarse como una verdadera biblioteca mágica!* 📚✨