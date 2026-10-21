import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGES } from '@/lib/site';

// La página es un componente de cliente: sus metadatos viven en este layout
export const metadata: Metadata = {
  title: 'Sobre mí',
  description:
    'Conoce a la tarotista detrás de La Madriguera de Lunaria: su camino con el tarot, su forma de leer las cartas y cómo te acompaña a escuchar a tu guardián espiritual.',
  alternates: { canonical: '/sobre-mi' },
  openGraph: { url: '/sobre-mi', type: 'profile', images: DEFAULT_OG_IMAGES },
};

export default function SobreMiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
