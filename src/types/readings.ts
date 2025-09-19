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
  priceValue: number; // Added for numerical price
  duration?: number; // Optional, as seen in readings-data.ts
};
