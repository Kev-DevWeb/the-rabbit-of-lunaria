'use client';

import { useEffect, useState } from 'react';

// Avance de lectura como una luna que se va llenando: de nueva a llena al terminar el artículo.
export default function MoonReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // La sombra se corre de derecha a izquierda conforme avanza la lectura
  const shadowX = 17 + (progress / 100) * 30;
  const rounded = Math.round(progress);

  return (
    <div
      role="progressbar"
      aria-label="Avance de lectura"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={rounded}
      className="fixed bottom-6 left-6 z-40 flex items-center gap-3 rounded-full border border-lavender/20 bg-night/80 py-2 pl-2 pr-4 font-label text-xs tracking-[0.2em] text-moon-500 backdrop-blur-md"
    >
      <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34">
        <defs>
          <clipPath id="lun-moon-clip">
            <circle cx="17" cy="17" r="14" />
          </clipPath>
        </defs>
        <circle cx="17" cy="17" r="15" fill="#171236" stroke="rgba(201,184,255,.4)" />
        <g clipPath="url(#lun-moon-clip)">
          <circle cx="17" cy="17" r="14" fill="#e9c46a" />
          <circle cx={shadowX} cy="17" r="14" fill="#171236" />
        </g>
      </svg>
      FASE {rounded}%
    </div>
  );
}
