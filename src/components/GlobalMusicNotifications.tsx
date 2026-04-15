'use client';

import React, { useCallback } from 'react';
import { useBackgroundMusic } from '@/context/BackgroundMusicProvider';
import { Music, X } from 'lucide-react';

interface MusicNotificationProps {
  notification: {
    id: string;
    title: string;
    channel: string;
    thumbnail?: string;
    timestamp: number;
  };
  onClose: (id: string) => void;
  duration?: number;
}

const MusicNotificationComponent: React.FC<MusicNotificationProps> = ({
  notification,
  onClose,
  duration = 4000
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300); // Tiempo de la animación de salida
  }, [notification.id, onClose]);

  React.useEffect(() => {
    // Aparecer con animación
    setTimeout(() => setIsVisible(true), 100);

    // Auto cerrar después de la duración especificada
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(autoCloseTimer);
  }, [duration, handleClose]);

  return (
    <div
      className={`
        max-w-sm w-full
        bg-black/90 text-white rounded-lg border border-purple-500/30
        backdrop-blur-sm shadow-xl
        transform transition-all duration-300 ease-out
        ${isVisible && !isExiting 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
        }
      `}
    >
      <div className="flex items-center p-4">
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <Music className="w-4 h-4" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {notification.title}
          </p>
          <p className="text-xs text-gray-300 truncate">
            {notification.channel}
          </p>
        </div>
        
        <button
          onClick={handleClose}
          className="ml-3 flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Barra de progreso */}
      <div className="h-1 bg-gray-800">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all ease-linear"
          style={{
            width: isVisible && !isExiting ? '0%' : '100%',
            transitionDuration: `${duration}ms`
          }}
        />
      </div>
    </div>
  );
};

// Componente principal que usa el contexto global
export const GlobalMusicNotifications: React.FC = () => {
  const { notifications, closeNotification } = useBackgroundMusic();


  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <MusicNotificationComponent
            notification={notification}
            onClose={closeNotification}
            duration={4000}
          />
        </div>
      ))}
    </div>
  );
};

export default GlobalMusicNotifications;