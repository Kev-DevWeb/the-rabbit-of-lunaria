'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ConfirmationPage() {
  const params = useParams();
  const status = params.status;
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('Cargando...');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    switch (status) {
      case 'success':
        setTitle('¡Pago completado!');
        setMessage('Tu pago ha sido procesado exitosamente. Los hilos del destino han comenzado a tejerse para vuestro encuentro. Recibirás un correo con los detalles de tu cita. Revisa tu bandeja de entrada (y la de spam, por si las estrellas se desalinean).');
        setIsSuccess(true);
        break;
      case 'pending':
        setTitle('Cita reservada');
        setMessage('Tu espacio ha sido reservado. Recibirás un correo electrónico en breve con los detalles para completar el pago mediante transferencia bancaria. Tu cita se confirmará una vez recibido el pago.');
        setIsSuccess(true);
        break;
      case 'cancelled':
        setTitle('Cita cancelada');
        setMessage('La cita ha sido cancelada según tu solicitud.');
        setIsSuccess(true);
        break;
      case 'confirmed':
        setTitle('Cita confirmada');
        setMessage('¡Tu cita ha sido confirmada! Nos vemos pronto.');
        setIsSuccess(true);
        break;
      case 'error':
        setTitle('Ha ocurrido un error');
        setMessage('No se pudo procesar tu solicitud. Por favor, inténtalo de nuevo o contacta para recibir ayuda.');
        setIsSuccess(false);
        break;
      default:
        setTitle('Estado desconocido');
        setMessage('La página que buscas no existe o el estado de la cita no es válido.');
        setIsSuccess(false);
        break;
    }
  }, [status]);

  return (
    <div style={{
      fontFamily: '"Garamond", "Times New Roman", serif',
      backgroundColor: '#1a1a2e',
      color: '#e0e0e0',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#2a2a4a',
        padding: '40px',
        borderRadius: '15px',
        border: `1px solid ${isSuccess ? '#7b3f9e' : '#e74c3c'}`,
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <h1 style={{
          fontFamily: '"Cinzel Decorative", cursive',
          color: isSuccess ? '#d4b3ff' : '#e74c3c',
          fontSize: '32px',
          marginBottom: '20px'
        }}>
          {title}
        </h1>
        <p style={{ fontSize: '20px', lineHeight: '1.6' }}>
          {message}
        </p>
        <div style={{ marginTop: '40px' }}>
          <Link href="/" style={{
            textDecoration: 'none',
            color: '#1a1a2e',
            backgroundColor: '#d4b3ff',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease'
          }}>
            Regresar al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
