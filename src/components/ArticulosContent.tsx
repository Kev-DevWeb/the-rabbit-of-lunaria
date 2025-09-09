'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { articles } from '@/lib/articles'; // Import articles from the new file

export default function ArticulosContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedArticles = filteredArticles.reduce((acc, article) => {
    const { category, subcategory } = article;
    if (!acc[category]) {
      acc[category] = {};
    }
    if (subcategory) {
      if (!acc[category][subcategory]) {
        acc[category][subcategory] = [];
      }
      acc[category][subcategory].push(article);
    } else {
      if (!acc[category]['_root']) {
        acc[category]['_root'] = [];
      }
      acc[category]['_root'].push(article);
    }
    return acc;
  }, {} as Record<string, Record<string, typeof articles>>);

  return (
    <>
      <div className="mb-8 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Buscar artículos..."
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* New message below search bar */}
        <p className="mt-4 text-center text-gray-400 text-lg">
          ¿No encuentras la información que buscas o quieres agregar una nueva hoja al grimorio?{' '}
          Escríbenos a{' '}
          <a href="mailto:elconejodelunaria@gmail.com" className="text-purple-400 hover:underline">
            elconejodelunaria@gmail.com
          </a>{' '}
          con tu artículo y tu nombre brujil o la información que buscas.
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        {Object.entries(groupedArticles).map(([category, subcategories]) => (
          <div key={category} className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">{category}</h2>
            {subcategories['_root'] && (
              <ul>
                {subcategories['_root'].map((article) => (
                  <li key={article.slug}>
                    <Link href={`/articulos/${article.slug}`}>
                      <p className="text-2xl hover:text-purple-400">{article.title}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {Object.entries(subcategories).map(([subcategory, articles]) => (
              subcategory !== '_root' && (
                <div key={subcategory} className="ml-4 mt-4">
                  <h3 className="text-2xl font-bold mb-2 text-purple-300">{subcategory}</h3>
                  <ul>
                    {articles.map((article) => (
                      <li key={article.slug}>
                        <Link href={`/articulos/${article.slug}`}>
                          <p className="text-xl hover:text-purple-400">{article.title}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
