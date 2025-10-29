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
  const getRootCategory = (category: Category): Category => {
    let current = category;
    while (current.parent) {
      current = current.parent;
    }
    return current;
  };

  // Función para calcular color degradado según profundidad
  const getColorForDepth = (baseColor: string, depth: number): string => {
    // Convertir hex a RGB
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    
    // Aclarar el color progresivamente según la profundidad
    // Nivel 1 (raíz): color base
    // Nivel 2: +15% brillo
    // Nivel 3: +30% brillo
    // Nivel 4+: +45% brillo
    const brightnessIncrease = Math.min(depth - 1, 3) * 0.15;
    
    const newR = Math.min(255, Math.floor(r + (255 - r) * brightnessIncrease));
    const newG = Math.min(255, Math.floor(g + (255 - g) * brightnessIncrease));
    const newB = Math.min(255, Math.floor(b + (255 - b) * brightnessIncrease));
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  // Interface para artículos con metadata de categoría
  interface ArticleWithCategory extends Article {
    categoryPath: string[];
    depth: number;
    color: string;
    fullPath: string;
  }

  // Organizar artículos por ESTANTE (categoría raíz)
  const organizeByRootCategory = (articles: Article[]): CategoryGroup[] => {
    const rootColorMap = new Map<string, string>();
    let colorIndex = 0;

    // Primero, enriquecer cada artículo con metadata de categoría
    const enrichedArticles: ArticleWithCategory[] = articles
      .filter(article => article.categories?.[0])
      .map(article => {
        const category = article.categories[0];
        const categoryPath = getCategoryPath(category);
        const rootCategory = getRootCategory(category);
        const rootTitle = rootCategory.title;
        const depth = categoryPath.length;

        // Asignar color base a la categoría raíz
        if (!rootColorMap.has(rootTitle)) {
          rootColorMap.set(rootTitle, bookColors[colorIndex % bookColors.length]);
          colorIndex++;
        }

        const baseColor = rootColorMap.get(rootTitle)!;
        const color = getColorForDepth(baseColor, depth);

        return {
          ...article,
          categoryPath,
          depth,
          color,
          fullPath: categoryPath.join(' > ')
        };
      });

    // Agrupar por categoría raíz
    const rootGroups = new Map<string, ArticleWithCategory[]>();
    enrichedArticles.forEach(article => {
      const rootTitle = article.categoryPath[0];
      if (!rootGroups.has(rootTitle)) {
        rootGroups.set(rootTitle, []);
      }
      rootGroups.get(rootTitle)!.push(article);
    });

    // Ordenar artículos dentro de cada grupo por jerarquía
    rootGroups.forEach((articles, rootTitle) => {
      articles.sort((a, b) => {
        // Ordenar por path completo para mantener jerarquía
        for (let i = 0; i < Math.max(a.categoryPath.length, b.categoryPath.length); i++) {
          if (!a.categoryPath[i]) return -1; // A es más corto (padre primero)
          if (!b.categoryPath[i]) return 1;  // B es más corto
          if (a.categoryPath[i] !== b.categoryPath[i]) {
            return a.categoryPath[i].localeCompare(b.categoryPath[i], 'es');
          }
        }
        return 0;
      });
    });

    // Convertir a CategoryGroup (un grupo por categoría raíz)
    const result: CategoryGroup[] = Array.from(rootGroups.entries()).map(([rootTitle, articles]) => {
      // Obtener descripción de la categoría raíz
      const firstArticle = articles[0];
      const rootCategory = enrichedArticles.find(a => 
        a.categoryPath.length === 1 && a.categoryPath[0] === rootTitle
      );
      
      return {
        name: rootTitle,
        description: rootCategory?.categories[0]?.description || '',
        color: rootColorMap.get(rootTitle)!,
        articles: articles as Article[], // Mantenemos metadata en los artículos
        depth: 1
      };
    });

    // Ordenar grupos alfabéticamente
    return result.sort((a, b) => a.name.localeCompare(b.name, 'es'));
  };

  const categoryGroups = organizeByRootCategory(filteredArticles);

  // Componente de libro individual - MEJORADO con color propio
  const Book = ({ article, baseColor, index }: { article: Article; baseColor: string; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Calcular color según profundidad de la categoría del artículo
    const category = article.categories?.[0];
    const categoryPath = category ? getCategoryPath(category) : [];
    const depth = categoryPath.length;
    const bookColor = getColorForDepth(baseColor, depth);

    // Acortar título si es muy largo (para el lomo) - LÍMITE AUMENTADO
    const truncateTitle = (title: string, maxLength: number = 60) => {
      if (title.length <= maxLength) return title;
      
      // Buscar el último espacio antes del límite
      const truncated = title.substring(0, maxLength);
      const lastSpace = truncated.lastIndexOf(' ');
      
      if (lastSpace > 0) {
        return truncated.substring(0, lastSpace) + '...';
      }
      
      return truncated + '...';
    };

    const spineTitle = truncateTitle(article.title);
    
    // Obtener etiqueta de subcategoría (si no es raíz)
    const subcategoryLabel = categoryPath.length > 1 
      ? categoryPath[categoryPath.length - 1] 
      : '';

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
          {/* Lomo del libro - MÁS ANCHO para títulos completos */}
          <div 
            className="relative h-48 w-16 sm:h-56 sm:w-20 md:w-24 rounded-r-sm shadow-lg transition-all duration-300"
            style={{
              background: `linear-gradient(to right, ${bookColor}, ${bookColor}dd, ${bookColor})`,
              boxShadow: isHovered 
                ? `0 15px 40px -10px ${bookColor}80, inset -2px 0 4px rgba(0,0,0,0.3)` 
                : `0 8px 20px -5px ${bookColor}60, inset -2px 0 4px rgba(0,0,0,0.3)`,
            }}
          >
            {/* Etiqueta de subcategoría en la parte superior */}
            {subcategoryLabel && (
              <div 
                className="absolute top-0 left-0 right-0 px-0.5 py-1 text-center z-10"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderBottom: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <span 
                  className="text-[6px] sm:text-[7px] text-yellow-200/80 font-serif uppercase tracking-wide"
                  style={{
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                  }}
                >
                  {subcategoryLabel.length > 12 ? subcategoryLabel.substring(0, 12) : subcategoryLabel}
                </span>
              </div>
            )}

            {/* Título del libro en el lomo - TEXTO COMPLETO sin sobreponerse */}
            <div 
              className="absolute flex items-center justify-center px-1"
              style={{
                top: subcategoryLabel ? '24px' : '12px',
                bottom: '12px',
                left: 0,
                right: 0
              }}
            >
              <p 
                className="text-[10px] sm:text-[11px] md:text-xs font-serif text-yellow-100 font-semibold drop-shadow-lg overflow-hidden"
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                  letterSpacing: '0.3px',
                  maxHeight: '100%',
                  lineHeight: '1.2'
                }}
              >
                {spineTitle}
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
            
            {/* Indicador visual de profundidad (puntos en la parte inferior) */}
            {depth > 1 && (
              <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-0.5">
                {Array.from({ length: Math.min(depth, 4) }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-0.5 h-0.5 rounded-full bg-yellow-300/60"
                  ></div>
                ))}
              </div>
            )}
          </div>

          {/* Tooltip con información - ADAPTATIVO a tamaño de pantalla */}
          {isHovered && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 pointer-events-none">
              <div className="bg-gray-900/95 backdrop-blur-sm border border-purple-500/50 rounded-lg p-2 sm:p-3 shadow-2xl w-[160px] sm:w-[200px] lg:w-[240px]">
                {/* Ruta de categoría - Compacta */}
                {categoryPath.length > 0 && (
                  <div className="mb-1.5 pb-1.5 border-b border-purple-500/30">
                    <p className="text-purple-300 text-[8px] sm:text-[9px] lg:text-[10px] font-serif leading-tight">
                      {categoryPath.join(' › ')}
                    </p>
                  </div>
                )}
                {/* Título - Responsive */}
                <p className="text-white text-[11px] sm:text-xs lg:text-sm font-semibold mb-1 line-clamp-2 leading-tight">
                  {article.title}
                </p>
                {/* Autor - Compacto */}
                {article.authors && article.authors.length > 0 && (
                  <p className="text-purple-300 text-[9px] sm:text-[10px] lg:text-xs truncate">
                    {article.authors[0].name}
                  </p>
                )}
                {/* Fecha - Solo en pantallas más grandes */}
                {article.publishedAt && (
                  <p className="hidden sm:block text-gray-400 text-[9px] lg:text-xs mt-0.5">
                    {new Date(article.publishedAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                )}
                {/* Triángulo del tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                  <div className="border-4 sm:border-6 lg:border-8 border-transparent border-t-purple-500/50"></div>
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

      {/* Estantes de libros - UN ESTANTE POR CATEGORÍA RAÍZ */}
      <div className="max-w-7xl mx-auto space-y-12">
        {categoryGroups.map((categoryGroup, groupIndex) => {
          return (
            <div key={categoryGroup.name} className="shelf-section">
              {/* Etiqueta del estante - CATEGORÍA RAÍZ */}
              <div className="mb-6">
                <div className="flex items-start gap-4 mb-3">
                  {/* Badge de color grande */}
                  <div 
                    className="w-4 h-4 rounded-full mt-2 flex-shrink-0 shadow-lg"
                    style={{ 
                      backgroundColor: categoryGroup.color,
                      boxShadow: `0 0 12px ${categoryGroup.color}80`
                    }}
                  ></div>
                  
                  <div className="flex-1">
                    {/* Nombre de la categoría RAÍZ */}
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300">
                      {categoryGroup.name}
                    </h3>
                    
                    {/* Descripción si existe */}
                    {categoryGroup.description && (
                      <p className="text-purple-200/80 font-serif italic text-sm sm:text-base mt-2">
                        {categoryGroup.description}
                      </p>
                    )}
                    
                    {/* Contador de libros */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-purple-400/60 font-serif">
                        {categoryGroup.articles.length} {categoryGroup.articles.length === 1 ? 'libro' : 'libros'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Línea decorativa */}
                <div 
                  className="h-px bg-gradient-to-r from-purple-400 via-pink-400 to-transparent ml-8"
                  style={{
                    boxShadow: `0 0 4px ${categoryGroup.color}40`
                  }}
                ></div>
              </div>

              {/* Estante de madera */}
              <div className="relative">
                {/* Libros en el estante - TODOS JUNTOS con colores diferentes */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 mb-4 px-2 sm:px-4 min-h-[200px] sm:min-h-[230px] items-end">
                  {categoryGroup.articles.map((article, index) => (
                    <Book 
                      key={article._id} 
                      article={article} 
                      baseColor={categoryGroup.color}
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
