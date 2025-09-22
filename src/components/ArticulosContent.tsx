'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

// Define types for our Sanity data
interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: SanityImageSource & { alt?: string; width?: number; height?: number };
  categories: {
    title: string;
    description?: string;
  }[];
}

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

gsap.registerPlugin(ScrollTrigger);

export default function ArticulosContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }

    async function fetchArticles() {
      setLoading(true);
      const sanityQuery = `*[_type == "post"] | order(publishedAt asc) {
        _id,
        title,
        slug,
        publishedAt,
        mainImage{
          ...,
          asset->{
            ...,
            metadata
          }
        },
        "categories": categories[]->{ title, description }
      }`;
      const fetchedArticles = await client.fetch<Article[]>(sanityQuery);
      setArticles(fetchedArticles);
      setLoading(false);
    }

    fetchArticles();
  }, [searchParams]);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedArticles = filteredArticles.reduce((acc, article) => {
    const categoryTitle = article.categories?.[0]?.title || 'Sin Categoría';
    if (!acc[categoryTitle]) {
      acc[categoryTitle] = [];
    }
    acc[categoryTitle].push(article);
    return acc;
  }, {} as Record<string, Article[]>);

  useGSAP(() => {
    if (loading) return;

    const categoryBlocks = gsap.utils.toArray('.category-block');
    categoryBlocks.forEach((block) => {
      gsap.from(block as HTMLElement, {
        opacity: 0,
        y: 50,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: block as HTMLElement,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      gsap.from(gsap.utils.toArray('.article-item', block as HTMLElement), {
        opacity: 0,
        x: -30,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: block as HTMLElement,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    });

  }, { scope: container, dependencies: [loading, groupedArticles] });

  if (loading) {
    return <div className="text-center">Cargando grimorio...</div>;
  }

  return (
    <div ref={container}>
      <div className="mb-8 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Buscar artículos..."
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
        {Object.entries(groupedArticles).map(([category, articlesInCategory]) => (
          <div key={category} className="mb-8 category-block">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">{category}</h2>
            <ul>
              {articlesInCategory.map((article) => (
                <li key={article._id} className="mb-4 flex items-center article-item">
                  {article.mainImage && (
                    <Image
                      src={urlFor(article.mainImage).url()}
                      alt={article.mainImage.alt || article.title}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-md mr-4"
                    />
                  )}
                  <Link href={`/articulos/${article.slug.current}`}>
                    <p className="text-2xl hover:text-purple-400">{article.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
