import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import Image from 'next/image';
import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGES } from '@/lib/site';

interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: SanityImageSource & { alt?: string };
}

interface Author {
  name: string;
  posts: Article[];
}

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

async function getAuthorPosts(slug: string) {
  const query = `*[_type == "author" && slug.current == $slug][0] {
    name,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt asc) {
      _id,
      title,
      slug,
      mainImage {
        ...,
        asset->{
          ...,
          metadata
        }
      }
    }
  }`;
  const author = await client.fetch<Author>(query, { slug });
  return author;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorPosts(slug).catch(() => null);
  if (!author) return { title: 'Autor no encontrado', robots: { index: false } };
  return {
    title: `Artículos de ${author.name}`,
    description: `${author.posts?.length ?? 0} artículos de ${author.name} en el grimorio de La Madriguera de Lunaria: tarot, magia y espiritualidad.`,
    alternates: { canonical: `/autores/${slug}` },
    openGraph: { url: `/autores/${slug}`, type: 'profile', images: DEFAULT_OG_IMAGES },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = await getAuthorPosts(slug);

  if (!author) {
    return <div className="text-center text-moon-50 py-10">Aportador no encontrado.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-moon-50">
      <h1 className="text-4xl font-bold mb-8 text-center font-cinzel-decorative">Aportes de {author.name}</h1>
      <div className="max-w-4xl mx-auto">
        {author.posts.length > 0 ? (
          <ul>
            {author.posts.map((article) => (
              <li key={article._id} className="mb-4 flex items-center">
                {article.mainImage && (
                  <Image
                    src={urlFor(article.mainImage).width(80).height(80).url()}
                    alt={article.mainImage.alt || article.title}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                )}
                <Link href={`/articulos/${article.slug.current}`}>
                  <p className="text-2xl hover:text-lavender">{article.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">Este aportador aún no tiene artículos.</p>
        )}
      </div>
    </div>
  );
}
