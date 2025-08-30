"use client";
import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';
import Header from "../../components/Header";
import AppFooter from "../../components/AppFooter";
import { motion } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import Constellation from "../../components/Constellation";

// SIMULACIÓN DE DATOS
const availableHoursByDay = {
  1: [],
  2: ['10:00', '11:00', '12:00', '15:00', '16:00'],
  3: ['10:00', '11:00', '15:00'],
  4: ['10:00', '11:00', '12:00', '15:00', '16:00'],
  5: ['10:00', '11:00'],
  6: [],
  0: [],
};

const CitasPage = () => {
  const [bookedAppointments, setBookedAppointments] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const item = window.localStorage.getItem('bookedAppointments');
      if (item) {
        const parsed = JSON.parse(item);
        return parsed.map(appt => ({ ...appt, date: new Date(appt.date) }));
      }
    } catch (error) {
      console.error("Error reading from localStorage", error);
    }
    return [{ date: new Date("2025-09-16T10:00:00"), time: '10:00' }];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('bookedAppointments', JSON.stringify(bookedAppointments));
      } catch (error) {
        console.error("Error writing to localStorage", error);
      }
    }
  }, [bookedAppointments]);
  
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [lastBooking, setLastBooking] = useState<{date: Date, time: string, name: string} | null>(null);

  // Particle state and options
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particleOptions = {
    background: { color: { value: "#000" } },
    fpsLimit: 60,
    particles: {
      number: { value: 150 },
      color: { value: "#fff" },
      opacity: { value: { min: 0.1, max: 0.7 } },
      size: { value: { min: 1, max: 2.5 } },
      move: { enable: true, speed: 0.2, direction: "none" as const, straight: false },
    },
  };

  const disabledDays = (date: Date) => {
    const dayOfWeek = date.getDay();
    return availableHoursByDay[dayOfWeek].length === 0;
  };

  const getAvailableSlots = (day: Date) => {
    if (!day) return [];
    const dayOfWeek = day.getDay();
    const allSlots = availableHoursByDay[dayOfWeek] || [];
    const bookedSlots = bookedAppointments
      .filter(appt => format(appt.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
      .map(appt => appt.time);
    return allSlots.filter(slot => !bookedSlots.includes(slot));
  };

  const availableSlots = selectedDay ? getAvailableSlots(selectedDay) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay || !selectedTime) return;
    const newAppointment = { date: selectedDay, time: selectedTime };
    setBookedAppointments([...bookedAppointments, newAppointment]);
    setLastBooking({ date: selectedDay, time: selectedTime, name });
    setSelectedDay(undefined);
    setSelectedTime('');
    setName('');
    setEmail('');
  };

  if (lastBooking) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black">
        {init && <Particles options={particleOptions} className="absolute inset-0 z-0" />}
        <Header animate={false} />
        <main className="container mx-auto p-8 pt-32 flex flex-col items-center justify-center text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-bold text-yellow-400 mb-4">¡Cita Confirmada!</h1>
            <p className="text-xl mb-2">Gracias por tu confianza, {lastBooking.name}.</p>
            <p className="text-lg mb-6">Tu lectura de tarot está agendada para el <span className="font-semibold">{format(lastBooking.date, 'PPP')}</span> a las <span className="font-semibold">{lastBooking.time}</span>.</p>
            <button 
              onClick={() => setLastBooking(null)}
              className="p-2 px-6 rounded-lg bg-yellow-500 text-gray-900 font-bold hover:bg-yellow-400">
              Agendar otra cita
            </button>
          </motion.div>
        </main>
        <AppFooter animate={true} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {init && <Particles options={particleOptions} className="absolute inset-0 z-0" />}
      <Header animate={false} />
      <main className="container mx-auto p-8 pt-32 flex flex-col items-center relative z-10">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Agenda tu Cita</h2>
          <p className="text-lg">Selecciona un día y hora para tu lectura de tarot.</p>
        </section>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <DayPicker
            mode="single"
            selected={selectedDay}
            onSelect={setSelectedDay}
            disabled={[{ before: new Date() }, disabledDays]}
            className="bg-gray-800 p-4 rounded-lg"
          />
          {selectedDay && (
            <div className="flex flex-col gap-4 w-full md:w-80">
              <h3 className="text-xl font-bold text-center">Horarios para {format(selectedDay, 'PPP')}</h3>
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {availableSlots.map(time => (
                    <button 
                      key={time} 
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded-lg text-center ${selectedTime === time ? 'bg-yellow-500 text-gray-900 font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}>
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400">No hay horas disponibles para este día.</p>
              )}
              
              {selectedTime && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                  <input 
                    type="text" 
                    placeholder="Nombre"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="p-2 rounded-lg bg-gray-700 border border-transparent focus:border-yellow-500 focus:outline-none" />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="p-2 rounded-lg bg-gray-700 border border-transparent focus:border-yellow-500 focus:outline-none" />
                  <button type="submit" className="p-2 rounded-lg bg-yellow-500 text-gray-900 font-bold hover:bg-yellow-400">Confirmar Cita</button>
                </form>
              )}
            </div>
          )}
        </div>
        <Constellation name="leo" />
      </main>
      <AppFooter animate={true} />
    </div>
  );
};

export default CitasPage;