'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 10;
const frameSrc = (n: number) => encodeURI(`/CELL ${n}_Grimorio.png`);

// Chispas que suben del libro hacia las manos del conejo mientras se anima
const SPARKS = [18, 30, 42, 50, 58, 70, 82, 36, 64, 46].map((left, i) => ({ left, delay: i * 0.18 }));

/**
 * El conejo lanzando un hechizo desde el grimorio.
 * CELL_Conejo.png y los cuadros CELL n_Grimorio.png comparten el mismo lienzo de 2500px,
 * así que se apilan al mismo tamaño y quedan alineados: el libro bajo los brazos del conejo.
 * Al pasar el cursor (o enfocar) el libro corre sus 10 cuadros; al hacer clic lleva al grimorio.
 */
export default function RabbitGrimoire({ className = '' }: { className?: string }) {
  const [frame, setFrame] = useState(1);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Precarga para que la primera animación no parpadee
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new window.Image();
      img.src = frameSrc(i);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const start = () => {
    setOpen(true);
    if (timer.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer.current = setInterval(() => setFrame((f) => (f >= FRAME_COUNT ? 1 : f + 1)), 100);
  };

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setOpen(false);
    setFrame(1);
  };

  return (
    <div className={`relative aspect-[340/400] w-[min(340px,70vw)] ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 300 300"
        data-open={open}
        className="lun-ring absolute left-[2.9%] top-[22.5%] w-[94%]"
        style={{ opacity: open ? 1 : 0.55 }}
        fill="none"
        stroke="#e9c46a"
        strokeWidth="1"
      >
        <circle cx="150" cy="150" r="138" strokeDasharray="2 7" />
        <circle cx="150" cy="150" r="118" stroke="rgba(201,184,255,.45)" />
        <path d="M150 4v14M150 282v14M4 150h14M282 150h14M47 47l10 10M243 243l10 10M253 47l-10 10M57 243l-10 10" />
        <text x="150" y="30" fill="#e9c46a" stroke="none" fontSize="13" textAnchor="middle" letterSpacing="6">
          ᚱ ᛟ ᛗ
        </text>
      </svg>

      {open && (
        <div aria-hidden="true" className="absolute inset-0">
          {SPARKS.map((s) => (
            <span key={s.left} className="lun-spark bottom-[22%]" style={{ left: `${s.left}%`, animationDelay: `${s.delay}s` }} />
          ))}
        </div>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element -- mismo lienzo que los cuadros del libro, sin optimizar */}
      <img
        src="/CELL_Conejo.png"
        alt="El conejo de Lunaria lanzando un hechizo desde el grimorio"
        className="pointer-events-none absolute left-0 top-0 h-[85%] w-full object-contain"
      />

      <Link
        href="/articulos"
        aria-label="Entrar a El grimorio de Lunaria"
        onPointerEnter={start}
        onPointerLeave={stop}
        onFocus={start}
        onBlur={stop}
        className="absolute left-[17.6%] top-[37.5%] block h-[48.75%] w-[64.7%] rounded-3xl transition-[transform,filter] duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.06] hover:drop-shadow-[0_0_26px_rgba(233,196,106,0.7)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        {/* Etiqueta <img> nativa: la optimización de next/image recorta o retrasa los cuadros rápidos */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={frameSrc(frame)}
          alt=""
          className="pointer-events-none absolute left-[-27.27%] top-[-76.9%] h-[174.4%] w-[154.5%] max-w-none object-contain"
        />
      </Link>
    </div>
  );
}
