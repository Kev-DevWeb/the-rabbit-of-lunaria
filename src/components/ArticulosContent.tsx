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
import { BookOpen, Sparkles, Search } from 'lucide-react';

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

interface CategoryNode {
  title: string;
  description?: string;
  subcategories: {
    [subcategoryName: string]: CategoryNode;
  };
  articles: Article[];
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
        "authors": authors[]->{
          name,
          slug,
          image
        },
        "categories": categories[]->{
          title, 
          description,
          slug,
          parent->{
            title,
            slug,
            parent->{
              title,
              slug,
              parent->{
                title,
                slug,
                parent->{
                  title,
                  slug
                }
              }
            }
          }
        }
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

  // Función para obtener la ruta completa de categorías (desde la raíz)
  const getCategoryPath = (category: Category): string[] => {
    const path: string[] = [];
    let current: Category | undefined = category;
    
    while (current) {
      path.unshift(current.title);
      current = current.parent;
    }
    
    return path;
  };

  // Función para crear estructura anidada recursivamente
  const createNestedStructure = (articles: Article[]): Record<string, CategoryNode> => {
    const structure: Record<string, CategoryNode> = {};
    
    articles.forEach(article => {
      if (!article.categories?.[0]) return;
      
      const categoryPath = getCategoryPath(article.categories[0]);
      let current = structure;
      
      // Navegar/crear la estructura anidada
      categoryPath.forEach((categoryName, index) => {
        if (!current[categoryName]) {
          current[categoryName] = {
            title: categoryName,
            description: index === categoryPath.length - 1 ? article.categories[0].description : '',
            subcategories: {},
            articles: []
          };
        }
        
        // Si es la última categoría en el path, agregar el artículo
        if (index === categoryPath.length - 1) {
          current[categoryName].articles.push(article);
        } else {
          current = current[categoryName].subcategories;
        }
      });
    });
    
    return structure;
  };

  // Organizar artículos por categorías multinivel
  const organizedContent = createNestedStructure(filteredArticles);

  // Función para renderizar categorías anidadas recursivamente
  const renderCategoryNode = (categoryName: string, categoryNode: CategoryNode, level: number = 0): React.ReactNode => {
    // Sangrías responsive: móvil (8px), tablet (16px), desktop (24px)
    const paddingClass = level === 0 ? '' : 
                        level === 1 ? 'pl-2 sm:pl-4 lg:pl-6' : 
                        level === 2 ? 'pl-4 sm:pl-8 lg:pl-12' : 
                                     'pl-6 sm:pl-12 lg:pl-16';
    
    // Tamaños responsive de texto: móvil más grande, tablet intermedio, desktop igual
    const titleSize = level === 0 ? 'text-xl sm:text-2xl lg:text-2xl' : 
                      level === 1 ? 'text-lg sm:text-xl lg:text-xl' : 
                                   'text-base sm:text-lg lg:text-lg';
    const sparkleSize = level === 0 ? 'w-4 h-4 sm:w-5 sm:h-5' : 
                        level === 1 ? 'w-3 h-3 sm:w-4 sm:h-4' : 
                                     'w-3 h-3';
    const marginBottom = level === 0 ? 'mb-6 sm:mb-8' : level === 1 ? 'mb-4 sm:mb-6' : 'mb-3 sm:mb-4';
    
    return (
      <div key={`${categoryName}-${level}`} className={`${marginBottom} ${paddingClass} last:mb-0 category-section`}>
        {/* Título de la categoría - Alineado a la izquierda como índice de libro */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className={`${sparkleSize} text-purple-400 flex-shrink-0`} />
            <h3 className={`${titleSize} font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 leading-tight`}>
              {categoryName}
            </h3>
          </div>
          {categoryNode.description && (
            <p className="text-purple-200 font-serif italic text-xs sm:text-sm mb-2 ml-2 sm:ml-4 lg:ml-7">
              {categoryNode.description}
            </p>
          )}
          {/* Línea decorativa más sutil y corta - responsive */}
          <div className="h-px bg-gradient-to-r from-purple-400 to-transparent w-16 sm:w-24 lg:w-32 ml-2 sm:ml-4 lg:ml-7"></div>
        </div>

        {/* Artículos de esta categoría */}
        {categoryNode.articles.length > 0 && (
          <div className="space-y-1 mb-4 sm:mb-6 ml-2 sm:ml-4 lg:ml-7">
            {categoryNode.articles.map((article) => (
              <Link 
                key={article._id}
                href={`/articulos/${article.slug.current}`}
                className="group block py-2 px-3 rounded-md hover:bg-purple-800/20 transition-all duration-300 article-entry"
              >
                {/* Layout Mobile - Stack vertical */}
                <div className="sm:hidden">
                  <div className="flex items-start space-x-3">
                    {/* Imagen del artículo */}
                    {article.mainImage && (
                      <div className="flex-shrink-0">
                        <Image
                          src={urlFor(article.mainImage).width(48).height(48).url()}
                          alt={article.mainImage.alt || article.title}
                          width={48}
                          height={48}
                          className="w-12 h-12 object-cover rounded border border-purple-500/30 group-hover:border-purple-400/50 transition-colors"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <div className="w-1 h-1 bg-yellow-400 rounded-full group-hover:bg-yellow-300 transition-colors mr-2 flex-shrink-0"></div>
                      </div>
                      <h3 className="text-gray-200 group-hover:text-yellow-100 transition-colors font-medium text-sm leading-tight">
                        {article.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Layout Desktop - Horizontal con línea punteada */}
                <div className="hidden sm:flex items-center">
                  {/* Imagen del artículo */}
                  {article.mainImage && (
                    <div className="flex-shrink-0 mr-3">
                      <Image
                        src={urlFor(article.mainImage).width(40).height(40).url()}
                        alt={article.mainImage.alt || article.title}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded border border-purple-500/30 group-hover:border-purple-400/50 transition-colors"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center flex-grow min-w-0">
                    {/* Punto de índice más pequeño */}
                    <div className="w-1 h-1 bg-yellow-400 rounded-full group-hover:bg-yellow-300 transition-colors mr-2 flex-shrink-0"></div>
                    <span className="text-gray-200 group-hover:text-yellow-100 transition-colors font-medium text-base lg:text-base flex-grow truncate">
                      {article.title}
                    </span>
                  </div>
                  
                  {/* Línea punteada estilo índice de libro */}
                  <div className="flex-grow mx-3 border-b border-dotted border-purple-400/30 group-hover:border-purple-300/50 transition-colors min-w-8"></div>
                  
                  {/* Fecha como "número de página" */}
                  <span className="text-purple-300 group-hover:text-purple-200 font-mono text-xs transition-colors min-w-16 text-right flex-shrink-0">
                    {article.publishedAt 
                      ? new Date(article.publishedAt).toLocaleDateString('es-ES', { 
                          day: '2-digit', 
                          month: '2-digit'
                        })
                      : 'S/F'
                    }
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Subcategorías recursivas */}
        {Object.entries(categoryNode.subcategories).map(([subcategoryName, subcategoryNode]) =>
          renderCategoryNode(subcategoryName, subcategoryNode, level + 1)
        )}
      </div>
    );
  };

  useGSAP(() => {
    if (loading) return;

    const categoryBlocks = gsap.utils.toArray('.category-section');
    categoryBlocks.forEach((block, index) => {
      gsap.from(block as HTMLElement, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
        delay: index * 0.1,
        scrollTrigger: {
          trigger: block as HTMLElement,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });

    const articleItems = gsap.utils.toArray('.article-entry');
    articleItems.forEach((item, index) => {
      gsap.from(item as HTMLElement, {
        opacity: 0,
        x: -30,
        duration: 0.5,
        delay: index * 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item as HTMLElement,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    });

  }, { scope: container, dependencies: [loading, organizedContent] });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          <span className="text-xl font-serif">Abriendo el grimorio...</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={container} className="min-h-screen">
      {/* Header del Grimorio - Estilo libro tradicional */}
      <div className="mb-12">
        <div className="flex items-start gap-4 mb-6">
          <BookOpen className="w-8 h-8 text-yellow-400 mt-2 flex-shrink-0" />
          <div>
            <h2 className="text-4xl font-serif font-bold text-yellow-300 mb-2">Índice</h2>
            <p className="text-lg text-purple-200 font-serif italic">
              &ldquo;Los secretos del cosmos organizados para tu sabiduría&rdquo;
            </p>
            <div className="h-px bg-gradient-to-r from-yellow-400 to-transparent w-64 mt-3"></div>
          </div>
        </div>
      </div>

      {/* Buscador elegante */}
      <div className="mb-12 max-w-4xl mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Buscar en el grimorio..."
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-lg bg-black/40 backdrop-blur-sm border border-purple-500/30 text-gray-200 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
            <p className="text-center text-purple-200 text-sm leading-relaxed">
              ¿No encuentras la sabiduría que buscas? o ¿Quieres aportar con tu conocimiento? Escríbenos a{' '}
              <a href="mailto:elconejodelunaria@gmail.com" className="text-yellow-400 hover:text-yellow-300 underline transition-colors">
                elconejodelunaria@gmail.com
              </a>{' '}
              para agregar una nueva página al grimorio.
            </p>
          </div>
        </div>
      </div>

      {/* Índice completo del Grimorio - Formato de libro */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/30 shadow-2xl p-8">
          
          {/* Renderizar estructura de categorías anidadas */}
          {Object.entries(organizedContent).map(([categoryName, categoryNode]) =>
            renderCategoryNode(categoryName, categoryNode, 0)
          )}

          {Object.keys(organizedContent).length === 0 && (
            <div className="py-12">
              <p className="text-purple-300 font-serif italic">
                {searchQuery 
                  ? `No se encontraron resultados para "${searchQuery}"`
                  : "El grimorio está esperando sus primeras páginas..."}
              </p>
            </div>
          )}

          {/* Footer del índice */}
          <div className="mt-12 pt-8 border-t border-purple-500/30">
            <p className="text-purple-300 font-serif italic text-sm">
              &ldquo;Cada página contiene secretos esperando ser descubiertos...&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}