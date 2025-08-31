"use client";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <header 
      className="absolute top-0 left-0 w-full p-8 text-white z-50"
    >
      <nav className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-2xl font-bold hover:text-gray-300 navbar-title">La madriguera de Lunaria</a>
        <ul className="flex space-x-6">
          <li><a href="/sobre-mi" className="hover:text-gray-300">Sobre mí</a></li>
          <li><a href="/magia" className="hover:text-gray-300">Sobre la Magia</a></li>
          <li><a href="/citas" className="hover:text-gray-300 font-semibold">Agendar Cita</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
