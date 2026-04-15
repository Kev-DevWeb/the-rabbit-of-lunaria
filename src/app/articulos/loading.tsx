import { BookOpen } from 'lucide-react';

export default function ArticulosLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <BookOpen className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-bounce" />
        <p className="text-purple-300 text-lg animate-pulse">
          Abriendo el grimorio...
        </p>
      </div>
    </div>
  );
}
