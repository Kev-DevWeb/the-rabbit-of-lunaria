'use client';

import { Moon, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <Moon className="w-20 h-20 text-purple-400 mx-auto mb-8 animate-pulse" />
        <h1 className="text-4xl font-bold mb-4 font-cinzel-decorative bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400 bg-clip-text text-transparent">
          Un portal se ha cerrado
        </h1>
        <p className="text-gray-300 text-lg mb-2">
          Las energías se han desalineado momentáneamente.
        </p>
        <p className="text-gray-500 text-sm mb-8 font-mono">
          {error.message || 'Error inesperado'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-300 shadow-lg hover:scale-105"
          >
            <RefreshCw className="w-4 h-4" />
            Realinear energías
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors duration-300 border border-purple-500/30"
          >
            <Home className="w-4 h-4" />
            Volver a la madriguera
          </Link>
        </div>
      </div>
    </div>
  );
}
