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
import { BookOpen, Search, Sparkles } from 'lucide-react';

// Define types for our Sanity data
interface Category {
  title: string;
  description?: string;
  slug?: { current: string };
  parent?: Category;
}

interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  mainImage?: SanityImageSource & { alt?: string; width?: number; height?: number };
  authors?: {
    name: string;
    slug: { current: string };
    image?: SanityImageSource;
  }[];
  categories: Category[];
}

interface CategoryGroup {
  name: string;
  description?: string;
  color: string;
  articles: Article[];
  depth: number;
}

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

gsap.registerPlugin(ScrollTrigger);

// Paleta de colores para las categorías (estilo libros antiguos)
const bookColors = [
  '#7c2d12', // Marrón rojizo
  '#064e3b', // Verde esmeralda oscuro
  '#1e3a8a', // Azul profundo
  '#581c87', // Púrpura oscuro
  '#831843', // Rosa profundo
  '#78350f', // Marrón dorado
  '#0c4a6e', // Azul oceánico
  '#4c1d95', // Violeta profundo
  '#713f12', // Bronce antiguo
  '#14532d', // Verde bosque
];

export default function BookshelfGrimorio() {
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
      const sanityQuery = `*[_type == "post"] {
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
        "authors": authors[]->{
          name,
          slug,
          image
        },
        "categories": categories[]->{
          title, 
          description,
          slug,
          orderRank,
          parent->{
            title,
            slug,
            orderRank,
            parent->{
              title,
              slug,
              orderRank,
              parent->{
                title,
                slug,
                orderRank
              }
            }
          }
        },
        "categoryOrder": categories[0].orderRank,
        "parentOrder": categories[0].parent.orderRank,
        "grandParentOrder": categories[0].parent.parent.orderRank
      } | order(grandParentOrder asc, parentOrder asc, categoryOrder asc, publishedAt asc)`;
      const fetchedArticles = await client.fetch<Article[]>(sanityQuery);
      setArticles(fetchedArticles);
      setLoading(false);
    }

    fetchArticles();
  }, [searchParams]);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Función para obtener la ruta completa de categorías
  const getCategoryPath = (category: Category): string[] => {
    const path: string[] = [];
    let current: Category | undefined = category;
    
    while (current) {
      path.unshift(current.title);
      current = current.parent;
    }
    
    return path;
  };

  // Función para obtener la categoría raíz
  const getRootCategory = (category: Category): string => {
    let current = category;
    while (current.parent) {
      current = current.parent;
    }
    return current.title;
  };

  // Organizar artículos por categorías con colores consistentes
  const organizeByCategories = (articles: Article[]): CategoryGroup[] => {
    const categoryMap = new Map<string, CategoryGroup>();
    const rootColorMap = new Map<string, string>();
    let colorIndex = 0;

    articles.forEach(article => {
      if (!article.categories?.[0]) return;

      const category = article.categories[0];
      const categoryPath = getCategoryPath(category);
      const fullPath = categoryPath.join(' > ');
      const rootCategory = getRootCategory(category);
      const depth = categoryPath.length;

      // Asignar color basado en la categoría raíz
      if (!rootColorMap.has(rootCategory)) {
        rootColorMap.set(rootCategory, bookColors[colorIndex % bookColors.length]);
        colorIndex++;
      }

      const color = rootColorMap.get(rootCategory)!;

      if (!categoryMap.has(fullPath)) {
        categoryMap.set(fullPath, {
          name: fullPath,
          description: category.description,
          color,
          articles: [],
          depth
        });
      }

      categoryMap.get(fullPath)!.articles.push(article);
    });

    // Ordenar por profundidad y nombre
    return Array.from(categoryMap.values()).sort((a, b) => {
      if (a.depth !== b.depth) return a.depth - b.depth;
      return a.name.localeCompare(b.name, 'es');
    });
  };

  const categoryGroups = organizeByCategories(filteredArticles);

  // Componente de libro individual
  const Book = ({ article, color, index }: { article: Article; color: string; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <Link
        href={`/articulos/${article.slug.current}`}
        className="book-item"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transitionDelay: `${index * 30}ms`
        }}
      >
        <div 
          className="relative group cursor-pointer transition-all duration-300"
          style={{
            transform: isHovered ? 'translateY(-12px) scale(1.05)' : 'translateY(0) scale(1)',
          }}
        >
          {/* Lomo del libro */}
          <div 
            className="relative h-48 w-10 sm:h-56 sm:w-12 rounded-r-sm shadow-lg transition-all duration-300"
            style={{
              background: `linear-gradient(to right, ${color}, ${color}dd, ${color})`,
              boxShadow: isHovered 
                ? `0 15px 40px -10px ${color}80, inset -2px 0 4px rgba(0,0,0,0.3)` 
                : `0 8px 20px -5px ${color}60, inset -2px 0 4px rgba(0,0,0,0.3)`,
            }}
          >
            {/* Título del libro en el lomo */}
            <div className="absolute inset-0 flex items-center justify-center px-1">
              <p 
                className="text-xs sm:text-sm font-serif text-yellow-100 writing-mode-vertical transform rotate-0 text-center line-clamp-4 font-semibold drop-shadow-lg"
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                  letterSpacing: '0.5px'
                }}
              >
                {article.title}
              </p>
            </div>

            {/* Detalles decorativos del libro */}
            <div className="absolute top-2 left-0 right-0 h-px bg-yellow-600/40"></div>
            <div className="absolute bottom-2 left-0 right-0 h-px bg-yellow-600/40"></div>
            
            {/* Brillo en el lomo */}
            <div 
              className="absolute top-0 left-0 w-1 h-full bg-gradient-to-r from-white/20 to-transparent"
            ></div>

            {/* Sombra interna derecha */}
            <div 
              className="absolute top-0 right-0 w-2 h-full bg-gradient-to-l from-black/30 to-transparent"
            ></div>
          </div>

          {/* Tooltip con información */}
          {isHovered && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-50 pointer-events-none">
              <div className="bg-gray-900 border border-purple-500/50 rounded-lg p-3 shadow-2xl min-w-[200px] max-w-[280px]">
                <p className="text-white text-sm font-semibold mb-1 line-clamp-2">{article.title}</p>
                {article.authors && article.authors.length > 0 && (
                  <p className="text-purple-300 text-xs">
                    Por: {article.authors[0].name}
                  </p>
                )}
                {article.publishedAt && (
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(article.publishedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
                {/* Triángulo del tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                  <div className="border-8 border-transparent border-t-purple-500/50"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Link>
    );
  };

  useGSAP(() => {
    if (loading) return;

    const shelves = gsap.utils.toArray('.shelf-section');
    shelves.forEach((shelf, index) => {
      gsap.from(shelf as HTMLElement, {
        opacity: 0,
        y: 50,
        duration: 0.6,
        ease: 'power3.out',
        delay: index * 0.1,
        scrollTrigger: {
          trigger: shelf as HTMLElement,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });

    const books = gsap.utils.toArray('.book-item');
    books.forEach((book, index) => {
      gsap.from(book as HTMLElement, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        delay: (index % 10) * 0.05,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: book as HTMLElement,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    });

  }, { scope: container, dependencies: [loading, categoryGroups] });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          <span className="text-xl font-serif">Organizando el estante...</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={container} className="min-h-screen">
      {/* Header del Grimorio */}
      <div className="mb-12">
        <div className="flex items-start gap-4 mb-6">
          <BookOpen className="w-8 h-8 text-yellow-400 mt-2 flex-shrink-0" />
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-yellow-300 mb-2">El Estante de Lunaria</h2>
            <p className="text-base sm:text-lg text-purple-200 font-serif italic">
              &ldquo;Cada libro guarda secretos antiguos esperando ser descubiertos&rdquo;
            </p>
            <div className="h-px bg-gradient-to-r from-yellow-400 to-transparent w-48 sm:w-64 mt-3"></div>
          </div>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-12 max-w-4xl mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Buscar en el grimorio..."
              className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-lg bg-black/40 backdrop-blur-sm border border-purple-500/30 text-gray-200 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
            <p className="text-center text-purple-200 text-sm leading-relaxed">
              ¿No encuentras la sabiduría que buscas? Escríbenos a{' '}
              <a href="mailto:elconejodelunaria@gmail.com" className="text-yellow-400 hover:text-yellow-300 underline transition-colors">
                elconejodelunaria@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Estantes de libros */}
      <div className="max-w-7xl mx-auto space-y-12">
        {categoryGroups.map((categoryGroup, groupIndex) => {
          const categoryLevels = categoryGroup.name.split(' > ');
          const displayName = categoryLevels[categoryLevels.length - 1];
          const parentPath = categoryLevels.slice(0, -1).join(' > ');

          return (
            <div key={categoryGroup.name} className="shelf-section">
              {/* Etiqueta del estante */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300">
                      {displayName}
                    </h3>
                    {parentPath && (
                      <p className="text-xs sm:text-sm text-purple-400 font-serif italic mt-1">
                        {parentPath}
                      </p>
                    )}
                  </div>
                </div>
                {categoryGroup.description && (
                  <p className="text-purple-200 font-serif italic text-xs sm:text-sm ml-8">
                    {categoryGroup.description}
                  </p>
                )}
              </div>

              {/* Estante de madera */}
              <div className="relative">
                {/* Libros en el estante */}
                <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-4 px-4 sm:px-6 min-h-[200px] sm:min-h-[230px] items-end">
                  {categoryGroup.articles.map((article, index) => (
                    <Book 
                      key={article._id} 
                      article={article} 
                      color={categoryGroup.color}
                      index={index}
                    />
                  ))}
                </div>

                {/* Madera del estante */}
                <div 
                  className="h-3 sm:h-4 rounded-sm relative"
                  style={{
                    background: 'linear-gradient(to bottom, #6d4c41, #5d4037, #4e342e)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                  }}
                >
                  {/* Vetas de la madera */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 11px)'
                  }}></div>
                </div>

                {/* Soporte del estante */}
                <div className="flex justify-between px-4 sm:px-8">
                  <div className="w-2 h-8 sm:h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-b"></div>
                  <div className="w-2 h-8 sm:h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-b"></div>
                </div>
              </div>
            </div>
          );
        })}

        {categoryGroups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-purple-300 font-serif italic text-lg">
              {searchQuery 
                ? `No se encontraron libros con "${searchQuery}"`
                : "El estante está esperando sus primeros libros..."}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <p className="text-purple-300 font-serif italic text-sm">
          &ldquo;En cada lomo dorado yace un portal a mundos de conocimiento ancestral&rdquo;
        </p>
      </div>
    </div>
  );
}
