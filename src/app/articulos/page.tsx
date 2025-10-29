import { Suspense } from 'react';
// import ArticulosContent from '@/components/ArticulosContent'; // Vista de índice tradicional
import BookshelfGrimorio from '@/components/BookshelfGrimorio'; // Vista de estante de libros

export default function ArticulosPage() {
  return (
    <div className="relative container mx-auto px-4 py-8 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center font-cinzel-decorative">El grimorio de Lunaria</h1>
      <Suspense fallback={<div className="text-center py-12"><div className="inline-flex items-center gap-3"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div><span className="text-xl font-serif">Cargando...</span></div></div>}>
        <BookshelfGrimorio />
        {/* Para volver al diseño anterior, comenta BookshelfGrimorio y descomenta ArticulosContent */}
        {/* <ArticulosContent /> */}
      </Suspense>
    </div>
  );
}
