import { TarotReading } from "@/types/readings";

export const readingsData: TarotReading[] = [
      {
      id: '3-cards',
      title: 'Tirada de 3 Cartas (30 min)',
      description: 'Varias tiradas para pedir consejo a tus guardianes espirituales. Preguntas ilimitadas durante 30 minutos.',
      price: '$50.00 MXN',
      priceValue: 50.00,
      priceValueUSD: 3,
      duration: 30,
    },
    {
      id: 'past-lives',
      title: 'Lectura de Vidas Pasadas',
      description: 'Explora tus vidas pasadas y cómo influyen en tu presente. Preguntas ilimitadas de 30 minutos respecto a las vidas para comprender tu presente.',
      price:'$100.00 MXN',
      priceValue: 100.00,
      priceValueUSD: 5,
      duration: 30,
    },
  {
    id: 'past-life-present',
    title: 'Tirada de Vidas Pasadas + lectura de 3 cartas',
    description: '¿Que es mejor que explorar tus vidas pasadas? Hacerlo mientras obtienes claridad sobre tu presente con preguntas ilimitadas 60 minutos.',
    duration: 60,
    price: '$150.00 MXN',
    priceValue: 150.00,
    priceValueUSD: 8,
  }
];
