"use client";

import BookingSystem from "@/components/BookingSystem";
import StarBackground from "@/components/StarBackground";

// Una constelación única para la página de citas para mantener la estética
const CITAS_CONSTELLATION = [
  { x: 90, y: 80 },
  { x: 130, y: 170, isBigStar: true },
  { x: 200, y: 120 },
  { x: 220, y: 50 },
  { x: 360, y: 130, isBigStar: true },
  { x: 320, y: 200 },
];

const CitasPage = () => {
  return (
    <div className="bg-black text-white">
      <StarBackground constellation={CITAS_CONSTELLATION} width={420} height={260} />
      <main className="min-h-screen flex flex-col items-center justify-center pt-32 pb-16">
        <div className="container mx-auto p-4 sm:p-8 z-10 relative">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-cinzel-decorative mb-4">
              Agenda tu Lectura
            </h1>
            <p className="mt-4 text-lg max-w-3xl mx-auto text-gray-300 font-cormorant-garamond">
              El tarot es una herramienta de autoconocimiento y una conversación con tu intuición. No predice un futuro inamovible, sino que ilumina los caminos disponibles para ti, ofreciéndote claridad, consejo y perspectiva. A través de las cartas, podemos explorar tus dudas, entender tus desafíos y encontrar la guía que necesitas para tomar decisiones más conscientes y alineadas con tu verdadero ser.
            </p>
          </div>

          {/* Aquí se integra el sistema de citas que ya analizamos */}
          <BookingSystem />

        </div>
      </main>
    </div>
  );
};

export default CitasPage;