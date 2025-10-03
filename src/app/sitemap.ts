import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.themadrigueradelunaria.com'
  
  // Obtener todos los artículos de Sanity
  const articles = await client.fetch(`
    *[_type == "post" && !(_id in path("drafts.**"))] {
      "slug": slug.current,
      publishedAt,
      _updatedAt
    }
  `)

  // Obtener todos los autores
  const authors = await client.fetch(`
    *[_type == "author"] {
      "slug": slug.current,
      _updatedAt
    }
  `)

  // URLs estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/sobre-mi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/articulos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/citas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // URLs dinámicas de artículos
  const articlePages: MetadataRoute.Sitemap = articles.map((article: any) => ({
    url: `${baseUrl}/articulos/${article.slug}`,
    lastModified: new Date(article._updatedAt || article.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // URLs dinámicas de autores
  const authorPages: MetadataRoute.Sitemap = authors.map((author: any) => ({
    url: `${baseUrl}/autores/${author.slug}`,
    lastModified: new Date(author._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...articlePages, ...authorPages]
}
