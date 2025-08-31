"use client";
import React from 'react';
import Link from 'next/link';

const FloatingButton = () => (
  <Link
    href="/citas"
    className="fixed bottom-8 right-8 z-[100] bg-indigo-600 hover:bg-indigo-800 transition-colors text-white font-bold px-6 py-3 rounded-full shadow-2xl text-lg animate-bounce"
    style={{ boxShadow: '0 4px 24px 0 #6366f1', letterSpacing: 1 }}
  >
    Agenda una cita
  </Link>
);

export default FloatingButton;
