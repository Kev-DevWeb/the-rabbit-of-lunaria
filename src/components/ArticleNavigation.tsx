'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Article {
  _id: string;
  title: string;
  slug: { current: string };
}

interface ArticleNavigationProps {
  articles: Article[];
}

export default function ArticleNavigation({ articles }: ArticleNavigationProps) {
  const pathname = usePathname();
  const currentSlug = pathname.split('/').pop();

  // Solo mostrar navegación en páginas de artículos individuales
  if (!currentSlug || currentSlug === 'articulos') return null;

  const currentIndex = articles.findIndex(article => article.slug.current === currentSlug);
  if (currentIndex === -1) return null;

  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  return (
    <div className="mt-12">
      {/* Mobile Layout - Stacked vertical */}
      <div className="block md:hidden space-y-3">
        <Link 
          href="/articulos" 
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md shadow-lg transition-colors duration-300 text-center block"
        >
          📖 Regresar al Índice
        </Link>
        <div className="flex space-x-2">
          {prevArticle ? (
            <Link 
              href={`/articulos/${prevArticle.slug.current}`} 
              className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md shadow-lg transition-colors duration-300 text-center"
            >
              ← Anterior
            </Link>
          ) : (
            <span className="flex-1 px-3 py-2 bg-gray-700 text-gray-400 text-sm rounded-md cursor-not-allowed text-center">
              ← Anterior
            </span>
          )}
          {nextArticle ? (
            <Link 
              href={`/articulos/${nextArticle.slug.current}`} 
              className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md shadow-lg transition-colors duration-300 text-center"
            >
              Siguiente →
            </Link>
          ) : (
            <span className="flex-1 px-3 py-2 bg-gray-700 text-gray-400 text-sm rounded-md cursor-not-allowed text-center">
              Siguiente →
            </span>
          )}
        </div>
      </div>

      {/* Desktop Layout - Horizontal */}
      <div className="hidden md:flex justify-between items-center">
        {prevArticle ? (
          <Link 
            href={`/articulos/${prevArticle.slug.current}`} 
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg transition-colors duration-300"
          >
            ← Página Anterior
          </Link>
        ) : (
          <span className="px-6 py-3 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed">
            ← Página Anterior
          </span>
        )}

        <Link 
          href="/articulos" 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-colors duration-300"
        >
          📖 Regresar al Índice
        </Link>

        {nextArticle ? (
          <Link 
            href={`/articulos/${nextArticle.slug.current}`} 
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg transition-colors duration-300"
          >
            Página Siguiente →
          </Link>
        ) : (
          <span className="px-6 py-3 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed">
            Página Siguiente →
          </span>
        )}
      </div>
    </div>
  );
}
