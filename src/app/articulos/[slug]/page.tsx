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

// Define the types for our article data
interface Article {
  title: string;
  slug: { current: string };
  mainImage?: SanityImageSource & { alt?: string; asset?: { metadata?: { dimensions?: { width: number; height: number } } } };
  body: PortableTextBlock[]; // Portable Text content
  publishedAt: string;
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
  const url = `https://www.themadrigueradelunaria.com/articulos/${article.slug.current}`;
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
      }] : [],
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description.substring(0, 155),
    "image": article.mainImage ? urlFor(article.mainImage).url() : '',
    "author": {
      "@type": "Person",
      "name": article.authors && article.authors.length > 0 
        ? article.authors.map(author => author.name).join(', ')
        : "La madriguera de Lunaria",
    },
    "publisher": {
      "@type": "Organization",
      "name": "La madriguera de Lunaria",
      "logo": {
        "@type": "ImageObject",
        "url": "https://the-rabbit-of-lunaria.vercel.app/logo.png",
      },
    },
    "datePublished": article.publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://the-rabbit-of-lunaria.vercel.app/articulos/${article.slug.current}`,
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8 text-gray-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Título del artículo */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-center font-cinzel-decorative text-white">
        {article.title}
      </h1>
      
      {/* Autor */}
      <p className="text-center text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
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
              className="w-full h-auto rounded-lg shadow-lg shadow-purple-900/50"
            />
          </div>
        )}
        
        {/* Índice de contenidos */}
        <div className={article.mainImage ? "lg:col-span-2" : "lg:col-span-3"}>
          <TableOfContents body={article.body} />
        </div>
      </div>

      {/* Contenido del artículo */}
      <div className="max-w-4xl mx-auto">
        <ArticleContent body={article.body} />
      </div>
    </div>
  );
}