// Silueta de colinas y pasto dibujada en SVG: cubre todo el ancho sin recortes
// (sustituye a siluetabosque.png, que tenía un borde recto a la derecha).

const WIDTH = 2400;
const HEIGHT = 260;

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Colina suave: una curva por tramos con alturas pseudoaleatorias deterministas
function hillPath(seed: number, base: number, amplitude: number, segments: number) {
  const rnd = seeded(seed);
  const step = WIDTH / segments;
  let d = `M0 ${HEIGHT} L0 ${base - rnd() * amplitude}`;
  for (let i = 1; i <= segments; i++) {
    const x = i * step;
    const y = base - rnd() * amplitude;
    d += ` Q${x - step / 2} ${base - amplitude * (0.5 + rnd() * 0.6)} ${x} ${y}`;
  }
  return `${d} L${WIDTH} ${HEIGHT} Z`;
}

// Hojas de pasto: triángulos curvos que se inclinan un poco hacia los lados
function grassPath(seed: number, base: number, minH: number, maxH: number, gap: number) {
  const rnd = seeded(seed);
  let d = '';
  for (let x = -10; x < WIDTH + 10; x += gap * (0.6 + rnd() * 0.8)) {
    const h = minH + rnd() * (maxH - minH);
    const w = 3 + rnd() * 5;
    const lean = (rnd() - 0.5) * h * 0.5;
    const tipX = x + lean;
    const tipY = base - h;
    d += `M${x - w} ${base} Q${x - w * 0.3 + lean * 0.4} ${base - h * 0.55} ${tipX} ${tipY} Q${x + w * 0.4 + lean * 0.4} ${base - h * 0.5} ${x + w} ${base} Z `;
  }
  return d;
}

const BACK_HILL = hillPath(11, 150, 60, 9);
const FRONT_HILL = hillPath(23, 205, 35, 14);
const BACK_GRASS = grassPath(37, 212, 18, 60, 9);
const FRONT_GRASS = grassPath(53, HEIGHT, 25, 105, 7);

export default function ForestSilhouette({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMax slice"
      className={`pointer-events-none block h-full w-full ${className}`}
    >
      <path d={BACK_HILL} fill="#120e30" />
      <path d={FRONT_HILL} fill="#0b0920" />
      <path d={BACK_GRASS} fill="#0b0920" />
      <path d={FRONT_GRASS} fill="#050412" />
      <rect x="0" y={HEIGHT - 6} width={WIDTH} height="6" fill="#050412" />
    </svg>
  );
}
