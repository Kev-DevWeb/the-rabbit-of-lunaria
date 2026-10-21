'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';

// Polvo de estrellas que titila con un shader propio (más barato que tsparticles).
const starVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSize;
  attribute float aPhase;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    vAlpha = 0.45 + 0.55 * sin(uTime * 1.3 + aPhase);
    gl_PointSize = aSize * uPixelRatio * (30.0 / -mv.z);
  }
`;

const starFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * vAlpha);
  }
`;

// Niebla: ruido fbm que se desplaza lento, con bordes suaves.
const fogVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fogFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uSeed;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }
  void main() {
    vec2 uv = vUv;
    float n = fbm(uv * vec2(3.0, 1.6) + vec2(uTime * 0.025 + uSeed, uTime * 0.008));
    float edge = smoothstep(0.0, 0.35, uv.y) * smoothstep(1.0, 0.55, uv.y)
               * smoothstep(0.0, 0.2, uv.x) * smoothstep(1.0, 0.8, uv.x);
    gl_FragColor = vec4(uColor, n * n * edge * uOpacity);
  }
`;

type StarLayerProps = { count: number; depth: number; size: number; color: string; seed: number };

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function StarLayer({ count, depth, size, color, seed }: StarLayerProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();

  const geometry = useMemo(() => {
    const rnd = seeded(seed);
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rnd() - 0.5) * 70;
      // Alto de sobra hacia abajo: la escena acompaña todo el scroll del inicio
      positions[i * 3 + 1] = 22 - rnd() * 60;
      positions[i * 3 + 2] = -depth - rnd() * 4;
      sizes[i] = size * (0.5 + rnd());
      phases[i] = rnd() * Math.PI * 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    return g;
  }, [count, depth, size, seed]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.5) },
      uColor: { value: new THREE.Color(color) },
    }),
    [color, gl],
  );

  useFrame((state) => {
    if (material.current) material.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={material}
        vertexShader={starVertex}
        fragmentShader={starFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FogBank({ position, scale, seed, opacity }: { position: [number, number, number]; scale: [number, number]; seed: number; opacity: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#8fa8d8') },
      uOpacity: { value: opacity },
      uSeed: { value: seed },
    }),
    [opacity, seed],
  );

  useFrame((state) => {
    if (material.current) material.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh position={position}>
      <planeGeometry args={[scale[0], scale[1]]} />
      <shaderMaterial
        ref={material}
        vertexShader={fogVertex}
        fragmentShader={fogFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

// Parallax: la cámara sigue al cursor y baja despacio con el scroll (las capas cercanas se mueven más)
function Rig({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const { camera } = useThree();
  useFrame((_, dt) => {
    const p = pointer.current ?? { x: 0, y: 0 };
    const scroll = Math.min(window.scrollY / window.innerHeight, 8);
    const k = Math.min(1, dt * 2.5);
    camera.position.x += (p.x * 1.4 - camera.position.x) * k;
    camera.position.y += (p.y * 0.8 - scroll * 0.9 - camera.position.y) * k;
    camera.lookAt(0, -scroll * 0.9, -12);
  });
  return null;
}

// Se prueba una sola vez por sesión y el contexto de prueba se libera:
// el navegador limita los contextos WebGL activos (~16) y tiraría el de la escena real.
let webglSupport: boolean | null = null;

function hasWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
    ctx?.getExtension('WEBGL_lose_context')?.loseContext();
    webglSupport = !!ctx;
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

export default function LunarScene({ className = '', portal = false }: { className?: string; portal?: boolean }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [supported, setSupported] = useState(false);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setSupported(hasWebGL());
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(media.matches);
    const onChange = () => setReduced(media.matches);
    media.addEventListener('change', onChange);

    const onMove = (e: PointerEvent) => {
      pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: -((e.clientY / window.innerHeight) * 2 - 1) };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      media.removeEventListener('change', onChange);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  // Pausar el render cuando el hero sale de pantalla
  useEffect(() => {
    if (!wrapper.current) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    io.observe(wrapper.current);
    return () => io.disconnect();
  }, []);

  const scene = (
    <div ref={wrapper} aria-hidden="true" className={`pointer-events-none ${className}`}>
      {supported && (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 6], fov: 55 }}
          gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
          frameloop={reduced ? 'demand' : inView ? 'always' : 'never'}
        >
          <StarLayer count={1300} depth={30} size={2.2} color="#fff8e1" seed={7} />
          <StarLayer count={650} depth={18} size={2.8} color="#c9b8ff" seed={13} />
          <StarLayer count={230} depth={9} size={3.4} color="#f6dc9a" seed={29} />
          <FogBank position={[-6, -5.5, -6]} scale={[26, 7]} seed={1.3} opacity={0.35} />
          <FogBank position={[7, -7, -4]} scale={[28, 8]} seed={4.1} opacity={0.28} />
          {!reduced && <Rig pointer={pointer} />}
        </Canvas>
      )}
    </div>
  );

  // Como fondo fijo va directo en <body>: un transform o filter en algún ancestro
  // (p. ej. la transición de página) haría que `position: fixed` deje de ser relativo a la ventana
  return portal ? createPortal(scene, document.body) : scene;
}
