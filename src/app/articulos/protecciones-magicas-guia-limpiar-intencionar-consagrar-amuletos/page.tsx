import { articles } from '@/lib/articles'; // Import articles data

// Function to generate metadata for this page
export async function generateMetadata() {
  const article = articles.find(a => a.slug === 'protecciones-magicas-guia-limpiar-intencionar-consagrar-amuletos'); // Find the specific article

  if (!article) {
    return {
      title: 'Artículo no encontrado',
      description: 'El artículo que buscas no existe.',
    };
  }

  return {
    title: article.title,
    description: article.description,
  };
}

export default function ProteccionesMagicasPage() {
  return (
    <article className="relative container mx-auto px-4 py-8 text-white bg-black/50 backdrop-blur-sm rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-8">Protecciones mágicas: guía para limpiar, intencionar y consagrar amuletos</h1>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Introducción</h2>
          <p className="text-lg">
            Los amuletos son herramientas ancestrales de protección y equilibrio. Pueden ser objetos cotidianos —como collares, dijes, pulseras o anillos— o bien gemas con propiedades energéticas específicas que potencian su poder natural. Lo importante no es el objeto en sí, sino la forma en que lo cargas con tu intención y lo consagras con la ayuda de las energías naturales.
          </p>
          <p className="text-lg mt-4">
            En esta guía paso a paso aprenderás cómo limpiar, intencionar y consagrar tus amuletos, además de mantenerlos cargados cada semana para que conserven su fuerza.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">1. Limpieza del amuleto</h2>
          <p className="text-lg">
            Antes de activar un amuleto, es necesario purificarlo de energías previas:
          </p>
          <ul className="list-disc list-inside text-lg mt-4 space-y-2">
            <li>
              <strong>Método directo:</strong> si el material lo permite (piedra, metal, vidrio), sumérgelo en un cuenco con agua y una cucharadita de sal durante toda la noche. O en su defecto, pasalo por el humo de un incienso mientras le pides al elemento aire que lo purifique.
            </li>
            <li>
              <strong>Método indirecto:</strong> si es delicado (madera, cuero, tela), limpia suavemente con un paño humedecido en agua salada.
            </li>
          </ul>
          <p className="text-lg mt-4 italic">
            Mientras lo limpias, repite mentalmente: “Libero toda energía ajena, este amuleto queda limpio y en armonía conmigo.”
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">2. Agua lunar: el poder de la luna</h2>
          <p className="text-lg">
            El agua lunar es una herramienta mágica ideal para purificar y cargar tus amuletos:
          </p>
          <ul className="list-disc list-inside text-lg mt-4 space-y-2">
            <li>
              Coloca agua en un frasco de vidrio bajo la luz de la Luna llena.
            </li>
            <li>
              Déjala toda la noche y guárdala en un lugar fresco.
            </li>
            <li>
              Rocía ligeramente tu amuleto con esta agua o pásalo por encima del recipiente.
            </li>
          </ul>
          <p className="text-lg mt-4">
            Además de limpiar y potenciar tus objetos mágicos, el agua lunar puede usarse para meditación, cuidado personal o purificación del hogar.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">3. Intencionar con la mente</h2>
          <p className="text-lg">
            La intención es el alma del amuleto. Para programarlo con tu energía:
          </p>
          <ul className="list-disc list-inside text-lg mt-4 space-y-2">
            <li>
              Tómalo entre tus manos o colócalo sobre tu pecho.
            </li>
            <li>
              Visualiza cómo se llena de luz protectora.
            </li>
            <li>
              Repite frases en presente, por ejemplo:
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>“Estoy protegido en todo momento.”</li>
                <li>“Este amuleto resuena con mi energía y me cuida.”</li>
                <li>(son solo ejemplos, puedes decir la frase que mas resuene contigo)</li>
              </ul>
            </li>
          </ul>
          <p className="text-lg mt-4">
            Si trabajas con gemas como amatista, turmalina negra, cuarzo o jade, estas vibrarán en armonía con tu intención y harán el amuleto más poderoso.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">4. Ritual de consagración con los cuatro elementos 🌿🔥💧🌬️</h2>
          <p className="text-lg">
            Para darle aún más fuerza, puedes consagrar tu amuleto con un ritual elemental:
          </p>
          <ul className="list-disc list-inside text-lg mt-4 space-y-2">
            <li>
              Coloca el amuleto en el centro de tu altar o mesa.
            </li>
            <li>
              Forma una cruz con los elementos:
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>Norte (arriba) → Aire: incienso o plumas.</li>
                <li>Oeste (izquierda) → Tierra: cuarzos, piedras o un puñado de tierra.</li>
                <li>Sur (abajo) → Fuego: una vela encendida.</li>
                <li>Este (derecha) → Agua: un vaso con agua.</li>
              </ul>
            </li>
            <li>
              Pide a los elementos y a tu guardián espiritual que consagren el amuleto.
            </li>
            <li>
              Pasa el objeto superficialmente sobre cada elemento (sin dañarlo, solo acercándolo).
            </li>
            <li>
              Déjalo reposar una hora en el centro de la cruz elemental.
            </li>
          </ul>
          <p className="text-lg mt-4">
            Al finalizar, el amuleto estará consagrado y listo para protegerte.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">5. Cargar los amuletos cada semana</h2>
          <p className="text-lg">
            Los amuletos, al igual que cualquier herramienta energética, necesitan recargarse para mantener su fuerza:
          </p>
          <ul className="list-disc list-inside text-lg mt-4 space-y-2">
            <li>
              <strong>Con la luna:</strong> colócalo bajo la luz de la Luna llena o creciente.
            </li>
            <li>
              <strong>Con el sol:</strong> ideal para amuletos de vitalidad y fuerza, exponiéndolos unos minutos en la mañana.
            </li>
          </ul>
          <p className="text-lg mt-4">
            Haz este proceso una vez por semana o después de momentos intensos para mantener viva su energía protectora.
          </p>
        </div>
      </div>
    </article>
  );
}