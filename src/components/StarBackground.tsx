"use client";
import React, { useEffect, useRef, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

/**
 * Simple example constellation: array of { x, y, isBigStar }
 */
const exampleConstellation = [
  { x: 90, y: 60, isBigStar: true },
  { x: 110, y: 160 },
  { x: 180, y: 120, isBigStar: true },
  { x: 220, y: 80 },
  { x: 250, y: 180 },
  { x: 300, y: 140, isBigStar: true }
];

function drawLines(points: { x: number, y: number }[]) {
  let d = '';
  for (let i = 0; i < points.length - 1; ++i) {
    d += `M${points[i].x},${points[i].y} L${points[i + 1].x},${points[i + 1].y} `;
  }
  return d;
}

const StarBackground = ({
  constellation = exampleConstellation,
  width = 400,
  height = 240
}: {
  constellation?: Array<{ x: number; y: number; isBigStar?: boolean }>;
  width?: number;
  height?: number;
}) => {
  const svgRef = useRef(null);
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async engine => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  useGSAP(() => {
    if (svgRef.current) {
      gsap.fromTo(
        "#constellation-star",
        { scale: 0.89, opacity: 0.3 },
        {
          scale: 1.14,
          opacity: 1,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          stagger: 0.22,
          ease: "power1.inOut"
        }
      );
      gsap.fromTo(
        "#constellation-line",
        { opacity: 0.2 },
        { opacity: 1, duration: 0.7, repeat: -1, yoyo: true, stagger: 0.14 }
      );
    }
  }, [constellation]);

  // Particle background config
  const particleOptions = {
    background: { color: { value: "#000" } },
    fpsLimit: 60,
    particles: { number: { value: 130 }, color: { value: "#fff" }, opacity: { value: { min: 0.12, max: 0.65 } }, size: { value: { min: 1, max: 2.2 } }, move: { enable: true, speed: 0.2, direction: "none" as const, straight: false } },
  };

  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none" style={{ background: 'transparent' }}>
      <div className="absolute inset-0 z-0 w-full h-full">
        {init && <Particles id="tsparticles-bg" options={particleOptions} />}
      </div>
      <div
        className="absolute left-1/2 top-1/2 z-40"
        style={{ transform: `translate(-50%, -50%)`, width, height }}
      >
        <svg ref={svgRef} width={width} height={height}>
          {/* Constelación: líneas */}
          <path
            id="constellation-line"
            d={drawLines(constellation)}
            stroke="#fff5"
            strokeWidth={2.5}
            fill="none"
          />
          {/* Estrellas */}
          {constellation.map((pt, i) => (
            <circle
              id="constellation-star"
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={pt.isBigStar ? 7 : 4.6}
              fill="#fff"
              filter={pt.isBigStar ? 'drop-shadow(0 0 14px #ad84f7)' : 'drop-shadow(0 0 10px #9170fa)'}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default StarBackground;
