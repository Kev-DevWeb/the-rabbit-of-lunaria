# 🤖 Generador Automático de SEO para Sanity Studio

## ¿Qué hace?

Este componente personalizado genera automáticamente contenido SEO optimizado para tus artículos, incluyendo:

- **Meta Title**: Título optimizado para motores de búsqueda (50-60 caracteres)
- **Meta Description**: Descripción atractiva que aparece en Google (150-160 caracteres) 
- **Keywords**: Palabras clave relevantes extraídas del contenido (máximo 15)

## 🚀 Cómo usar

1. **Escribe tu artículo**: Primero completa el título y algo del contenido de tu artículo
2. **Ve a la pestaña Meta**: En Sanity Studio, ve al grupo "Meta" 
3. **Usa el generador**: Haz clic en "Generar SEO Automáticamente"
4. **Revisa y ajusta**: El sistema llenará automáticamente los campos, pero puedes editarlos manualmente

## ✨ Características

### Inteligente
- Analiza tu título y contenido para generar SEO relevante
- Incluye automáticamente palabras clave relacionadas con tarot y esoterismo
- Optimiza la longitud de todos los elementos SEO

### Validación automática
- Te avisa si el meta title es muy largo (>60 caracteres)
- Te avisa si la meta description es muy larga (>160 caracteres)
- Te avisa si tienes demasiadas keywords (>15)

### Palabras clave incluidas automáticamente:
- tarot, cartas del tarot, lectura de cartas
- esoterismo, espiritualidad, adivinación
- arcanos mayores, arcanos menores
- magia, oráculo, místico

## 💡 Consejos de uso

1. **Siempre revisa el contenido generado** - La IA es buena pero tu conocimiento es mejor
2. **Personaliza para tu audiencia** - Ajusta el tono según tu estilo
3. **Usa keywords naturales** - No hagas "keyword stuffing"
4. **Mantén coherencia** - El meta title y description deben reflejar el contenido real

## 🔧 Estructura técnica

```
src/
├── app/api/generate-seo/route.ts     # API endpoint para generación
├── sanity/
│   ├── components/SEOGenerator.tsx   # Componente React para Sanity
│   └── schemaTypes/postType.ts       # Schema modificado
```

## 📈 Beneficios SEO

- **Mejor posicionamiento**: Titles y descriptions optimizadas
- **Mayor CTR**: Descripciones más atractivas en resultados de búsqueda  
- **Keywords relevantes**: Automáticamente incluye términos de tu nicho
- **Consistencia**: Todos los artículos tendrán metadatos completos

---

*¿Dudas? El generador incluye mensajes de ayuda y validaciones para guiarte.*