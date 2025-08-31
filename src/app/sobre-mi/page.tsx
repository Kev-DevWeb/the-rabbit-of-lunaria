import Header from "@/components/Header";
import AppFooter from "@/components/AppFooter";
import StarBackground from "@/components/StarBackground";

// Ejemplo de constelación personalizada para sobre mí
const SOBRE_MI_CONSTELLATION = [
  { x: 120, y: 60, isBigStar: true },
  { x: 180, y: 110 },
  { x: 160, y: 180, isBigStar: true },
  { x: 250, y: 140 },
  { x: 200, y: 50 },
  { x: 340, y: 90, isBigStar: true },
];

const SobreMiPage = () => {
  return (
    <div className="bg-black">
      <StarBackground constellation={SOBRE_MI_CONSTELLATION} width={420} height={280} />
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center text-white pt-32">
        <div className="container mx-auto p-8 z-10 relative">
          <h1 className="text-4xl font-bold text-center mb-4">Sobre Mí</h1>
          <p className="mt-4 text-lg max-w-xl mx-auto text-center">
            “Soy un pequeño brujito que recién comienza en el tarot y encuentra en esta herramienta espiritual una forma de guiar y aconsejar con cariño. Creé este sitio para seguir aprendiendo de quienes tienen más experiencia y, al mismo tiempo, para acompañar a quienes inician su propio camino mágico, enfrentando las mismas dudas que yo tuve cuando la información parecía escasa.
Lunaria nace como un espacio seguro, sin prejuicios ni juicios, donde podamos apoyarnos y compartir la magia con libertad. Espero que este rincón lunar nos permita crecer juntos, recorrer el sendero del autoconocimiento y descubrir la belleza de ayudarnos mutuamente.”
          </p>
        </div>
      </main>
      <AppFooter />
    </div>
  );
};

export default SobreMiPage;
