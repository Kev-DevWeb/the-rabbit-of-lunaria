'use client';

import StarBackground from '@/components/StarBackground';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';

interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
}

export default function ArticulosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentSlug = pathname.split('/').pop();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const sanityQuery = `*[_type == "post"] | order(publishedAt asc) {
          _id,
          title,
          slug,
          publishedAt
        }`;
        const fetchedArticles = await client.fetch<Article[]>(sanityQuery);
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  // Find current article and navigation
  const currentIndex = articles.findIndex(article => article.slug.current === currentSlug);
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  return (
    <div className="relative min-h-screen pt-24">
      <StarBackground />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative container mx-auto px-4 py-8 text-white">
        {children}

        {/* Navigation Buttons */}
        {currentSlug && !loading && (
          <div className="mt-12 flex justify-between items-center">
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
              Regresar al Índice
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
        )}
      </div>
    </div>
  );
}