import { client } from '@/sanity/lib/client';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { PortableTextBlock } from '@portabletext/types';
import React from 'react';
import Image from 'next/image';
import TableOfContents from '@/components/TableOfContents';
import ArticleContent from '@/components/ArticleContent';
import MoonReadingProgress from '@/components/MoonReadingProgress';
import { absoluteUrl, DEFAULT_OG_IMAGES } from '@/lib/site';

// Define the types for our article data
interface Article {
  title: string;
  slug: { current: string };
  mainImage?: SanityImageSource & { alt?: string; asset?: { metadata?: { dimensions?: { width: number; height: number } } } };
  body: PortableTextBlock[]; // Portable Text content
  publishedAt: string;
  _updatedAt?: string;
  authors?: { name: string; slug: { current: string } }[];
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Helper to fetch a single article
async function getArticle(slug: string): Promise<Article | null> {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    slug,
    mainImage{
      ...,
      asset->{
        ...,
        metadata
      }
    },
    body,
    publishedAt,
    _updatedAt,
    "authors": authors[]->{name, slug},
    "description": pt::text(body),
    metaTitle,
    metaDescription,
    keywords
  }`;
  return await client.fetch(query, { slug });
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug:string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: 'Artículo no encontrado',
      description: 'El artículo que buscas no existe en nuestro grimorio.'
    };
  }

  const title = article.metaTitle || article.title;
  const description = article.metaDescription || article.description.substring(0, 155);
  const url = absoluteUrl(`/articulos/${article.slug.current}`);
  const imageUrl = article.mainImage ? urlFor(article.mainImage).width(1200).height(630).url() : '';
  const authorName = article.authors?.[0]?.name || 'Arledge Brer';

  return {
    title,
    description,
    keywords: article.keywords || ['tarot', 'espiritualidad', 'magia', 'brujería'],
    authors: [{ name: authorName }],
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [authorName],
      siteName: 'La Madriguera de Lunaria',
      images: imageUrl ? [{ 
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: title
      }] : DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ArticuloPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const articleUrl = absoluteUrl(`/articulos/${article.slug.current}`);
  // Artículo + migas de pan, enlazados a la organización del layout raíz (@id)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${articleUrl}#article`,
        "headline": article.metaTitle || article.title,
        "description": (article.metaDescription || article.description).substring(0, 155),
        "image": article.mainImage ? urlFor(article.mainImage).width(1200).height(630).url() : absoluteUrl('/opengraph-image'),
        "inLanguage": "es-MX",
        "keywords": article.keywords?.join(', '),
        "author": article.authors && article.authors.length > 0
          ? article.authors.map(author => ({ "@type": "Person", "name": author.name, "url": absoluteUrl(`/autores/${author.slug.current}`) }))
          : { "@id": absoluteUrl('/#organization') },
        "publisher": { "@id": absoluteUrl('/#organization') },
        "datePublished": article.publishedAt,
        "dateModified": article._updatedAt || article.publishedAt,
        "mainEntityOfPage": articleUrl,
        "isPartOf": { "@id": absoluteUrl('/#website') },
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Inicio", "item": absoluteUrl('/') },
          { "@type": "ListItem", "position": 2, "name": "El grimorio de Lunaria", "item": absoluteUrl('/articulos') },
          { "@type": "ListItem", "position": 3, "name": article.title, "item": articleUrl },
        ],
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-4 pt-4 pb-16 sm:pb-24 text-moon-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MoonReadingProgress targetId="cuerpo-articulo" />

      <span className="lun-eyebrow block text-center">El grimorio de Lunaria</span>

      {/* Título del artículo */}
      <h1 className="mx-auto mt-4 mb-3 max-w-4xl text-center font-display text-[clamp(2rem,4.6vw,3.75rem)] font-bold leading-[1.12] text-moon-50">
        {article.title}
      </h1>

      {/* Autor */}
      <p className="text-center text-moon-500 mb-10 sm:mb-12 text-base">
        Aportado por: {article.authors && article.authors.length > 0 
          ? article.authors.map(author => author.name).join(', ') 
          : 'La Madriguera'}
      </p>

      {/* Layout: Imagen + Índice en la misma fila */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Imagen del artículo - Más pequeña */}
        {article.mainImage && (
          <div className="lg:col-span-1">
            <Image
              src={urlFor(article.mainImage).url()}
              alt={article.mainImage.alt || article.title}
              width={400}
              height={300}
              className="w-full h-auto rounded-lg shadow-lg shadow-dusk-500/50"
            />
          </div>
        )}
        
        {/* Índice de contenidos */}
        <div className={article.mainImage ? "lg:col-span-2" : "lg:col-span-3"}>
          <TableOfContents body={article.body} />
        </div>
      </div>

      {/* Contenido del artículo */}
      <div id="cuerpo-articulo" className="max-w-4xl mx-auto">
        <ArticleContent body={article.body} />
      </div>
    </div>
  );
}