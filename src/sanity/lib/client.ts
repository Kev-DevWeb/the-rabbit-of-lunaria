import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

/**
 * Helper de fetch con revalidación ISR integrada.
 * Usa esto en Server Components para queries con cache automático.
 * 
 * @param query - GROQ query string
 * @param params - Parámetros del query (opcional)
 * @param revalidate - Segundos para revalidar (default: 3600 = 1 hora)
 * 
 * @example
 * ```ts
 * const posts = await cachedFetch<Post[]>(
 *   '*[_type == "post"] | order(publishedAt desc)',
 *   {},
 *   1800 // revalidar cada 30 minutos
 * );
 * ```
 */
export async function cachedFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  revalidate: number = 3600,
): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { revalidate },
  });
}
