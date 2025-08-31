import Header from "@/components/Header";
import AppFooter from "@/components/AppFooter";
import StarBackground from "@/components/StarBackground";

// Constelación única para sobre la magia
const CONSTELACION_MAGIA = [
  { x: 60, y: 120, isBigStar: true },
  { x: 130, y: 50 },
  { x: 220, y: 80, isBigStar: true },
  { x: 260, y: 180 },
  { x: 185, y: 220 },
  { x: 335, y: 100, isBigStar: true },
];

const MagiaPage = () => {
  return (
    <div className="bg-black">
      <StarBackground constellation={CONSTELACION_MAGIA} width={420} height={280} />
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center text-white pt-32">
        <div className="container mx-auto p-8 z-10 relative">
          <h1 className="text-4xl font-bold text-center mb-4">Sobre la Magia</h1>
          <p className="mt-4 text-lg max-w-xl mx-auto text-center">
            Un espacio para aprender y compartir sobre la magia y el tarot.
          </p>
        </div>
      </main>
      <AppFooter />
    </div>
  );
};

export default MagiaPage;
