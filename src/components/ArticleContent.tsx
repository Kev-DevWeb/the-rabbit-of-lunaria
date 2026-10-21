'use client';

import { PortableText } from '@portabletext/react';
import { PortableTextBlock } from '@portabletext/types';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/lib/client';
import { getYouTubeEmbedId } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

interface ArticleContentProps {
  body: PortableTextBlock[];
}

export default function ArticleContent({ body }: ArticleContentProps) {
  // Crear componentes con IDs
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
            className="mx-auto my-4 rounded-lg shadow-lg shadow-dusk-500/50"
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
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg shadow-dusk-500/50"
              ></iframe>
            </div>
          );
        }
        return <p>Unsupported embed: {value.url}</p>;
      },
    },
    block: {
      h1: ({ children, value }: {children?: React.ReactNode, value?: PortableTextBlock}) => {
        const id = value?._key ? `heading-${body.indexOf(value)}` : undefined;
        return <h1 id={id} className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold my-6 sm:my-8 text-moon-50 scroll-mt-24">{children}</h1>;
      },
      h2: ({ children, value }: {children?: React.ReactNode, value?: PortableTextBlock}) => {
        const id = value?._key ? `heading-${body.indexOf(value)}` : undefined;
        return <h2 id={id} className="font-label text-xl sm:text-2xl lg:text-3xl font-semibold my-5 sm:my-7 text-moon-50 scroll-mt-24">{children}</h2>;
      },
      h3: ({ children, value }: {children?: React.ReactNode, value?: PortableTextBlock}) => {
        const id = value?._key ? `heading-${body.indexOf(value)}` : undefined;
        return <h3 id={id} className="font-label text-lg sm:text-xl lg:text-2xl font-semibold my-4 sm:my-5 text-gold scroll-mt-24">{children}</h3>;
      },
      h4: ({ children, value }: {children?: React.ReactNode, value?: PortableTextBlock}) => {
        const id = value?._key ? `heading-${body.indexOf(value)}` : undefined;
        return <h4 id={id} className="text-base sm:text-lg lg:text-xl font-semibold my-3 sm:my-4 text-lavender/80 scroll-mt-24">{children}</h4>;
      },
      h5: ({ children }: {children?: React.ReactNode}) => <h5 className="text-base sm:text-lg lg:text-xl font-semibold my-2 sm:my-3 text-lavender/70">{children}</h5>,
      h6: ({ children }: {children?: React.ReactNode}) => <h6 className="text-sm sm:text-base lg:text-lg font-semibold my-2 text-lavender/60">{children}</h6>,
      blockquote: ({ children }: {children?: React.ReactNode}) => <blockquote className="my-6 sm:my-8 rounded-2xl border border-gold/30 bg-dusk px-6 py-5 sm:px-8 sm:py-7 italic text-xl sm:text-2xl leading-snug text-moon-50">{children}</blockquote>,
      normal: ({ children }: {children?: React.ReactNode}) => <p className="mb-5 sm:mb-6 text-lg sm:text-xl text-moon-200 leading-relaxed sm:leading-[1.8]">{children}</p>,
      small: ({ children }: {children?: React.ReactNode}) => <p className="mb-3 sm:mb-4 text-base sm:text-lg lg:text-xl text-moon-300 leading-relaxed">{children}</p>,
      large: ({ children }: {children?: React.ReactNode}) => <p className="mb-5 sm:mb-7 text-xl sm:text-2xl text-moon-100 leading-relaxed sm:leading-loose">{children}</p>,
    },
    list: {
      bullet: ({ children }: {children?: React.ReactNode}) => <ul className="list-disc list-inside mb-4 sm:mb-6 text-lg sm:text-xl text-moon-200 space-y-2 sm:space-y-3 ml-4 marker:text-gold">{children}</ul>,
      number: ({ children }: {children?: React.ReactNode}) => <ol className="list-decimal list-inside mb-4 sm:mb-6 text-lg sm:text-xl text-moon-200 space-y-2 sm:space-y-3 ml-4 marker:text-gold">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }: {children?: React.ReactNode}) => <li className="mb-1 marker:text-gold">{children}</li>,
      number: ({ children }: {children?: React.ReactNode}) => <li className="mb-1 marker:text-gold">{children}</li>,
    },
    marks: {
      strong: ({ children }: {children?: React.ReactNode}) => <strong className="font-bold text-lavender">{children}</strong>,
      em: ({ children }: {children?: React.ReactNode}) => <em className="italic text-moon-100">{children}</em>,
      underline: ({ children }: {children?: React.ReactNode}) => <span className="underline">{children}</span>,
      'strike-through': ({ children }: {children?: React.ReactNode}) => <span className="line-through opacity-75">{children}</span>,
      code: ({ children }: {children?: React.ReactNode}) => <code className="bg-dusk text-lavender px-2 py-1 rounded text-base sm:text-lg lg:text-xl font-mono">{children}</code>,
      color: ({ children, value }: {children?: React.ReactNode, value?: {hex: string}}) => 
        <span style={{ color: value?.hex || 'inherit' }}>{children}</span>,
      fontSize: ({ children, value }: {children?: React.ReactNode, value?: {size: string}}) => {
        const sizeClasses = {
          xs: 'text-xs sm:text-sm',
          sm: 'text-sm sm:text-base', 
          base: 'text-base sm:text-lg lg:text-xl',
          lg: 'text-lg sm:text-xl lg:text-2xl',
          xl: 'text-xl sm:text-2xl lg:text-3xl',
          '2xl': 'text-2xl sm:text-3xl lg:text-4xl',
          '3xl': 'text-3xl sm:text-4xl lg:text-5xl'
        };
        return <span className={sizeClasses[value?.size as keyof typeof sizeClasses] || 'text-base sm:text-lg lg:text-xl'}>{children}</span>;
      },
      link: ({ children, value }: {children?: React.ReactNode, value?: {href: string}}) => 
        <a href={value?.href} className="text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold-200 hover:decoration-gold-200" target="_blank" rel="noopener noreferrer">{children}</a>
    }
  };

  return (
    <div className="lun-article text-base sm:text-lg leading-relaxed">
      <PortableText value={body} components={ptComponents} />
    </div>
  );
}
