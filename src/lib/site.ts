/**
 * Datos públicos del sitio para SEO. El dominio sale de NEXT_PUBLIC_SITE_URL para poder
 * cambiarlo sin tocar código (en Vercel: Settings › Environment Variables).
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.themadrigueradelunaria.com').replace(/\/+$/, '');
export const SITE_NAME = 'La Madriguera de Lunaria';
export const SITE_TAGLINE = 'Tarot y Guía Espiritual';
export const SITE_DESCRIPTION =
  'Lecturas de tarot en línea en español para encontrar claridad y consejo a través de tu guardián espiritual. Tiradas de 3 cartas, lecturas de vidas pasadas y un grimorio con artículos sobre tarot, magia y espiritualidad para brujit@s y personas curiosas.';
export const SITE_AUTHOR = 'Arledge Brer';
export const CONTACT_EMAIL = 'elconejodelunaria@gmail.com';

export const absoluteUrl = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

// Si una página define su propio openGraph, Next ya no hereda la imagen del raíz: hay que repetirla
export const DEFAULT_OG_IMAGES = [
  { url: '/opengraph-image', width: 1200, height: 630, alt: `${SITE_NAME} · ${SITE_TAGLINE}` },
];
