"use client";

import { useState, useRef, useCallback } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ReadingType } from '@/types/readings';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { readingsData } from '@/lib/readings-data';

// --- Sub-componente para la tarjeta de lectura ---
interface ReadingCardProps {
  reading: ReadingType;
  onSelect: (reading: ReadingType) => void;
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
  const [selectedReading, setSelectedReading] = useState<ReadingType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [timeFetchError, setTimeFetchError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  
  const containerRef = useRef(null);
  const step2Ref = useRef(null);

  useGSAP(() => {
    if (selectedReading) {
      gsap.fromTo(step2Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    }
  }, { dependencies: [selectedReading], scope: containerRef });

  const resetBookingState = useCallback(() => {
    setSelectedDate(undefined);
    setSelectedTime(null);
    setAvailableTimes([]);
    setUserEmail('');
    setTimeFetchError(null);
    setBookingError(null);
    setBookingSuccess(null);
  }, []);

  const handleReadingSelect = (reading: ReadingType) => {
    setSelectedReading(reading);
    resetBookingState();
  };

  const handleDateSelect = useCallback(async (date: Date | undefined) => {
    if (!date) return;
    resetBookingState(); // Resetea hora/errores al elegir nueva fecha
    setSelectedDate(date);
    setIsLoading(true);
    setTimeFetchError(null);
    setBookingError(null);

    try {
      // 1. Determinar los horarios base según el día de la semana
      const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado
      let baseAvailableTimes: string[];

      if (dayOfWeek === 0 || dayOfWeek === 6) { // Sábado o Domingo
        baseAvailableTimes = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
      } else { // Lunes a Viernes
        baseAvailableTimes = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
      }

      // 2. Filtrar horarios pasados si la fecha seleccionada es hoy
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

      // 3. Consultar las citas ya existentes en Firebase
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('date', '>=', Timestamp.fromDate(startOfDay)), where('date', '<=', Timestamp.fromDate(endOfDay)));
      
      const querySnapshot = await getDocs(q);
      const bookedTimes = querySnapshot.docs.map(doc => doc.data().time);

      // 4. Filtrar los horarios ya reservados
      const available = timesForToday.filter(time => !bookedTimes.includes(time));
      setAvailableTimes(available);

    } catch (err) {
      console.error("Error al obtener horarios:", err);
      setTimeFetchError("No se pudieron cargar los horarios. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }, [resetBookingState]);

  const handleBookingConfirm = async () => {
    // Validación de campos
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      setBookingError("Por favor, introduce un correo electrónico válido.");
      return;
    }
    if (!selectedReading || !selectedDate || !selectedTime || !userEmail) {
      setBookingError("Por favor, completa todos los campos para continuar.");
      return;
    }

    // --- DOBLE VERIFICACIÓN DE FECHA Y HORA ---
    const bookingDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    bookingDateTime.setHours(hours, minutes, 0, 0); // Seteamos segundos y ms a 0

    const now = new Date();

    if (bookingDateTime < now) {
      setBookingError("No puedes agendar una cita en una fecha u hora que ya ha pasado.");
      // Opcional: resetear la hora para forzar al usuario a re-seleccionar
      setSelectedTime(null);
      setAvailableTimes([]);
      handleDateSelect(selectedDate); // Recalcular horas disponibles
      return;
    }
    // --- FIN DE LA VERIFICACIÓN ---

    setIsBooking(true);
    setBookingError(null);
    setBookingSuccess(null);
    try { 
      await addDoc(collection(db, 'bookings'), {
        readingId: selectedReading.id,
        readingTitle: selectedReading.title,
        price: selectedReading.price,
        date: Timestamp.fromDate(bookingDateTime),
        time: selectedTime,
        userEmail: userEmail,
      });

      // Envío de correo de confirmación
      try {
        await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail,
            readingTitle: selectedReading.title,
            date: bookingDateTime.toISOString(),
            time: selectedTime,
          }),
        });
      } catch (emailError) {
        console.error("Error de Red: El correo de confirmación no pudo ser enviado, pero la cita fue agendada:", emailError);
      }

      const successMessage = `¡Cita agendada con éxito para el ${format(bookingDateTime, 'PPP', { locale: es })} a las ${selectedTime}!`;
      setBookingSuccess(successMessage);
      setSelectedReading(null);
      resetBookingState();

    } catch (err) {
      console.error("Error al agendar la cita:", err);
      setBookingError("Hubo un problema al agendar tu cita. Por favor, inténtalo de nuevo.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto">
      {/* Mensaje de éxito */}
      {bookingSuccess && !selectedReading && (
        <div className="bg-green-900/50 border border-green-400 text-green-200 px-4 py-3 rounded-lg relative mb-6 text-center" role="alert">
          <span className="block sm:inline">{bookingSuccess}</span>
        </div>
      )}

      {/* Paso 1: Seleccionar Tirada */}
      {!selectedReading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {readingsData.map(reading => (
            <ReadingCard key={reading.id} reading={reading} onSelect={handleReadingSelect} />
          ))}
        </div>
      )}

      {/* Paso 2 y 3: Seleccionar Fecha y Hora */}
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
                      ))}
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

      {/* Paso 4: Confirmación */}
      {selectedDate && selectedTime && (
        <div className="text-center mt-8 transition-all duration-300 flex flex-col items-center gap-6">
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
            <button onClick={handleBookingConfirm} disabled={isBooking || !userEmail} className="font-semibold px-8 py-3 rounded-full bg-yellow-500 text-black ring-1 ring-yellow-200 hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(234,179,8,0.6)] hover:shadow-[0_0_30px_rgba(234,179,8,0.8)] disabled:bg-gray-500 disabled:shadow-none disabled:cursor-not-allowed">
              {isBooking ? 'Agendando...' : 'Confirmar Cita'}
            </button>
            {/* Mensaje de error para la confirmación */}
            {bookingError && <p className="text-center text-red-400 mt-4">{bookingError}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSystem;