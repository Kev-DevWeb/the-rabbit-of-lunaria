import type { Metadata } from 'next';
import { readingsData } from '@/lib/readings-data';
import { DEFAULT_OG_IMAGES, SITE_NAME, absoluteUrl } from '@/lib/site';

// La página es un componente de cliente: sus metadatos y datos estructurados viven en este layout
export const metadata: Metadata = {
  title: 'Agenda tu lectura de tarot en línea',
  description: `Agenda una lectura de tarot en línea: ${readingsData.map((r) => `${r.title} (${r.price})`).join(', ')}. Pago con PayPal o transferencia y confirmación por correo.`,
  alternates: { canonical: '/citas' },
  openGraph: { url: '/citas', type: 'website', images: DEFAULT_OG_IMAGES },
};

// Cada lectura como servicio con precio, para que Google y los asistentes de IA puedan citarla
const servicesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `Lecturas de tarot de ${SITE_NAME}`,
  itemListElement: readingsData.map((reading, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Service',
      name: reading.title,
      description: reading.description,
      serviceType: 'Lectura de tarot',
      provider: { '@id': absoluteUrl('/#organization') },
      areaServed: 'MX',
      availableChannel: { '@type': 'ServiceChannel', serviceUrl: absoluteUrl('/citas') },
      offers: {
        '@type': 'Offer',
        price: reading.priceValue.toFixed(2),
        priceCurrency: 'MXN',
        url: absoluteUrl('/citas'),
        availability: 'https://schema.org/InStock',
      },
    },
  })),
};

export default function CitasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }} />
      {children}
    </>
  );
}
