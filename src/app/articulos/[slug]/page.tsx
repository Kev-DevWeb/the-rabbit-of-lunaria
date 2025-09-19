import { articles } from '@/lib/articles';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return {};
  }

  const title = article.title;
  const description = article.description;
  const url = `https://the-rabbit-of-lunaria.vercel.app/articulos/${article.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      // You might want to add an image specific to the article here
      // images: [{ url: article.image || 'https://www.lamadrigueradelunaria.com/default-article-og.jpg' }],
    },
  };
}

export default async function ArticuloPage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": "https://the-rabbit-of-lunaria.vercel.app/default-article-image.jpg",
    "author": {
      "@type": "Person",
      "name": "La madriguera de Lunaria" // Replace with actual author if available
    },
    "publisher": {
      "@type": "Organization",
      "name": "La madriguera de Lunaria",
      "logo": {
        "@type": "ImageObject",
        "url": "https://the-rabbit-of-lunaria.vercel.app/logo.png"
      }
    },
    "datePublished": "2023-01-01T00:00:00Z", // Replace with actual publication date
    "dateModified": "2023-01-01T00:00:00Z", // Replace with actual modification date
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://the-rabbit-of-lunaria.vercel.app/articulos/${slug}`
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-4xl font-bold mb-8">{article.title}</h1>
      <p>{article.description}</p> {/* Display description as placeholder for content */}
      {/* Here you would render the actual content of the article */}
    </div>
  );
}