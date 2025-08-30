"use client";
import { useState, useEffect } from 'react';
import Header from "../../components/Header";
import AppFooter from "../../components/AppFooter";
import Constellation from "../../components/Constellation";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const SobreLaMagiaPage = () => {
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
      <Constellation name="cassiopeia" />

      <Header animate={false} />
      <main className="container mx-auto px-8 pt-32 flex-grow relative z-10">
        <h1 className="text-5xl font-bold mb-8">Sobre la Magia del Tarot</h1>
        <div className="prose prose-invert max-w-none text-lg">
          <p>
            El tarot es un lenguaje simbólico, un espejo del alma que nos habla a través de arquetipos universales. No predice un futuro inmutable, sino que ilumina el camino presente, revelando las energías, los patrones y las posibilidades que nos rodean.
          </p>
          <p>
            Cada carta es una puerta a la introspección. Nos invita a dialogar con nuestra propia sabiduría interna, a entender nuestras circunstancias desde una perspectiva más profunda y a tomar decisiones más conscientes y alineadas con nuestro verdadero ser.
          </p>
        </div>
      </main>
      <AppFooter animate={true} />
    </div>
  );
};

export default SobreLaMagiaPage;