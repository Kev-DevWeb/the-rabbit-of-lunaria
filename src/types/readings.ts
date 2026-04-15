export type Booking = {
  id: string;
  date: string;
  time: string;
  name: string;
  email: string;
  status: 'pending' | 'confirmed';
  cancelToken?: string;
  confirmToken?: string;
};

export type TarotReading = {
  id: string;
  title: string;
  description: string;
  price: string;
  priceValue: number; // Precio en MXN
  priceValueUSD: number; // Precio fijo en USD (evita tasa de cambio hardcodeada)
  duration?: number; // Duración en minutos
};
