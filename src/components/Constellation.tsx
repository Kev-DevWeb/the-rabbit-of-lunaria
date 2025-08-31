"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const constellations = {
  "ursa-major": {
    viewBox: "0 0 100 100",
    path: "M 10 10 L 20 20 L 40 15 L 60 25 L 80 20 L 90 30 L 70 50",
    stars: [
      { cx: 10, cy: 10, r: 1.5 },
      { cx: 20, cy: 20, r: 1.2 },
      { cx: 40, cy: 15, r: 1.0 },
      { cx: 60, cy: 25, r: 1.5 },
      { cx: 80, cy: 20, r: 1.2 },
      { cx: 90, cy: 30, r: 1.0 },
      { cx: 70, cy: 50, r: 1.5 },
    ],
  },
  "orion": {
    viewBox: "0 0 100 100",
    path: "M 20 20 L 30 40 L 50 35 L 70 50 L 80 70 M 30 40 L 40 60 M 50 35 L 60 55",
    stars: [
      { cx: 20, cy: 20, r: 1.5 },
      { cx: 30, cy: 40, r: 1.8 },
      { cx: 50, cy: 35, r: 1.5 },
      { cx: 70, cy: 50, r: 1.2 },
      { cx: 80, cy: 70, r: 1.5 },
      { cx: 40, cy: 60, r: 1.0 },
      { cx: 60, cy: 55, r: 1.0 },
    ],
  },
  "cassiopeia": {
    viewBox: "0 0 100 100",
    path: "M 10 50 L 30 30 L 50 50 L 70 30 L 90 50",
    stars: [
      { cx: 10, cy: 50, r: 1.5 },
      { cx: 30, cy: 30, r: 1.2 },
      { cx: 50, cy: 50, r: 1.5 },
      { cx: 70, cy: 30, r: 1.2 },
      { cx: 90, cy: 50, r: 1.5 },
    ],
  },
  "leo": {
    viewBox: "0 0 100 100",
    path: "M 10 50 L 20 40 L 30 50 L 40 45 L 50 50 L 60 40 L 70 50 L 80 40 L 90 50",
    stars: [
      { cx: 10, cy: 50, r: 1.5 },
      { cx: 20, cy: 40, r: 1.2 },
      { cx: 30, cy: 50, r: 1.5 },
      { cx: 40, cy: 45, r: 1.0 },
      { cx: 50, cy: 50, r: 1.5 },
      { cx: 60, cy: 40, r: 1.2 },
      { cx: 70, cy: 50, r: 1.5 },
      { cx: 80, cy: 40, r: 1.2 },
      { cx: 90, cy: 50, r: 1.5 },
    ],
  },
};

const Constellation = ({ name, className = "" }) => {
  const constellation = constellations[name];
  const constellationRef = useRef(null);

  useGSAP(() => {
    if (constellationRef.current) {
      const stars = constellationRef.current.querySelectorAll('.constellation-star');
      const lines = constellationRef.current.querySelectorAll('.constellation-line');

      gsap.set(constellationRef.current, { opacity: 0, scale: 0.8 });
      gsap.to(constellationRef.current, {
        opacity: 0.6,
        scale: 1,
        duration: 5,
        ease: "power1.inOut",
      });

      stars.forEach((star) => {
        gsap.to(star, {
          opacity: 0.5,
          scale: 0.8,
          duration: 2 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: Math.random() * 2,
        });
      });

      lines.forEach((line) => {
        gsap.to(line, {
          opacity: 0.5,
          duration: 3 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: Math.random() * 3,
        });
      });
    }
  }, { scope: constellationRef });

  if (!constellation) {
    return null;
  }

  return (
    <div
      ref={constellationRef}
      className={`absolute top-0 left-0 w-full h-full flex items-center justify-center ${className}`}
    >
      <svg
        viewBox={constellation.viewBox}
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))' }}
      >
        <path
          d={constellation.path}
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          strokeLinecap="round"
          className="constellation-line"
        />
        {constellation.stars.map((star, index) => (
          <circle
            key={index}
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            fill="white"
            className="constellation-star"
          />
        ))}
      </svg>
    </div>
  );
};

export default Constellation;