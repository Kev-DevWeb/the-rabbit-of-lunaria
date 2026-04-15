import StarBackground from '@/components/StarBackground';
import ArticleNavigation from '@/components/ArticleNavigation';
import { client } from '@/sanity/lib/client';

interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
}

const ARTICLES_QUERY = `*[_type == "post"] {
  _id,
  title,
  slug,
  publishedAt,
  "categories": categories[]-> {
    title,
    orderRank,
    parent-> {
      title,
      orderRank,
      parent-> {
        title,
        orderRank,
        parent-> {
          title,
          orderRank
        }
      }
    }
  },
  "categoryOrder": categories[0].orderRank,
  "parentOrder": categories[0].parent.orderRank,
  "grandParentOrder": categories[0].parent.parent.orderRank
} | order(grandParentOrder asc, parentOrder asc, categoryOrder asc, publishedAt asc)`;

export default async function ArticulosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const articles = await client.fetch<Article[]>(ARTICLES_QUERY, {}, {
    next: { revalidate: 3600 }, // Revalidar cada hora (ISR)
  });

  return (
    <div className="relative min-h-screen pt-24">
      <StarBackground />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative container mx-auto px-4 py-8 text-white">
        {children}
        <ArticleNavigation articles={articles} />
      </div>
    </div>
  );
}