"use client";
import { motion } from "framer-motion";

const AppFooter = ({ animate = true }) => {
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.footer 
      className="w-full p-4 text-center text-white bg-gray-800 z-10"
      variants={variants}
      initial="hidden"
      animate={animate ? "visible" : "hidden"}
      transition={{ duration: 0.5, delay: animate ? 1 : 0 }}
    >
      <p>&copy; 2025 The Rabbit of Lunaria. Todos los derechos reservados.</p>
    </motion.footer>
  );
};

export default AppFooter;