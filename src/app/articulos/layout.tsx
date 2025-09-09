'use client'; // This component needs to be a client component to use hooks like usePathname

import StarBackground from '@/components/StarBackground';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { articles } from '@/lib/articles'; // Import articles

export default function ArticulosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentSlug = pathname.split('/').pop(); // Extract slug from URL

  const currentIndex = articles.findIndex(article => article.slug === currentSlug);
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  return (
    <div className="relative min-h-screen pt-24">
      <StarBackground />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative container mx-auto px-4 py-8 text-white">
        {children}

        {/* Navigation Buttons */}
        {currentSlug && ( // Only show navigation if on an individual article page
          <div className="mt-12 flex justify-between items-center">
            {prevArticle ? (
              <Link href={`/articulos/${prevArticle.slug}`} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg transition-colors duration-300">
                &larr; Página Anterior
              </Link>
            ) : (
              <span className="px-6 py-3 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed">
                &larr; Página Anterior
              </span>
            )}

            <Link href="/articulos" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-colors duration-300">
              Regresar al Índice
            </Link>

            {nextArticle ? (
              <Link href={`/articulos/${nextArticle.slug}`} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg transition-colors duration-300">
                Página Siguiente &rarr;
              </Link>
            ) : (
              <span className="px-6 py-3 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed">
                Página Siguiente &rarr;
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}