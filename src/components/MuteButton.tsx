"use client";
import { useAudio } from "@/context/AudioProvider";

const MuteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <line x1="23" y1="9" x2="17" y2="15"></line>
    <line x1="17" y1="9" x2="23" y2="15"></line>
  </svg>
);

const UnmuteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
);

const MuteButton = () => {
  const { isMuted, toggleMute } = useAudio();

  return (
    <button onClick={toggleMute} className="p-2 rounded-full text-white hover:bg-white/20 transition-colors" aria-label={isMuted ? "Activar sonido" : "Silenciar sonido"}>
      {isMuted ? <MuteIcon /> : <UnmuteIcon />}
    </button>
  );
};

export default MuteButton;