import { Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-night flex items-center justify-center">
      <div className="text-center">
        <Sparkles className="w-12 h-12 text-lavender mx-auto mb-4 animate-spin" />
        <p className="text-lavender text-lg animate-pulse">
          Consultando los arcanos...
        </p>
      </div>
    </div>
  );
}
