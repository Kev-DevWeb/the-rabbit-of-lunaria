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
          <div className="relative w-full my-6" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
            <iframe
              src={`https://www.youtube.com/embed/${embedId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg shadow-purple-900/50"
            ></iframe>
          </div>
        );
      }
      return <p>Unsupported embed: {value.url}</p>;
    },
  },
  block: {
    h1: ({ children }: {children?: React.ReactNode}) => <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold my-5 sm:my-7 text-purple-200">{children}</h1>,
    h2: ({ children }: {children?: React.ReactNode}) => <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold my-4 sm:my-6 text-purple-300">{children}</h2>,
    h3: ({ children }: {children?: React.ReactNode}) => <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold my-3 sm:my-5 text-purple-400">{children}</h3>,
    h4: ({ children }: {children?: React.ReactNode}) => <h4 className="text-base sm:text-lg lg:text-xl font-semibold my-3 sm:my-4 text-purple-400/80">{children}</h4>,
    h5: ({ children }: {children?: React.ReactNode}) => <h5 className="text-sm sm:text-base lg:text-lg font-semibold my-2 sm:my-3 text-purple-400/70">{children}</h5>,
    h6: ({ children }: {children?: React.ReactNode}) => <h6 className="text-xs sm:text-sm lg:text-base font-semibold my-2 text-purple-400/60">{children}</h6>,
    blockquote: ({ children }: {children?: React.ReactNode}) => <blockquote className="border-l-2 sm:border-l-4 border-purple-400 pl-2 sm:pl-4 italic my-4 sm:my-6 text-gray-300">{children}</blockquote>,
    normal: ({ children }: {children?: React.ReactNode}) => <p className="mb-4 sm:mb-6 text-gray-200 leading-relaxed sm:leading-loose">{children}</p>,
    small: ({ children }: {children?: React.ReactNode}) => <p className="mb-3 sm:mb-4 text-sm text-gray-300 leading-relaxed">{children}</p>,
    large: ({ children }: {children?: React.ReactNode}) => <p className="mb-5 sm:mb-7 text-lg sm:text-xl text-gray-100 leading-relaxed sm:leading-loose">{children}</p>,
  },
  list: {
    bullet: ({ children }: {children?: React.ReactNode}) => <ul className="list-disc list-inside mb-4 sm:mb-6 text-gray-200 space-y-1 sm:space-y-2 ml-4">{children}</ul>,
    number: ({ children }: {children?: React.ReactNode}) => <ol className="list-decimal list-inside mb-4 sm:mb-6 text-gray-200 space-y-1 sm:space-y-2 ml-4">{children}</ol>,
  },
  marks: {
    strong: ({ children }: {children?: React.ReactNode}) => <strong className="font-bold text-purple-200">{children}</strong>,
    em: ({ children }: {children?: React.ReactNode}) => <em className="italic text-purple-300">{children}</em>,
    underline: ({ children }: {children?: React.ReactNode}) => <span className="underline">{children}</span>,
    'strike-through': ({ children }: {children?: React.ReactNode}) => <span className="line-through opacity-75">{children}</span>,
    code: ({ children }: {children?: React.ReactNode}) => <code className="bg-gray-800 text-purple-300 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
    color: ({ children, value }: {children?: React.ReactNode, value?: {hex: string}}) => 
      <span style={{ color: value?.hex || 'inherit' }}>{children}</span>,
    fontSize: ({ children, value }: {children?: React.ReactNode, value?: {size: string}}) => {
      const sizeClasses = {
        xs: 'text-xs',
        sm: 'text-sm', 
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl'
      };
      return <span className={sizeClasses[value?.size as keyof typeof sizeClasses] || 'text-base'}>{children}</span>;
    },
    link: ({ children, value }: {children?: React.ReactNode, value?: {href: string}}) => 
      <a href={value?.href} className="text-purple-400 hover:text-purple-300 underline transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>
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
    // Remove prose classes to use our own custom styling from ptComponents
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-8 text-gray-200">
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-center font-cinzel-decorative text-white">{article.title}</h1>
      <p className="text-center text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
        Aportado por: {article.authors && article.authors.length > 0 
          ? article.authors.map(author => author.name).join(', ') 
          : 'La Madriguera'}
      </p>
      {article.mainImage && (
        <div className="mb-6 sm:mb-8">
          <Image
            src={urlFor(article.mainImage).url()}
            alt={article.mainImage.alt || article.title}
            width={article.mainImage.asset?.metadata?.dimensions?.width || 800}
            height={article.mainImage.asset?.metadata?.dimensions?.height || 400}
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
      <div className="text-base sm:text-lg lg:text-xl leading-relaxed sm:leading-loose">
        <PortableText value={article.body} components={ptComponents} />
      </div>
    </div>
  );
} 