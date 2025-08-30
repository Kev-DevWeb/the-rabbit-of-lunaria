"use client";
import { useState, useEffect } from 'react';
import Header from "../../components/Header";
import AppFooter from "../../components/AppFooter";
import Constellation from "../../components/Constellation";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const SobreMiPage = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
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
    <div className="flex flex-col min-h-screen bg-black text-white">
      {init && <Particles options={particleOptions} className="absolute inset-0 z-0" />}
      <Constellation name="orion" />

      <Header animate={false} />
      <main className="container mx-auto px-8 pt-32 flex-grow relative z-10">
        <h1 className="text-5xl font-bold mb-8">Sobre Mí</h1>
        <div className="prose prose-invert max-w-none text-lg">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </main>
      <AppFooter animate={true} />
    </div>
  );
};

export default SobreMiPage;