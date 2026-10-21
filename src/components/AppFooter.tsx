'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Music, Heart, Instagram, Palette, Code } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CREDITS = [
  {
    icon: Music,
    title: 'Música Ambiente',
    body: (
      <>
        Agradecimiento especial a{' '}
        <a href="https://www.youtube.com/@erinmusicbox" target="_blank" rel="noopener noreferrer" className="lun-link text-gold">
          erinmusicbox
        </a>{' '}
        por su hermosa música que acompaña este espacio mágico
      </>
    ),
  },
  {
    icon: Palette,
    title: 'Ilustración Grimorio',
    body: (
      <>
        Ilustraciones y animación del grimorio por{' '}
        <a href="https://www.instagram.com/woolysolid0619_oficial/" target="_blank" rel="noopener noreferrer" className="lun-link inline-flex items-center gap-1 text-gold">
          <Instagram className="h-3.5 w-3.5" aria-hidden="true" />
          WoolySolid 0619
        </a>
      </>
    ),
  },
  {
    icon: Heart,
    title: 'Creado con Amor',
    body: <>Este espacio fue creado con amor y dedicación para acompañarte en tu camino espiritual</>,
  },
];

const AppFooter = () => {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.footer-item', {
        autoAlpha: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: footerRef.current, start: 'top 95%', toggleActions: 'play none none none' },
      });
    });
    return () => mm.revert();
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="relative w-full overflow-hidden border-t border-lavender/12 bg-night">
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14">
        <div className="footer-item flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-3 font-display text-xl text-moon-50">
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e9c46a" strokeWidth="1.5">
              <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
            </svg>
            La Madriguera de Lunaria
          </div>
          <p className="m-0 max-w-md text-base text-moon-500">Un espacio mágico de guía espiritual y sabiduría ancestral</p>
          <nav aria-label="Pie de página" className="mt-2 flex flex-wrap justify-center gap-6 font-label text-sm tracking-[0.08em]">
            <Link href="/sobre-mi" className="lun-link">Sobre mí</Link>
            <Link href="/articulos" className="lun-link">Grimorio</Link>
            <Link href="/citas" className="lun-link">Agendar</Link>
            <a href="mailto:elconejodelunaria@gmail.com" className="lun-link">Contacto</a>
          </nav>
        </div>

        <div aria-hidden="true" className="my-10 text-center tracking-[0.6em] text-gold">✦ ☾ ✦</div>

        <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
          {CREDITS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="footer-item lun-card flex items-start gap-3 p-5">
              <Icon className="mt-1 h-5 w-5 flex-shrink-0 text-gold" aria-hidden="true" />
              <div>
                <h4 className="m-0 mb-1 font-label text-sm font-semibold tracking-[0.05em] text-moon-50">{title}</h4>
                <p className="m-0 text-sm leading-relaxed text-moon-400">{body}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="footer-item mx-auto mt-6 max-w-2xl text-center text-sm text-moon-500">
          <span className="text-moon-300">Recursos visuales:</span> las demás ilustraciones fueron extraídas de{' '}
          <a href="https://www.freepik.com/" target="_blank" rel="noopener noreferrer" className="lun-link text-lavender">Freepik</a>
          {' '}y{' '}
          <a href="https://www.pexels.com/" target="_blank" rel="noopener noreferrer" className="lun-link text-lavender">Pexels</a>
        </p>

        <div className="footer-item mt-10 flex flex-col items-center gap-5 border-t border-lavender/10 pt-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="m-0 text-sm text-moon-400">&copy; {new Date().getFullYear()} La Madriguera de Lunaria</p>
            <p className="m-0 text-xs text-moon-500">Todos los derechos reservados • Hecho con magia y propósito</p>
          </div>
          <a
            href="https://www.devvisualstudio.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-xl border border-lavender/20 px-5 py-3 transition-colors hover:border-gold/50"
          >
            <Code className="h-5 w-5 text-gold" aria-hidden="true" />
            <span className="text-left">
              <span className="block text-xs text-moon-500">Desarrollado por</span>
              <span className="block font-label text-sm font-semibold text-moon-50 group-hover:text-gold">DevVisual Studio</span>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
