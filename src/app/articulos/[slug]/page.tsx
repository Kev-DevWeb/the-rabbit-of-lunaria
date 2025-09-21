import { client } from '@/sanity/lib/client';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { getYouTubeEmbedId } from '@/lib/utils';
import { PortableTextBlock } from '@portabletext/types';
import React from 'react';
import Image from 'next/image';

// Define the types for our article data
interface Article {
  title: string;
  slug: { current: string };
  mainImage?: SanityImageSource & { alt?: string; asset?: { metadata?: { dimensions?: { width: number; height: number } } } };
  body: PortableTextBlock[]; // Portable Text content
  publishedAt: string;
  author: { name: string };
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
    "author": author->{name},
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
    return {};
  }

  const title = article.metaTitle || article.title;
  const description = article.metaDescription || article.description.substring(0, 155);
  const url = `https://the-rabbit-of-lunaria.vercel.app/articulos/${article.slug.current}`;
  const imageUrl = article.mainImage ? urlFor(article.mainImage).width(1200).height(630).url() : '';

  return {
    title,
    description,
    keywords: article.keywords || [],
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

// Custom components for rendering Portable Text
const ptComponents = {
  types: {
    image: ({ value }: { value: SanityImageSource & { alt?: string; asset?: { metadata?: { dimensions?: { width: number; height: number } } } } }) => {
      if (typeof value === 'string' || !('asset' in value) || !value.asset) {
        return null;
      }
      return (
        <Image
          src={urlFor(value).url()}
          alt={value.alt || ' '}
          width={value.asset?.metadata?.dimensions?.width || 800}
          height={value.asset?.metadata?.dimensions?.height || 600}
          loading="lazy"
          className="mx-auto my-4 rounded-lg shadow-lg shadow-purple-900/50"
        />
      );
    },
    embed: ({ value }: { value: { url: string } }) => {
      const embedId = getYouTubeEmbedId(value.url);
      if (embedId) {
        return (
          <div className="aspect-w-16 aspect-h-9 my-4">
            <iframe
              src={`https://www.youtube.com/embed/${embedId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg shadow-lg shadow-purple-900/50"
            ></iframe>
          </div>
        );
      }
      return <p>Unsupported embed: {value.url}</p>;
    },
  },
  block: {
    h2: ({ children }: {children?: React.ReactNode}) => <h2 className="text-3xl font-bold my-6 text-purple-300">{children}</h2>,
    h3: ({ children }: {children?: React.ReactNode}) => <h3 className="text-2xl font-semibold my-5 text-purple-400">{children}</h3>,
    h4: ({ children }: {children?: React.ReactNode}) => <h4 className="text-xl font-semibold my-4 text-purple-400/80">{children}</h4>,
    blockquote: ({ children }: {children?: React.ReactNode}) => <blockquote className="border-l-4 border-purple-400 pl-4 italic my-6 text-gray-300">{children}</blockquote>,
  }
};

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
      "name": article.author?.name || "La madriguera de Lunaria",
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
    // Remove prose classes to use our own custom styling from ptComponents
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-4xl font-bold mb-2 text-center font-cinzel-decorative">{article.title}</h1>
      <p className="text-center text-gray-400 mb-8">Aportado por: {article.author?.name || 'La Madriguera'}</p>
      {article.mainImage && (
        <div className="mb-8">
          <Image
            src={urlFor(article.mainImage).url()}
            alt={article.mainImage.alt || article.title}
            width={article.mainImage.asset?.metadata?.dimensions?.width || 800}
            height={article.mainImage.asset?.metadata?.dimensions?.height || 400}
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
      <div className="text-lg leading-relaxed">
        <PortableText value={article.body} components={ptComponents} />
      </div>
    </div>
  );
}
