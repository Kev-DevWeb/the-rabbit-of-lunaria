import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/site';

// Imagen que aparece al compartir el sitio en WhatsApp, Facebook, X, etc. (1200×630)
export const alt = `${SITE_NAME} · ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Estrellas fijas (deterministas) para que la imagen sea siempre igual
const STARS = Array.from({ length: 70 }, (_, i) => {
  const x = (i * 7919) % 1200;
  const y = (i * 104729) % 630;
  const r = 1 + ((i * 31) % 3);
  return { x, y, r, o: 0.35 + ((i * 17) % 60) / 100 };
});

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 30%, #2a1f66 0%, #110e2b 45%, #07061a 80%)',
          color: '#fdf8ff',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {STARS.map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: s.x,
              top: s.y,
              width: s.r * 2,
              height: s.r * 2,
              borderRadius: '50%',
              background: '#fff8e1',
              opacity: s.o,
            }}
          />
        ))}
        <div
          style={{
            width: 170,
            height: 170,
            borderRadius: '50%',
            background: '#f3ecd2',
            boxShadow: '0 0 90px 30px rgba(233,196,106,0.45)',
            marginBottom: 46,
            display: 'flex',
          }}
        />
        <div style={{ fontSize: 30, letterSpacing: 12, color: '#e9c46a', textTransform: 'uppercase', display: 'flex' }}>
          Tarot · Luna · Grimorio
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, marginTop: 18, display: 'flex' }}>{SITE_NAME}</div>
        <div style={{ fontSize: 34, color: '#d7cfef', marginTop: 14, display: 'flex' }}>
          Lecturas de tarot en línea y guía espiritual
        </div>
      </div>
    ),
    size,
  );
}
