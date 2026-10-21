import type { Metadata } from 'next';

// Páginas de resultado de una cita: no deben aparecer en buscadores
export const metadata: Metadata = {
  title: 'Estado de tu cita',
  robots: { index: false, follow: false },
};

export default function ConfirmationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
