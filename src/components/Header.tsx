'use client';
import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useBackgroundMusic } from "@/context/BackgroundMusicProvider";
import { useLenis } from "@/context/LenisProvider";
import { SkipForward, SkipBack, Music, Play, Pause } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/articulos", label: "El grimorio de Lunaria" },
];

const MoonMark = ({ size = 28 }: { size?: number }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#e9c46a" strokeWidth="1.5">
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </svg>
);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const lenis = useLenis();
  const {
    isMuted,
    toggleMute,
    currentTrack,
    nextTrack,
    previousTrack,
    isProcessing
  } = useBackgroundMusic();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useGSAP(() => {
    // Al bajar de los primeros 100px el header se vuelve vidrio esmerilado
    gsap.to(headerRef.current, {
      backgroundColor: "rgba(7, 6, 26, 0.72)",
      backdropFilter: "blur(14px)",
      borderBottomColor: "rgba(201, 184, 255, 0.14)",
      paddingTop: "0.75rem",
      paddingBottom: "0.75rem",
      scrollTrigger: { trigger: "body", start: "top top", end: "+=100", scrub: 1 },
    });

    // Se esconde al bajar y vuelve al subir
    if (!lenis) return;
    let lastScroll = 0;
    const onScroll = ({ scroll }: { scroll: number }) => {
      const hide = scroll > 160 && scroll > lastScroll;
      gsap.to(headerRef.current, { yPercent: hide ? -110 : 0, duration: 0.4, ease: "power2.out", overwrite: "auto" });
      lastScroll = scroll;
    };
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, { scope: headerRef, dependencies: [lenis] });

  const musicButtons = (size: number) => (
    <>
      <button
        onClick={previousTrack}
        className="flex h-11 w-11 items-center justify-center rounded-full text-moon-500 transition-colors hover:bg-dusk-500/60 hover:text-moon-50 disabled:opacity-40"
        aria-label="Canción anterior"
        disabled={isMuted || isProcessing}
      >
        <SkipBack size={size} />
      </button>
      <button
        onClick={toggleMute}
        className={`flex h-11 w-11 items-center justify-center rounded-full border border-lavender/30 text-lavender transition-colors hover:bg-dusk-500/60 hover:text-moon-50 ${isProcessing ? 'animate-pulse' : ''}`}
        aria-label={!isMuted ? "Pausar música" : "Reproducir música"}
        disabled={isProcessing}
      >
        {!isMuted ? <Pause size={size + 2} /> : <Play size={size + 2} />}
      </button>
      <button
        onClick={nextTrack}
        className="flex h-11 w-11 items-center justify-center rounded-full text-moon-500 transition-colors hover:bg-dusk-500/60 hover:text-moon-50 disabled:opacity-40"
        aria-label="Siguiente canción"
        disabled={isMuted || isProcessing}
      >
        <SkipForward size={size} />
      </button>
    </>
  );

  return (
    <header
      ref={headerRef}
      className="fixed left-0 top-0 z-50 w-full border-b border-transparent px-[clamp(1rem,4vw,3.5rem)] py-5 text-moon-100 will-change-transform"
    >
      <nav aria-label="Principal" className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="navbar-title flex items-center gap-3 whitespace-nowrap text-base font-bold tracking-wide text-moon-50 sm:text-lg xl:text-xl">
          <MoonMark />
          La madriguera de Lunaria
        </Link>

        {/* Menú de escritorio */}
        <div className="hidden items-center gap-5 lg:flex xl:gap-7">
          <ul className="m-0 flex list-none items-center gap-5 p-0 font-label text-sm tracking-[0.06em] xl:gap-7 xl:text-[0.95rem]">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className="lun-link whitespace-nowrap">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            {currentTrack && !isMuted && (
              <div className="hidden max-w-48 items-center gap-2 px-2 lg:flex">
                <Music size={14} className="text-gold" />
                <span className="truncate text-xs text-moon-400">{currentTrack}</span>
              </div>
            )}
            {musicButtons(16)}
          </div>

          <Link href="/citas" className="lun-btn-gold min-h-11 px-5 text-[0.95rem]">Agendar</Link>
        </div>

        {/* Botón de menú móvil */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 text-gold lg:hidden"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            {isOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
          </svg>
        </button>
      </nav>

      {/* Menú móvil */}
      {isOpen && (
        <div className="mt-4 lg:hidden">
          <ul className="flex list-none flex-col items-center gap-2 rounded-2xl border border-lavender/15 bg-night/90 p-5 font-label tracking-[0.08em] backdrop-blur-md">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="lun-link block py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <Link href="/citas" className="lun-btn-gold" onClick={() => setIsOpen(false)}>Agendar cita</Link>
            </li>
            {currentTrack && !isMuted && (
              <li className="flex items-center gap-2 pt-2 text-xs text-moon-400">
                <Music size={14} className="text-gold" />
                <span className="max-w-48 truncate">{currentTrack}</span>
              </li>
            )}
            <li className="flex items-center gap-2 pt-1">{musicButtons(18)}</li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
