"use client";
import { useState } from "react";
import Link from "next/link";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 w-full p-4 sm:p-8 text-white z-50">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl sm:text-2xl font-bold hover:text-gray-300 navbar-title">
          La madriguera de Lunaria
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          <li><Link href="/sobre-mi" className="hover:text-gray-300">Sobre mí</Link></li>
          <li><Link href="/magia" className="hover:text-gray-300">Sobre la Magia</Link></li>
          <li><Link href="/citas" className="hover:text-gray-300 font-semibold">Agendar Cita</Link></li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none" aria-label="Abrir menú">
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4">
          <ul className="flex flex-col items-center space-y-4 bg-black bg-opacity-80 backdrop-blur-sm p-4 rounded-lg">
            <li><Link href="/sobre-mi" className="block py-2 hover:text-gray-300" onClick={() => setIsOpen(false)}>Sobre mí</Link></li>
            <li><Link href="/magia" className="block py-2 hover:text-gray-300" onClick={() => setIsOpen(false)}>Sobre la Magia</Link></li>
            <li><Link href="/citas" className="block py-2 hover:text-gray-300 font-semibold" onClick={() => setIsOpen(false)}>Agendar Cita</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
