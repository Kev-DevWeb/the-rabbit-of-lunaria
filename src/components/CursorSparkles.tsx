'use client';

import gsap from 'gsap';
import { useEffect, useRef } from 'react';

const MAX_SPARKS = 8;
const SPAWN_EVERY_MS = 45;

// Estela de chispas doradas que siguen al cursor. Solo con mouse y sin "reducir movimiento".
export default function CursorSparkles() {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced || !layer.current) return;

    const root = layer.current;
    let last = 0;

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - last < SPAWN_EVERY_MS || root.childElementCount >= MAX_SPARKS) return;
      last = now;

      const spark = document.createElement('span');
      const size = 3 + Math.random() * 4;
      spark.style.cssText = `position:absolute;left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;border-radius:50%;background:#f6dc9a;box-shadow:0 0 8px #e9c46a;transform:translate(-50%,-50%)`;
      root.appendChild(spark);

      gsap.to(spark, {
        x: gsap.utils.random(-14, 14),
        y: gsap.utils.random(8, 26),
        scale: 0.2,
        autoAlpha: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => spark.remove(),
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      root.replaceChildren();
    };
  }, []);

  return <div ref={layer} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" />;
}
