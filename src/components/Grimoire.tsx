"use client";
import HTMLFlipBook from "react-pageflip";
import Page from "./Page";
import Cover from "./Cover";

const Grimoire = () => {
  return (
    <div>
      {/* @ts-expect-error: react-pageflip types are too strict */}
      <HTMLFlipBook width={500} height={600} showCover={true} className="book-container" style={{}} startPage={0} size="fixed">
        <Cover>El Grimorio de Lunaria</Cover>
        <Page number={1}>
          <h2 className="text-2xl font-bold mb-4">Índice</h2>
          <ul>
            <li>¿Qué es la Magia? - Página 2</li>
            <li>Magia y Espiritualidad - Página 3</li>
            <li>Advertencia - Página 4</li>
          </ul>
        </Page>
        <Page number={2}>
          <h2 className="text-2xl font-bold mb-4">¿Qué es la Magia?</h2>
          <p>
            La magia no es buena ni mala; es simplemente el movimiento de la energia acompanada de una intencion consciente. Asi como en la vida, existen acciones con consecuencias positivas o negativas, en la magia la diferencia esta en el proposito y el respeto.
          </p>
          <p>
            <strong className="text-yellow-500">La magia es karmica:</strong> aquello que envias, ya sea luz o sombra, regresa multiplicado. Por eso, lo mas sabio es procurar usarla siempre para el bien y desde la empatia.
          </p>
        </Page>
        <Page number={3}>
          <h2 className="text-2xl font-bold mb-4">Magia y Espiritualidad</h2>
          <p>
            Practicar magia no te aleja de la divinidad ni de tu fe. En realidad, muchas religiones emplean rituales, altares y oraciones, que son formas de mover energias y enfocar la intencion para atraer milagros o bendiciones.
          </p>
          <p>
            <span className="font-semibold text-purple-500">La diferencia esta en la intencion y en la actitud:</span> si tu corazon se enfoca en lo negativo, atraeras lo negativo; si te abres a lo positivo, tu camino se iluminara. Cualquier acto magico —ya sean limpias, rituales o lecturas— requiere fe y apertura interior para manifestarse.
          </p>
        </Page>
        <Page number={4}>
            <div className="mt-10 md:mx-auto p-7 rounded-2xl bg-black/80 text-white text-2xl md:text-3xl font-bold text-center shadow-[0_0_32px_8px_rgba(167,139,250,0.5)] ring-2 ring-violet-200/60 backdrop-blur-lg max-w-2xl">
                <span className="block text-pink-200 text-lg tracking-widest pb-2 font-bold uppercase">Importante</span>
                <span className="block text-white text-xl md:text-2xl font-normal leading-relaxed">
                    Si decides practicar magia, protégete siempre y asegúrate de saber lo que haces.<br className="hidden md:block"/>
                    De lo contrario, podrías atraer energías o entidades no deseadas que se aprovechen del desconocimiento o falta de protección.<br className="hidden md:block"/>
                    <span className="text-violet-200 font-bold">La magia es un arte poderoso, y como todo poder, merece respeto y responsabilidad.</span>
                </span>
            </div>
        </Page>
        <Cover>Contraportada</Cover>
      </HTMLFlipBook>
    </div>
  );
};

export default Grimoire;