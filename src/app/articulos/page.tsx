import { Suspense } from 'react';
import StarBackground from '@/components/StarBackground';
import ArticulosContent from '@/components/ArticulosContent';

export default function ArticulosPage() {
  return (
    <div className="relative min-h-screen pt-24">
      <StarBackground />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative container mx-auto px-4 py-8 text-white">
        <h1 className="text-4xl font-bold mb-8 text-center font-cinzel-decorative">El grimorio de Lunaria</h1>
        <Suspense fallback={<div>Cargando...</div>}>
          <ArticulosContent />
        </Suspense>
      </div>
    </div>
  );
}
