'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  duration?: number;
}

const MusicNotificationComponent: React.FC<MusicNotificationProps> = ({
  notification,
  onClose,
  duration = 4000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300); // Tiempo de la animación de salida
  }, [notification.id, onClose]);

  useEffect(() => {
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
        fixed top-4 right-4 z-50 max-w-sm w-full
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

// Hook para gestionar notificaciones
export const useMusicNotifications = () => {
  const [notifications, setNotifications] = useState<MusicNotification[]>([]);

  const showNotification = (title: string, channel: string, thumbnail?: string) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
      // Evitar notificaciones duplicadas del mismo track en menos de 2 segundos
      const hasDuplicate = prev.some(n => 
        n.title === title && (Date.now() - n.timestamp) < 2000
      );
      
      if (hasDuplicate) {
        console.log('🚫 Duplicate notification prevented:', title);
        return prev;
      }

      const updated = [...prev, newNotification];
      console.log('📋 Updated notifications list:', updated.map(n => n.title));
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

// Componente principal que renderiza todas las notificaciones usando el contexto global
export const MusicNotifications: React.FC = () => {
  // Este hook necesita ser importado desde el BackgroundMusicProvider
  // Por ahora usamos el hook local hasta conectar correctamente
  const { notifications, closeNotification } = useMusicNotifications();

  console.log('🎯 MusicNotifications rendered with notifications:', notifications.length);

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

export default MusicNotificationComponent;