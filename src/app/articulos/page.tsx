import { Suspense } from 'react';
import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGES } from '@/lib/site';

export const metadata: Metadata = {
  title: 'El grimorio de Lunaria: artículos de tarot, magia y espiritualidad',
  description:
    'Biblioteca de artículos sobre tarot, arcanos mayores, rituales, magia y espiritualidad, escritos por la comunidad de La Madriguera de Lunaria para brujit@s y personas curiosas.',
  alternates: { canonical: '/articulos' },
  openGraph: { url: '/articulos', type: 'website', images: DEFAULT_OG_IMAGES },
};
// import ArticulosContent from '@/components/ArticulosContent'; // Vista de índice tradicional
import BookshelfGrimorio from '@/components/BookshelfGrimorio'; // Vista de estante de libros

export default function ArticulosPage() {
  return (
    <div className="relative container mx-auto px-4 py-8 text-moon-50">
      <span className="lun-eyebrow block text-center">Biblioteca</span>
      <h1 className="mt-4 mb-4 text-center font-display text-[clamp(2.4rem,5vw,4.1rem)] font-bold leading-[1.1] text-moon-50">El grimorio de Lunaria</h1>
      <p className="mx-auto mb-12 max-w-2xl text-center text-moon-300">Cada libro del estante es una categoría. Sácalo para ver sus páginas.</p>
      <Suspense fallback={<div className="text-center py-12"><div className="inline-flex items-center gap-3"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lavender"></div><span className="text-xl font-serif">Cargando...</span></div></div>}>
        <BookshelfGrimorio />
        {/* Para volver al diseño anterior, comenta BookshelfGrimorio y descomenta ArticulosContent */}
        {/* <ArticulosContent /> */}
      </Suspense>
    </div>
  );
}
