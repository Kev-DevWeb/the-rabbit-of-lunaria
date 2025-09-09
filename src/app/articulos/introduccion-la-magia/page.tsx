import Link from 'next/link';
import { articles } from '@/lib/articles'; // Import articles data

// Function to generate metadata for this page
export async function generateMetadata() {
  const article = articles.find(a => a.slug === 'introduccion-la-magia'); // Find the specific article

  if (!article) {
    return {
      title: 'Artículo no encontrado',
      description: 'El artículo que buscas no existe.',
    };
  }

  return {
    title: article.title,
    description: article.description,
    // You can add more SEO meta tags here if needed
    // openGraph: {
    //   title: article.title,
    //   description: article.description,
    //   url: `https://yourwebsite.com/articulos/${article.slug}`,
    //   type: 'article',
    // },
    // twitter: {
    //   card: 'summary_large_image',
    //   title: article.title,
    //   description: article.description,
    // },
  };
}

export default function IntroduccionLaMagiaPage() {
  return (
    <article className="relative container mx-auto px-4 py-8 text-white bg-black/50 backdrop-blur-sm rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-8">Introducción: La Magia</h1>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">¿Qué es la Magia?</h2>
          <p className="text-lg">
            La magia no es buena ni mala; es simplemente el movimiento de la energia acompanada de una intencion consciente. Asi como en la vida, existen acciones con consecuencias positivas o negativas, en la magia la diferencia esta en el proposito y el respeto.
          </p>
          <p className="text-lg mt-4">
            <strong className="text-yellow-500">La magia es karmica:</strong> aquello que envias, ya sea luz o sombra, regresa multiplicado. Por eso, lo mas sabio es procurar usarla siempre para el bien y desde la empatia.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Magia y Espiritualidad</h2>
          <p className="text-lg">
            Practicar magia no te aleja de la divinidad ni de tu fe. En realidad, muchas religiones emplean rituales, altares y oraciones, que son formas de mover energias y enfocar la intencion para atraer milagros o bendiciones.
          </p>
          <p className="text-lg mt-4">
            <span className="font-semibold text-purple-500">La diferencia esta en la intencion y en la actitud:</span> si tu corazon se enfoca en lo negativo, atraeras lo negativo; si te abres a lo positivo, tu camino se iluminara. Cualquier acto magico —ya sean limpias, rituales o lecturas— requiere fe y apertura interior para manifestarse.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Advertencia</h2>
          <div className="mt-10 md:mx-auto p-7 rounded-2xl bg-black/80 text-white text-2xl md:text-3xl font-bold text-center shadow-[0_0_32px_8px_rgba(167,139,250,0.5)] ring-2 ring-violet-200/60 backdrop-blur-lg max-w-2xl">
            <span className="block text-pink-200 text-lg tracking-widest pb-2 font-bold uppercase">Importante</span>
            <span className="block text-white text-xl md:text-2xl font-normal leading-relaxed">
              Si decides practicar magia,{' '}
              <Link href="/articulos?q=protecciones" className="text-purple-400 underline">
                protégete
              </Link>{' '}
              siempre y asegúrate de saber lo que haces.<br className="hidden md:block"/>
              De lo contrario, podrías atraer energías o entidades no deseadas que se aprovechen del desconocimiento o falta de protección.<br className="hidden md:block"/>
              <span className="text-violet-200 font-bold">La magia es un arte poderoso, y como todo poder, merece respeto y responsabilidad.</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
