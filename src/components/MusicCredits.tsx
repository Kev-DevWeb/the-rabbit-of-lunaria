'use client';

import { useAudio } from '@/context/AudioProvider';
import { useState } from 'react';
import { Music } from 'lucide-react';

export default function MusicCredits() {
  const { trackList } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);

  if (trackList.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-lg hover:bg-black/80 transition-all text-sm"
      >
        <Music size={16} />
        <span>Créditos Musicales</span>
      </button>

      {isExpanded && (
        <div className="mt-2 bg-black/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-xl max-w-xs">
          <h3 className="text-sm font-semibold mb-3 text-purple-300">🎵 Música Utilizada</h3>
          <div className="space-y-3">
            {trackList.map((track, index) => (
              <div key={index} className="text-xs">
                <div className="font-medium">{track.title}</div>
                <div className="text-gray-300">{track.artist}</div>
                <div className="text-gray-400 italic">{track.credits}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-600 text-xs text-gray-400">
            <p>Agradecemos a todos los artistas por su música.</p>
          </div>
        </div>
      )}
    </div>
  );
}