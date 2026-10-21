"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import type { OnApproveData } from '@paypal/paypal-js';

import { TarotReading } from '@/types/readings';

import { readingsData } from '@/lib/readings-data';

interface BDCLocationResult {
  countryCode: string;
}

declare global {
  interface Window {
    BDCReverseGeocode: {
      new(): {
        getClientLocation(callback: (result: BDCLocationResult) => void): void;
      }
    };
  }
}

// --- Componentes (sin cambios) ---
interface ReadingCardProps {
  reading: TarotReading;
  onSelect: (reading: TarotReading) => void;
  formatPrice: (reading: TarotReading) => string;
}
const ReadingCard = ({ reading, onSelect, formatPrice }: ReadingCardProps) => {
  const cardRef = useRef<HTMLButtonElement>(null);
  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;
    gsap.fromTo(card, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", scrollTrigger: card });
    const onMouseEnter = () => gsap.to(card, { y: -10, scale: 1.03, boxShadow: "0px 18px 60px rgba(123, 92, 255, 0.35)", duration: 0.3, ease: "power2.out" });
    const onMouseLeave = () => gsap.to(card, { y: 0, scale: 1, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)", duration: 0.3, ease: "power2.in" });
    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mouseleave', onMouseLeave);
    return () => {
      card.removeEventListener('mouseenter', onMouseEnter);
      card.removeEventListener('mouseleave', onMouseLeave);
    };
  }, { scope: cardRef });
  return (
    <button type="button" ref={cardRef} onClick={() => onSelect(reading)} className="reading-card group cursor-pointer text-left bg-dusk/85 backdrop-blur-md p-7 rounded-3xl border border-gold/35 h-full flex flex-col justify-between opacity-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
      <span className="block">
        <span className="block font-display text-2xl leading-tight text-moon-50">{reading.title}</span>
        <span className="mt-3 block text-moon-300 font-cormorant-garamond text-lg">{reading.description}</span>
      </span>
      <span className="mt-6 flex justify-between items-end">
        <span className="font-label text-2xl text-gold">{formatPrice(reading)}</span>
        <span className="font-label text-sm tracking-[0.15em] text-gold opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300">SELECCIONAR →</span>
      </span>
    </button>
  );
};
const LoadingSpinner = () => {
    const spinnerRef = useRef(null);
    useGSAP(() => {
        gsap.to(".dot", { y: -10, stagger: { each: 0.2, yoyo: true, repeat: -1 }, ease: "power2.inOut" });
    }, { scope: spinnerRef });
    return (
        <div ref={spinnerRef} className="flex justify-center items-center gap-2 h-24">
            <span className="dot w-3 h-3 bg-lavender rounded-full"></span>
            <span className="dot w-3 h-3 bg-lavender rounded-full"></span>
            <span className="dot w-3 h-3 bg-lavender rounded-full"></span>
        </div>
    );
}

// --- Componente Principal del Sistema de Citas ---
const BookingSystem = () => {
  const [selectedReading, setSelectedReading] = useState<TarotReading | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [timeFetchError, setTimeFetchError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<'MXN' | 'USD'>('MXN');
  
  const containerRef = useRef(null);
  const step2Ref = useRef(null);
  const timePanelRef = useRef(null);
  const formRef = useRef(null);
  const router = useRouter();

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.BDCReverseGeocode) {
      const reverseGeocoder = new window.BDCReverseGeocode();
      reverseGeocoder.getClientLocation((result: BDCLocationResult) => {
        if (result.countryCode !== 'MX') {
          setCurrency('USD');
        }
      });
    }
  }, []);

  const formatPrice = (reading: TarotReading) => {
    if (currency === 'USD') {
      return `${reading.priceValueUSD} USD`;
    }
    return `${reading.priceValue.toFixed(2)} MXN`;
  };

  useGSAP(() => {
    if (selectedReading) {
      gsap.fromTo(step2Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    }
  }, { dependencies: [selectedReading], scope: containerRef });

  useGSAP(() => {
    if (selectedDate) {
        gsap.fromTo(timePanelRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' });
    }
  }, { dependencies: [selectedDate], scope: containerRef });

  useGSAP(() => {
    if (selectedTime) {
        gsap.from(".form-field", { opacity: 0, y: 20, stagger: 0.2, duration: 0.5, ease: 'power3.out' });
    }
  }, { dependencies: [selectedTime], scope: formRef });


  const resetBookingState = useCallback(() => {
    setSelectedDate(undefined);
    setSelectedTime(null);
    setAvailableTimes([]);
    setUserEmail('');
    setUserName('');
    setTimeFetchError(null);
    setBookingError(null);
    setPaymentMethod(null);
  }, []);

  const handleReadingSelect = (reading: TarotReading) => {
    setSelectedReading(reading);
    resetBookingState();
  };

  const handleDateSelect = useCallback(async (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setSelectedTime(null);
    setAvailableTimes([]);
    setIsLoading(true);
    setTimeFetchError(null);
    setBookingError(null);

    try {
      // El servidor calcula los horarios libres en hora de México y solo regresa horas,
      // sin datos de otras citas
      const response = await fetch(`/api/availability?date=${format(date, 'yyyy-MM-dd')}`, { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setAvailableTimes(result.times);
    } catch (err) {
      console.error("Error al obtener horarios:", err);
      setTimeFetchError("No se pudieron cargar los horarios. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const bookAppointmentInDB = async (orderId?: string) => {
    if (!selectedReading || !selectedDate || !selectedTime || !userName || !userEmail) {
        setBookingError('Faltan datos para agendar la cita.');
        return false;
    }
    setIsBooking(true);
    setBookingError(null);
    try {
      const response = await fetch('/api/bookAppointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: format(selectedDate, 'yyyy-MM-dd'), time: selectedTime, name: userName, email: userEmail, readingId: selectedReading.id, paymentMethod, orderId, currency }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error en la API de booking');
      
      if (paymentMethod === 'paypal') {
        router.push('/confirmation/success');
      } else if (paymentMethod === 'bankTransfer') {
        router.push('/confirmation/pending');
      } else {
        // Fallback por si acaso, aunque no debería ocurrir
        router.push('/confirmation/success');
      }
      return true;

    } catch (err: unknown) {
      console.error("Error al agendar la cita:", err);
      setBookingError(err instanceof Error ? err.message : "Hubo un problema al agendar tu cita.");
      return false;
    } finally {
      setIsBooking(false);
    }
  };

  // --- Lógica de PayPal ---

  const handlePayPalClick = (_data: Record<string, unknown>, actions: { reject: () => void; }) => {
    // Validar el formulario ANTES de abrir el popup de PayPal
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(userEmail) || !userName.trim()) {
      setBookingError('Por favor, introduce un nombre y correo electrónico válidos antes de pagar.');
      return actions.reject();
    }
    // Si todo está bien, permite que se abra el popup
    setBookingError(null);
  };

  const createOrder = async () => {
    // La validación ya se hizo en handlePayPalClick. Aquí solo creamos la orden.
    if (!selectedReading || !selectedDate || !selectedTime) {
        throw new Error('No reading selected');
    }
    const response = await fetch('/api/create-paypal-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ readingId: selectedReading.id, currency, date: format(selectedDate, 'yyyy-MM-dd'), time: selectedTime }),
    });
    const orderData = await response.json().catch(() => ({}));
    if (!response.ok || !orderData.orderId) {
      // 409: el horario se ocupó mientras llenaba el formulario; no se abre PayPal
      setBookingError(orderData.error || 'No se pudo iniciar el pago con PayPal. Inténtalo de nuevo.');
      throw new Error('Failed to create PayPal order');
    }
    return orderData.orderId;
  };

  // El cobro ya no se hace en el navegador: el servidor aparta el horario, cobra la orden
  // y verifica el monto. Si el horario se ocupó, no se cobra nada.
  const onApprove = async (data: OnApproveData) => {
    await bookAppointmentInDB(data.orderID);
  };

  const onCancel = () => {
    setBookingError('Has cancelado el proceso de pago.');
  };

  const onError = () => {
    setBookingError('PayPal encontró un error. Por favor, intenta de nuevo.');
  };

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto">
      {!selectedReading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {readingsData.map(reading => <ReadingCard key={reading.id} reading={reading} onSelect={handleReadingSelect} formatPrice={formatPrice} />)}
        </div>
      )}

      {selectedReading && (
        <div ref={step2Ref} className="opacity-0">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <button onClick={() => { setSelectedReading(null); resetBookingState(); }} className="text-lavender hover:text-moon-50 transition-colors">&larr; Cambiar de lectura</button>
            <div className="text-right">
              <p className="text-lg text-moon-300">{selectedReading.title}</p>
              <p className="text-2xl font-bold text-gold">{formatPrice(selectedReading)}</p>
            </div>
          </div>
          <div className="bg-dusk/90 backdrop-blur-md p-4 sm:p-8 rounded-3xl border border-lavender/20 flex flex-col md:flex-row gap-8">
            <div className="flex-grow flex justify-center">
              <DayPicker mode="single" selected={selectedDate} onSelect={handleDateSelect} locale={es} disabled={(date) => date < new Date(new Date().toDateString())} />
            </div>
            {selectedDate && (
              <div ref={timePanelRef} className="md:w-1/3 md:border-l md:border-lavender/20 md:pl-8 opacity-0">
                <h3 className="text-lg font-label font-semibold tracking-[0.05em] text-moon-50 text-center md:text-left mb-4">Horas para <br/> {format(selectedDate, 'PPP', { locale: es })}</h3>
                {isLoading && <LoadingSpinner />}
                {timeFetchError && <p className="text-center text-red-400">{timeFetchError}</p>}
                {!isLoading && !timeFetchError && (
                  availableTimes.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3">
                      {availableTimes.map(time => <button key={time} onClick={() => setSelectedTime(time)} aria-pressed={selectedTime === time} className={`time-slot min-h-11 rounded-full border font-label text-center transition-[background-color,box-shadow] ${selectedTime === time ? 'border-gold bg-gold text-night' : 'border-lavender/35 hover:shadow-[0_0_18px_rgba(233,196,106,0.45)]'}`}>{time}</button>)}
                    </div>
                  ) : <p className="text-center text-moon-500">No hay horas disponibles.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedTime && paypalClientId && (
        <PayPalScriptProvider options={{ clientId: paypalClientId, currency: currency, intent: "capture", "disable-funding": "card" }}>
            <div ref={formRef} className="text-center mt-8 transition-all duration-300 flex flex-col items-center gap-6">
              <div className="form-field w-full max-w-md">
                  <label htmlFor="name" className="block text-moon-200 mb-2 font-cormorant-garamond text-lg">Nombre:</label>
                  <input type="text" id="name" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Tu nombre" className="w-full min-h-12 px-4 rounded-xl bg-dusk border border-lavender/35 text-moon-50 focus:ring-2 focus:ring-gold focus:outline-none" required />
              </div>
              <div className="form-field w-full max-w-md">
                  <label htmlFor="email" className="block text-moon-200 mb-2 font-cormorant-garamond text-lg">Correo para la confirmación:</label>
                  <input type="email" id="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="tu.correo@ejemplo.com" className="w-full min-h-12 px-4 rounded-xl bg-dusk border border-lavender/35 text-moon-50 focus:ring-2 focus:ring-gold focus:outline-none" required />
              </div>
              <div className="form-field w-full max-w-md">
                  <h3 className="text-lg font-label font-semibold tracking-[0.05em] text-moon-200 mb-3">Método de Pago:</h3>
                  <div className="flex justify-center gap-4">
                    <button onClick={() => setPaymentMethod('bankTransfer')} className={`px-6 py-3 rounded-full font-label transition-colors ${paymentMethod === 'bankTransfer' ? 'bg-gold text-night' : 'border border-lavender/35 text-moon-50 hover:bg-dusk-500/70'}`}>
                        Transferencia
                    </button>
                    <button onClick={() => setPaymentMethod('paypal')} className={`px-6 py-3 rounded-full font-label transition-colors ${paymentMethod === 'paypal' ? 'bg-gold text-night' : 'border border-lavender/35 text-moon-50 hover:bg-dusk-500/70'}`}>
                        PayPal
                    </button>
                  </div>
              </div>
              {paymentMethod === 'bankTransfer' && (
                  <div className="form-field text-center">
                    <p className="text-sm text-moon-500 mb-4">Recibirás los detalles para la transferencia en el correo de confirmación.</p>
                    <button onClick={() => bookAppointmentInDB()} disabled={isBooking || !userName.trim() || !userEmail} className="lun-btn-gold disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none">
                        {isBooking ? 'Agendando...' : 'Confirmar Cita'}
                    </button>
                  </div>
              )}
              {paymentMethod === 'paypal' && (
                  <div className="form-field mt-4 w-full max-w-sm">
                      <PayPalButtons 
                          style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }} 
                          onClick={handlePayPalClick}
                          createOrder={createOrder} 
                          onApprove={onApprove} 
                          onCancel={onCancel}
                          onError={onError} 
                      />
                  </div>
              )}
              {bookingError && <p className="form-field text-center text-red-400 mt-4 max-w-md mx-auto">{bookingError}</p>}
            </div>
        </PayPalScriptProvider>
      )}
    </div>
  );
};

export default BookingSystem;