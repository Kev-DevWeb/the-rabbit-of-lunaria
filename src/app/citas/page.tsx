import Header from "@/components/Header";
import AppFooter from "@/components/AppFooter";
import StarBackground from "@/components/StarBackground";

// Constelación única para agendar cita
const CONSTELACION_CITAS = [
  { x: 90, y: 80 },
  { x: 130, y: 170, isBigStar: true },
  { x: 200, y: 120 },
  { x: 220, y: 50 },
  { x: 360, y: 130, isBigStar: true },
  { x: 320, y: 200 },
];

const CitasPage = () => {
  return (
    <div className="bg-black">
      <StarBackground constellation={CONSTELACION_CITAS} width={420} height={260} />
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center text-white pt-32">
        <div className="container mx-auto p-8 z-10 relative">
          <h1 className="text-4xl font-bold text-center mb-4">Agendar Cita</h1>
          <p className="mt-4 text-lg max-w-xl mx-auto text-center">Aquí podrás agendar tu cita para una lectura de tarot.</p>
        </div>
      </main>
      <AppFooter />
    </div>
  );
};

export default CitasPage;
