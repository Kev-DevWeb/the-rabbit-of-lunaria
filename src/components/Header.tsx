"use client";
import Link from "next/link";

const Header = () => {
  return (
    <header 
      className="absolute top-0 left-0 w-full p-8 text-white z-50"
    >
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-gray-300 navbar-title">La madriguera de Lunaria</Link>
        <ul className="flex space-x-6">
          <li><Link href="/sobre-mi" className="hover:text-gray-300">Sobre mí</Link></li>
          <li><Link href="/magia" className="hover:text-gray-300">Sobre la Magia</Link></li>
          <li><Link href="/citas" className="hover:text-gray-300 font-semibold">Agendar Cita</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
