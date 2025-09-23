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
    const marginLeft = level * 8; // 8px por cada nivel de anidación
    const titleSize = level === 0 ? 'text-3xl' : level === 1 ? 'text-2xl' : 'text-xl';
    const sparkleSize = level === 0 ? 'w-6 h-6' : 'w-5 h-5';
    
    return (
      <div key={`${categoryName}-${level}`} className="mb-8 last:mb-0 category-section" style={{ marginLeft: `${marginLeft}px` }}>
        {/* Título de la categoría */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles className={`${sparkleSize} text-purple-400`} />
            <h3 className={`${titleSize} font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300`}>
              {categoryName}
            </h3>
            <Sparkles className={`${sparkleSize} text-purple-400`} />
          </div>
          {categoryNode.description && (
            <p className="text-purple-200 font-serif italic text-sm mb-3">
              {categoryNode.description}
            </p>
          )}
          <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent w-1/2 mx-auto"></div>
        </div>

        {/* Artículos de esta categoría */}
        {categoryNode.articles.length > 0 && (
          <div className="space-y-2 mb-6">
            {categoryNode.articles.map((article) => (
              <Link 
                key={article._id}
                href={`/articulos/${article.slug.current}`}
                className="group flex items-center p-3 rounded-md hover:bg-purple-800/30 transition-all duration-300 article-entry"
              >
                {/* Imagen del artículo */}
                {article.mainImage && (
                  <div className="flex-shrink-0 mr-4">
                    <Image
                      src={urlFor(article.mainImage).width(60).height(60).url()}
                      alt={article.mainImage.alt || article.title}
                      width={60}
                      height={60}
                      className="w-15 h-15 object-cover rounded-md border border-purple-500/30 group-hover:border-purple-400/50 transition-colors"
                    />
                  </div>
                )}
                
                <div className="flex items-center flex-grow min-w-0">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full group-hover:bg-yellow-300 transition-colors mr-3 flex-shrink-0"></div>
                  <span className="text-white group-hover:text-yellow-100 transition-colors font-medium text-lg flex-grow truncate">
                    {article.title}
                  </span>
                </div>
                
                {/* Línea punteada estilo índice */}
                <div className="flex-grow mx-4 border-b border-dotted border-purple-400/40 group-hover:border-purple-300/60 transition-colors min-w-12"></div>
                
                {/* Fecha como "número de página" */}
                <span className="text-purple-300 group-hover:text-purple-200 font-mono text-sm transition-colors min-w-20 text-right flex-shrink-0">
                  {article.publishedAt 
                    ? new Date(article.publishedAt).toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: '2-digit',
                        year: 'numeric' 
                      })
                    : 'Sin fecha'
                  }
                </span>
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
      {/* Header del Grimorio */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent flex-grow max-w-32"></div>
          <BookOpen className="w-8 h-8 text-yellow-400" />
          <h2 className="text-4xl font-serif font-bold text-yellow-300">Índice</h2>
          <BookOpen className="w-8 h-8 text-yellow-400" />
          <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent flex-grow max-w-32"></div>
        </div>
        <p className="text-lg text-purple-200 font-serif italic">
          &ldquo;Los secretos del cosmos organizados para tu sabiduría&rdquo;
        </p>
      </div>

      {/* Buscador elegante */}
      <div className="mb-12 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
          <input
            type="text"
            placeholder="Buscar en el grimorio..."
            className="w-full pl-12 pr-4 py-4 rounded-lg bg-black/40 backdrop-blur-sm border border-purple-500/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
          <p className="text-center text-purple-200 text-sm leading-relaxed">
            ¿No encuentras la sabiduría que buscas? Escríbenos a{' '}
            <a href="mailto:elconejodelunaria@gmail.com" className="text-yellow-400 hover:text-yellow-300 underline transition-colors">
              elconejodelunaria@gmail.com
            </a>{' '}
            para agregar una nueva página al grimorio.
          </p>
        </div>
      </div>

      {/* Índice completo del Grimorio */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/30 shadow-2xl p-8">
          
          {/* Renderizar estructura de categorías anidadas */}
          {Object.entries(organizedContent).map(([categoryName, categoryNode]) =>
            renderCategoryNode(categoryName, categoryNode, 0)
          )}

          {Object.keys(organizedContent).length === 0 && (
            <div className="text-center py-12">
              <p className="text-purple-300 font-serif italic">
                {searchQuery 
                  ? `No se encontraron resultados para "${searchQuery}"`
                  : "El grimorio está esperando sus primeras páginas..."}
              </p>
            </div>
          )}

          {/* Footer del índice */}
          <div className="text-center mt-12 pt-8 border-t border-purple-500/30">
            <p className="text-purple-300 font-serif italic text-sm">
              &ldquo;Cada página contiene secretos esperando ser descubiertos...&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}