import { Moon, Home, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-night flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <Moon className="w-24 h-24 text-lavender mx-auto mb-8 opacity-50" />
        <h1 className="text-6xl font-bold mb-2 font-cinzel-decorative text-lavender">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-4 text-moon-300">
          Este sendero no existe
        </h2>
        <p className="text-moon-500 text-lg mb-8">
          La página que buscas se ha perdido entre las sombras de la madriguera.
          Quizás las cartas te guíen a otro camino.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-glow hover:bg-dusk-500 text-moon-50 rounded-lg transition-all duration-300 shadow-lg hover:scale-105"
          >
            <Home className="w-4 h-4" />
            Volver al inicio
          </Link>
          <Link
            href="/articulos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-dusk hover:bg-dusk-700 text-moon-200 rounded-lg transition-all duration-300 border border-lavender/30"
          >
            <BookOpen className="w-4 h-4" />
            Explorar el Grimorio
          </Link>
        </div>
      </div>
    </div>
  );
}
