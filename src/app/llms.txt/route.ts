import { readingsData } from '@/lib/readings-data';
import { CONTACT_EMAIL, SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from '@/lib/site';

// /llms.txt: resumen en Markdown para asistentes de IA (formato propuesto en llmstxt.org).
// Les da en un solo archivo qué es el sitio, qué servicios ofrece y dónde están los artículos.
export const revalidate = 3600;

interface ArticleLink {
  title: string;
  slug: string;
  excerpt?: string;
}

export async function GET() {
  let articles: ArticleLink[] = [];
  try {
    // Import dinámico: si falta la configuración de Sanity, llms.txt sale igual sin la lista de artículos
    const { client } = await import('@/sanity/lib/client');
    articles = await client.fetch<ArticleLink[]>(
      `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc)[0...100]{
        title, "slug": slug.current, "excerpt": coalesce(metaDescription, array::join(string::split(pt::text(body), "")[0...160], ""))
      }`,
    );
  } catch (error) {
    console.error('llms.txt: no se pudieron leer los artículos', error);
  }

  const services = readingsData
    .map((r) => `- [${r.title}](${absoluteUrl('/citas')}): ${r.description} Precio: ${r.price}. Duración: ${r.duration} minutos.`)
    .join('\n');

  const articleLines = articles.length
    ? articles.map((a) => `- [${a.title}](${absoluteUrl(`/articulos/${a.slug}`)})${a.excerpt ? `: ${a.excerpt.replace(/\s+/g, ' ').trim()}` : ''}`).join('\n')
    : `- [El grimorio de Lunaria](${absoluteUrl('/articulos')})`;

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

Sitio en español (México). Las lecturas de tarot son en línea y se agendan en ${absoluteUrl('/citas')} con pago por PayPal o transferencia bancaria. Contacto: ${CONTACT_EMAIL}.

## Lecturas de tarot

${services}

## Páginas principales

- [Inicio](${absoluteUrl('/')}): presentación de La Madriguera de Lunaria y sus lecturas.
- [Agendar cita](${absoluteUrl('/citas')}): calendario con horarios disponibles (hora del centro de México).
- [Sobre mí](${absoluteUrl('/sobre-mi')}): la tarotista detrás del sitio.
- [El grimorio de Lunaria](${absoluteUrl('/articulos')}): biblioteca de artículos sobre tarot, magia y espiritualidad.

## Artículos del grimorio

${articleLines}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
