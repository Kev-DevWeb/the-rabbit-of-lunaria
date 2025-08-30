"use client";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { motion } from "framer-motion";
import type { Container } from "@tsparticles/engine";
import Header from "./Header";
import AppFooter from "./AppFooter";
import Constellation from "./Constellation";

const SkyElements = ({ isVisible }) => {
  const variants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="absolute inset-0">
      {/* Luna Gigante */}
      <motion.div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-24 h-24 bg-gray-200 rounded-full"
        variants={variants} 
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"} 
        transition={{ type: "spring", duration: 2, delay: 1 }}
      >
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 h-20 w-px bg-gray-400"></div>
        {/* Conejo en la luna */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          transition={{ duration: 1, delay: 2.5 }} 
        >
          <img src="/rabbit.svg" alt="Silueta de conejo" className="w-1/2 h-1/2 object-contain" />
        </motion.div>
      </motion.div>

      {/* Estrellas Colgantes */}
      <motion.div 
        className="absolute top-1/3 left-1/4 w-8 h-8 bg-yellow-300"
        style={{ clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }}
        variants={variants} 
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"} 
        transition={{ type: "spring", duration: 2, delay: 1.5 }}
      >
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 h-24 w-px bg-gray-400"></div>
      </motion.div>
      <motion.div 
        className="absolute top-1/2 left-3/4 w-6 h-6 bg-yellow-300"
        style={{ clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }}
        variants={variants} 
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"} 
        transition={{ type: "spring", duration: 2, delay: 2 }}
      >
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 h-32 w-px bg-gray-400"></div>
      </motion.div>
    </div>
  );
};

const StarrySky = () => {
  const [init, setInit] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });

    const timer = setTimeout(() => setSceneReady(true), 4500);
    return () => clearTimeout(timer);
  }, []);

  const particleOptions = {
    background: { color: { value: "#000" } },
    fpsLimit: 60,
    particles: {
      number: { value: 150 },
      color: { value: "#fff" },
      opacity: { value: { min: 0.1, max: 0.7 } },
      size: { value: { min: 1, max: 2.5 } },
      move: { enable: true, speed: 0.2, direction: "none" as const, straight: false },
    },
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* CIELO (Detrás) */}
      <div className="absolute inset-0">
        {init && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: sceneReady ? 1 : 0 }} transition={{ duration: 3, delay: 2 }}>
            <Particles id="tsparticles" options={particleOptions} />
          </motion.div>
        )}
        <SkyElements isVisible={sceneReady} />
      </div>

      {/* CAMPO (Delante) */}
      <motion.div
        className="absolute inset-0"
        animate={{ y: "100vh" }}
        transition={{ duration: 2, delay: 2, ease: "easeInOut" }}
      >
        <div 
          className="w-full h-full bg-cover bg-bottom"
          style={{ backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%), url(/cabañanoche.jpg)' }}
        >
          {/* Linterna */}
          <motion.div
            className="absolute"
            style={{
              top: '65%', 
              left: '45%', 
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 165, 0, 0.8)', 
              boxShadow: '0 0 15px 8px rgba(255, 165, 0, 0.6)',
              zIndex: 10,
            }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Luciérnagas */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Firefly 1 */}
            <motion.div
              className="absolute"
              style={{
                top: '70%', left: '30%', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'yellow',
                boxShadow: '0 0 5px 2px yellow', zIndex: 10,
              }}
              animate={{ x: [0, 10, 0], y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            {/* Firefly 2 */}
            <motion.div
              className="absolute"
              style={{
                top: '80%', left: '60%', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'yellow',
                boxShadow: '0 0 5px 2px yellow', zIndex: 10,
              }}
              animate={{ x: [0, -15, 0], y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            {/* Firefly 3 */}
            <motion.div
              className="absolute"
              style={{
                top: '75%', left: '45%', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'yellow',
                boxShadow: '0 0 5px 2px yellow', zIndex: 10,
              }}
              animate={{ x: [0, 5, 0], y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            />
          </div>
        </div>
      </motion.div>

      <Header />

      {/* FOOTER HTML (2D) */}
      <div className="absolute bottom-0 left-0 w-full z-50">
        <AppFooter animate={sceneReady} />
      </div>

      <motion.main 
        className="absolute inset-0 flex flex-col items-center justify-center text-center text-white pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: sceneReady ? 1 : 0 }}
        transition={{ duration: 2, delay: 4 }}
      >
        <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">Desvela los misterios de tu futuro</h2>
        <p className="text-xl drop-shadow-md">El tarot es una herramienta de autoconocimiento y guía.</p>
        <Constellation name="ursa-major" />
      </motion.main>
    </div>
  );
};

export default StarrySky;
