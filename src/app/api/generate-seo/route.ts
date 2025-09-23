import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'El título es requerido' }, { status: 400 });
    }

    // Generar SEO metadata basándose en el título y contenido
    const seoData = generateSEOData(title, content);

    return NextResponse.json(seoData);
  } catch (error) {
    console.error('Error generando SEO:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

function generateSEOData(title: string, content?: string) {
  // Limpiar el contenido de etiquetas HTML si existe
  const cleanContent = content ? content.replace(/<[^>]*>/g, '').substring(0, 500) : '';
  
  // Generar metaTitle (optimizado para SEO)
  const metaTitle = generateMetaTitle(title);
  
  // Generar meta description
  const metaDescription = generateMetaDescription(title, cleanContent);
  
  // Generar keywords
  const keywords = generateKeywords(title, cleanContent);

  return {
    metaTitle,
    metaDescription,
    keywords
  };
}

function generateMetaTitle(title: string): string {
  // Palabras clave relacionadas con tarot y esoterismo
  const seoTerms = [
    'Tarot',
    'Cartas del Tarot',
    'Lectura de Tarot', 
    'Esoterismo',
    'Espiritualidad',
    'Adivinación',
    'Arcanos',
    'Magia',
    'Místico',
    'Oráculo'
  ];

  // Si el título ya contiene términos SEO, solo optimizar longitud
  const hasKeywords = seoTerms.some(term => 
    title.toLowerCase().includes(term.toLowerCase())
  );

  let metaTitle = title;

  // Si no tiene keywords, agregar una relevante
  if (!hasKeywords) {
    metaTitle = `${title} - Tarot y Esoterismo`;
  }

  // Asegurar que esté en el rango óptimo de 50-60 caracteres
  if (metaTitle.length > 60) {
    metaTitle = metaTitle.substring(0, 57) + '...';
  } else if (metaTitle.length < 30) {
    metaTitle += ' | La Madriguera de Lunaria';
  }

  return metaTitle;
}

function generateMetaDescription(title: string, content: string): string {
  let description = '';

  if (content && content.length > 50) {
    // Usar las primeras oraciones del contenido
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    description = sentences.slice(0, 2).join('. ').trim();
  } else {
    // Generar descripción basada en el título
    description = `Descubre todo sobre ${title.toLowerCase()} en nuestro completo artículo sobre tarot y esoterismo.`;
  }

  // Agregar llamada a la acción
  if (!description.includes('tarot') && !description.includes('carta')) {
    description += ' Aprende más sobre el mundo del tarot y la espiritualidad.';
  }

  // Optimizar longitud (150-160 caracteres)
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  } else if (description.length < 120) {
    description += ' ✨ Explora el misterio con nosotros.';
  }

  return description;
}

function generateKeywords(title: string, content: string): string[] {
  // Keywords base relacionadas con tarot
  const baseKeywords = [
    'tarot',
    'cartas del tarot',
    'lectura de cartas',
    'esoterismo',
    'espiritualidad',
    'adivinación',
    'arcanos mayores',
    'arcanos menores',
    'magia',
    'oráculo'
  ];

  // Extraer palabras clave del título
  const titleWords = title.toLowerCase()
    .split(/[\s,.-]+/)
    .filter(word => word.length > 3 && !['para', 'como', 'con', 'del', 'una', 'las', 'los', 'que'].includes(word));

  // Extraer palabras clave del contenido
  const contentWords = content ? content.toLowerCase()
    .split(/[\s,.-]+/)
    .filter(word => word.length > 4 && !['para', 'como', 'con', 'del', 'una', 'las', 'los', 'que', 'este', 'esta', 'pero', 'más'].includes(word))
    .slice(0, 10) : [];

  // Combinar todas las keywords y eliminar duplicados
  const allKeywords = [...baseKeywords, ...titleWords, ...contentWords];
  const uniqueKeywords = [...new Set(allKeywords)];

  // Retornar máximo 15 keywords
  return uniqueKeywords.slice(0, 15);
}