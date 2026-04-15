'use client';

import { Moon, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-900 text-white min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Moon className="w-16 h-16 text-purple-400 mx-auto mb-6 animate-pulse" />
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Las estrellas se desalinearon
          </h1>
          <p className="text-gray-300 mb-2">
            Algo inesperado ha ocurrido en la madriguera.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            {error.message || 'Error desconocido'}
          </p>
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-300 shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}
