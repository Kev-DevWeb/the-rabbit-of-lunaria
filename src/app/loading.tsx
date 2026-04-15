import { Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
        <p className="text-purple-300 text-lg animate-pulse">
          Consultando los arcanos...
        </p>
      </div>
    </div>
  );
}
