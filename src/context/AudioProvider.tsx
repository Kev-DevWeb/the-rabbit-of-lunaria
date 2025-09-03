'use client';

import React, { createContext, useContext, useRef, useState, useEffect, useCallback, ReactNode } from 'react';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true); // Empezar muteado por defecto
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const audio = new Audio('/musicafondo.mp3');
    audio.preload = "auto";
    audioRef.current = audio;

    const handleAudioEnd = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    };
    audio.addEventListener('ended', handleAudioEnd);

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      audio.removeEventListener('ended', handleAudioEnd);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        audio.pause();
      } else {
        if (!isMuted && hasPlayedOnce) {
          audio.play().catch(error => console.error("Error al reanudar el audio:", error));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isMuted, hasPlayedOnce]);

  const fadeAudio = useCallback((targetVolume: number, duration: number, onComplete?: () => void) => {
    if (!audioRef.current) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const audio = audioRef.current;
    const startVolume = audio.volume;
    const steps = 50;
    const stepDuration = duration / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const newVolume = startVolume + (targetVolume - startVolume) * (currentStep / steps);
      audio.volume = Math.max(0, Math.min(1, newVolume));

      if (currentStep >= steps) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        if (onComplete) onComplete();
      }
    }, stepDuration);
  }, []);

  const toggleMute = useCallback(async () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (isMuted) { // Unmuting
      setIsMuted(false);
      audio.volume = 0;
      audio.play().catch(error => {
        console.error("Error al intentar reproducir el audio:", error);
        setIsMuted(true); // Revertir si falla
      });
      fadeAudio(0.3, 2000);
      if (!hasPlayedOnce) {
        setHasPlayedOnce(true);
      }
    } else { // Muting
      setIsMuted(true);
      fadeAudio(0, 1500, () => {
        audio.pause();
      });
    }
  }, [isMuted, hasPlayedOnce, fadeAudio]);

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute }}>
      {children}
    </AudioContext.Provider>
  );
};