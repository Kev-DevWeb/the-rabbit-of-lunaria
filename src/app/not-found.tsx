import { Moon, Home, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <Moon className="w-24 h-24 text-purple-400 mx-auto mb-8 opacity-50" />
        <h1 className="text-6xl font-bold mb-2 font-cinzel-decorative text-purple-300">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-4 text-gray-300">
          Este sendero no existe
        </h2>
        <p className="text-gray-400 text-lg mb-8">
          La página que buscas se ha perdido entre las sombras de la madriguera.
          Quizás las cartas te guíen a otro camino.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:scale-105"
          >
            <Home className="w-4 h-4" />
            Volver al inicio
          </Link>
          <Link
            href="/articulos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-all duration-300 border border-purple-500/30"
          >
            <BookOpen className="w-4 h-4" />
            Explorar el Grimorio
          </Link>
        </div>
      </div>
    </div>
  );
}
