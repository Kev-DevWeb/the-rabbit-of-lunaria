'use client';

import React, { useState, useEffect } from 'react';
import { Music, X } from 'lucide-react';

export interface MusicNotification {
  id: string;
  title: string;
  channel: string;
  thumbnail?: string;
  timestamp: number;
}

interface MusicNotificationProps {
  notification: MusicNotification;
  onClose: (id: string) => void;
  duration?: number; // Duración en ms antes de auto-cerrar
}

const MusicNotificationItem: React.FC<MusicNotificationProps> = ({ 
  notification, 
  onClose, 
  duration = 4000 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animar entrada
    setTimeout(() => setIsVisible(true), 100);

    // Auto cerrar después de la duración especificada
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(autoCloseTimer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300); // Tiempo de la animación de salida
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        bg-black/90 backdrop-blur-md border border-purple-500/30
        rounded-lg p-4 shadow-2xl
        transform transition-all duration-300 ease-out
        ${isVisible && !isExiting 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
      `}
      style={{
        background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(88,28,135,0.3) 100%)',
        boxShadow: '0 0 30px rgba(168,85,247,0.3)'
      }}
    >
      {/* Header con botón cerrar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Music className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-purple-300 font-medium">Ahora suena</span>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Cerrar notificación"
        >
          <X className="w-3 h-3 text-gray-400 hover:text-white" />
        </button>
      </div>

      {/* Contenido de la notificación */}
      <div className="flex space-x-3">
        {/* Thumbnail */}
        {notification.thumbnail && (
          <div className="flex-shrink-0">
            <img
              src={notification.thumbnail}
              alt="Thumbnail"
              className="w-12 h-12 rounded-md object-cover border border-purple-500/20"
              onError={(e) => {
                // Fallback si no carga la imagen
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Información de la canción */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium text-sm mb-1 truncate">
            {notification.title}
          </h4>
          <p className="text-gray-300 text-xs truncate">
            {notification.channel}
          </p>
        </div>
      </div>

      {/* Barra de progreso (opcional) */}
      <div className="mt-3 w-full bg-gray-700 rounded-full h-1">
        <div 
          className="bg-purple-500 h-1 rounded-full transition-all duration-1000 ease-linear"
          style={{
            animation: `progress ${duration}ms linear forwards`,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

interface MusicNotificationManagerProps {
  notifications: MusicNotification[];
  onCloseNotification: (id: string) => void;
}

export const MusicNotificationManager: React.FC<MusicNotificationManagerProps> = ({
  notifications,
  onCloseNotification
}) => {
  return (
    <div className="fixed top-0 right-0 z-50 pointer-events-none">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="pointer-events-auto"
          style={{
            transform: `translateY(${index * 120}px)` // Espaciado entre notificaciones
          }}
        >
          <MusicNotificationItem
            notification={notification}
            onClose={onCloseNotification}
            duration={4000}
          />
        </div>
      ))}
    </div>
  );
};

// Hook para manejar notificaciones de música
export const useMusicNotifications = () => {
  const [notifications, setNotifications] = useState<MusicNotification[]>([]);

  const showNotification = (title: string, channel: string, thumbnail?: string) => {
    const id = `notification-${Date.now()}`;
    const newNotification: MusicNotification = {
      id,
      title,
      channel,
      thumbnail,
      timestamp: Date.now()
    };

    console.log('🔔 Creating music notification:', { 
      id, 
      title, 
      channel, 
      thumbnail,
      timestamp: new Date().toLocaleTimeString() 
    });
    
    setNotifications(prev => {
      const updated = [...prev, newNotification];
      console.log('� Updated notifications list:', updated.map(n => n.title));
      return updated;
    });
  };

  const closeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    showNotification,
    closeNotification,
    clearAllNotifications
  };
};

export default MusicNotificationItem;