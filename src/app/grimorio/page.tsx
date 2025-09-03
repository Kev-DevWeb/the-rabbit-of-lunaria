import Grimoire from '@/components/Grimoire';
import Image from 'next/image';

const GrimoirePage = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center pt-28 sm:pt-36 bg-gray-900 overflow-hidden">
      {/* Fondo oscuro con efecto de luz de vela */}
      <div 
        className="absolute inset-0 bg-black"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 60%, rgba(255, 200, 100, 0.15) 0%, rgba(0,0,0,0.8) 40%)',
        }}
      />

      {/* Contenedor para la escena de la mesa */}
      <div className="relative w-[900px] h-[600px] flex items-center justify-center">
        {/* Mesa */}
        <div className="absolute bottom-0 w-full h-1/2">
          <Image
            src="/mesamadera.jpg"
            alt="Mesa de madera"
            layout="fill"
            objectFit="cover"
            quality={80}
            className="opacity-50 rounded-t-2xl"
          />
        </div>

        {/* Placeholder para la vela a la derecha */}
        <div 
          className="absolute bottom-[25%] right-[10%] w-12 h-24 z-20"
          aria-hidden="true"
        >
          {/* Cuerpo de la vela */}
          <div className="w-full h-full bg-amber-900/70 rounded-t-lg" />
          {/* Flama de la vela */}
          <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 w-6 h-8 bg-yellow-300 rounded-full blur-[3px] animate-flicker" />
        </div>

        {/* El Grimorio */}
        <div className="relative z-10 bottom-10">
          <Grimoire />
        </div>
      </div>
    </div>
  );
};

export default GrimoirePage;