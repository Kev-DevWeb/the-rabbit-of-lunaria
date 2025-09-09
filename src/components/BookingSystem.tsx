"use client";

import { useState, useRef, useCallback } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { TarotReading } from '@/types/readings';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import { readingsData } from '@/lib/readings-data';

// --- Sub-componente para la tarjeta de lectura ---
interface ReadingCardProps {
  reading: TarotReading;
  onSelect: (reading: TarotReading) => void;
}

const ReadingCard = ({ reading, onSelect }: ReadingCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

    const onMouseEnter = () => {
      gsap.to(card, {
        y: -10,
        scale: 1.03,
        boxShadow: "0px 15px 35px rgba(162, 89, 255, 0.4)",
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const onMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
        duration: 0.3,
        ease: "power2.in"
      });
    };

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mouseleave', onMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', onMouseEnter);
      card.removeEventListener('mouseleave', onMouseLeave);
    };
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(reading)}
      className="reading-card group cursor-pointer bg-black/60 backdrop-blur-md p-6 rounded-lg border border-purple-400/30 h-full flex flex-col justify-between"
    >
      <div>
        <h3 className="text-2xl font-cinzel-decorative text-purple-200">{reading.title}</h3>
        <p className="mt-2 text-gray-300 font-cormorant-garamond text-lg">{reading.description}</p>
      </div>
      <div className="mt-4 flex justify-between items-end">
        <span className="text-2xl font-bold text-yellow-400">${reading.price} MXN</span>
        <span className="text-yellow-300">Seleccionar →</span>
      </div>
    </div>
  );
};

const BookingSystem = () => {
  const [selectedReading, setSelectedReading] = useState<TarotReading | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [timeFetchError, setTimeFetchError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  
  const containerRef = useRef(null);
  const step2Ref = useRef(null);

  useGSAP(() => {
    if (selectedReading && !bookingComplete) {
      gsap.fromTo(step2Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    }
  }, { dependencies: [selectedReading, bookingComplete], scope: containerRef });

  const resetBookingState = useCallback(() => {
    setSelectedDate(undefined);
    setSelectedTime(null);
    setAvailableTimes([]);
    setUserEmail('');
    setUserName('');
    setTimeFetchError(null);
    setBookingError(null);
    setBookingComplete(false);
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
      const dayOfWeek = date.getDay();
      let baseAvailableTimes: string[];

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        baseAvailableTimes = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
      } else {
        baseAvailableTimes = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
      }

      const now = new Date();
      let timesForToday = [...baseAvailableTimes];
      if (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      ) {
        const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
        timesForToday = baseAvailableTimes.filter(time => {
          const [slotHour, slotMinute] = time.split(':').map(Number);
          const slotTotalMinutes = slotHour * 60 + slotMinute;
          return slotTotalMinutes > currentTotalMinutes;
        });
      }

      const dateString = format(date, 'yyyy-MM-dd');
      const readingsRef = collection(db, 'bookings');
      const q = query(readingsRef, where('date', '==', dateString), where('status', 'in', ['pending', 'confirmed']));
      
      const querySnapshot = await getDocs(q);
      const bookedTimes = querySnapshot.docs.map(doc => doc.data().time);

      const available = timesForToday.filter(time => !bookedTimes.includes(time));
      setAvailableTimes(available);

    } catch (err) {
      console.error("Error al obtener horarios:", err);
      setTimeFetchError("No se pudieron cargar los horarios. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBookingConfirm = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail) || !userName.trim()) {
      setBookingError("Por favor, introduce un nombre y correo electrónico válidos.");
      return;
    }
    if (!selectedReading || !selectedDate || !selectedTime) {
      setBookingError("Por favor, completa todos los campos para continuar.");
      return;
    }

    const bookingDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    bookingDateTime.setHours(hours, minutes, 0, 0);

    if (bookingDateTime < new Date()) {
      setBookingError("No puedes agendar una cita en una fecha u hora que ya ha pasado.");
      setSelectedTime(null);
      setAvailableTimes([]);
      handleDateSelect(selectedDate);
      return;
    }

    setIsBooking(true);
    setBookingError(null);

    try {
      const response = await fetch('/api/bookAppointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
          name: userName,
          email: userEmail,
          readingId: selectedReading.id,
          readingTitle: selectedReading.title,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al llamar a la API de booking');
      }

      const result = await response.json();

      if (result.success) {
        setBookingComplete(true);
      } else {
        throw new Error(result.error || 'La respuesta de la API no fue exitosa');
      }
    } catch (err: unknown) {
      console.error("Error al agendar la cita:", err);
      let errorMessage = "Hubo un problema al agendar tu cita. Por favor, inténtalo de nuevo.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setBookingError(errorMessage);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto">
      {bookingComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center p-8 bg-gray-900 backdrop-blur-md rounded-lg border border-purple-400/30 shadow-lg" style={{ animation: 'fadeIn 1s ease-out' }}>
            <h2 className="text-3xl font-cinzel-decorative text-yellow-400">¡Cita Agendada!</h2>
            <p className="mt-4 text-lg text-gray-300 max-w-md">🔮 ¡El destino ha escuchado! Tu cita está casi confirmada. Revisa tu correo para el pago 
              -si no aparece el correo, revisa la sección de spam-. </p>
            <button onClick={() => {
              setSelectedReading(null);
              resetBookingState();
            }} className="mt-8 font-semibold px-8 py-3 rounded-full bg-yellow-500 text-black ring-1 ring-yellow-200 hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(234,179,8,0.6)] hover:shadow-[0_0_30px_rgba(234,179,8,0.8)]">
              Confirmar
            </button>
          </div>
        </div>
      )}

      {!selectedReading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {readingsData.map(reading => (
            <ReadingCard key={reading.id} reading={reading} onSelect={handleReadingSelect} />
          ))}
        </div>
      )}

      {selectedReading && (
        <div ref={step2Ref}>
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <button onClick={() => {
              setSelectedReading(null);
              resetBookingState();
            }} className="text-purple-300 hover:text-white transition-colors">&larr; Cambiar de lectura</button>
            <div className="text-right">
              <p className="text-lg text-gray-300">{selectedReading.title}</p>
              <p className="text-2xl font-bold text-yellow-400">${selectedReading.price} MXN</p>
            </div>
          </div>
          <div className="bg-black/70 backdrop-blur-md p-4 sm:p-8 rounded-lg border border-purple-400/30 flex flex-col md:flex-row gap-8">
            <div className="flex-grow flex justify-center">
              <DayPicker 
                mode="single" 
                selected={selectedDate} 
                onSelect={handleDateSelect} 
                locale={es} 
                disabled={(date) => date < new Date(new Date().toDateString())}
              />
            </div>

            {selectedDate && (
              <div className="md:w-1/3 md:border-l md:border-purple-400/20 md:pl-8">
                <h3 className="text-xl font-cinzel-decorative text-center md:text-left mb-4">
                  Horas para <br/> {format(selectedDate, 'PPP', { locale: es })}
                </h3>
                {isLoading && <p className="text-center text-gray-400">Buscando horas...</p>}
                {timeFetchError && <p className="text-center text-red-400">{timeFetchError}</p>}
                {!isLoading && !timeFetchError && (
                  availableTimes.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3">
                      {availableTimes.map(time => (
                        <button key={time} onClick={() => setSelectedTime(time)} className={`time-slot p-2 rounded-md text-center transition-colors ${selectedTime === time ? 'bg-purple-600 text-white ring-2 ring-white' : 'bg-purple-900/50 hover:bg-purple-600/80'}`}>
                          {time}
                        </button>
                      ))
                      }
                    </div>
                  ) : (
                    <p className="text-center text-gray-400">No hay horas disponibles para este día.</p>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedDate && selectedTime && (
        <div className="text-center mt-8 transition-all duration-300 flex flex-col items-center gap-6">
          <div>
            <label htmlFor="name" className="block text-purple-200 mb-2 font-cormorant-garamond text-lg">Nombre:</label>
            <input
              type="text"
              id="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full max-w-md px-4 py-2 rounded-md bg-purple-900/50 border border-purple-400/30 text-white focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-purple-200 mb-2 font-cormorant-garamond text-lg">Correo para la confirmación:</label>
            <input
              type="email"
              id="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="tu.correo@ejemplo.com"
              className="w-full max-w-md px-4 py-2 rounded-md bg-purple-900/50 border border-purple-400/30 text-white focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-4 text-center">El pago se realiza por transferencia bancaria. Recibirás los detalles en el correo de confirmación.</p>
            <button onClick={handleBookingConfirm} disabled={isBooking || !userName.trim() || !userEmail} className="font-semibold px-8 py-3 rounded-full bg-yellow-500 text-black ring-1 ring-yellow-200 hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(234,179,8,0.6)] hover:shadow-[0_0_30px_rgba(234,179,8,0.8)] disabled:bg-gray-500 disabled:shadow-none disabled:cursor-not-allowed">
              {isBooking ? 'Agendando...' : 'Confirmar Cita'}
            </button>
            {bookingError && <p className="text-center text-red-400 mt-4">{bookingError}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSystem;