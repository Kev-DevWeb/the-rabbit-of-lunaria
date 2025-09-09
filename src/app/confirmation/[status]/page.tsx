'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ConfirmationPage() {
  const params = useParams();
  const status = params.status;
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (status === 'success') {
      setMessage('¡Acción realizada con éxito!');
      setIsSuccess(true);
    } else if (status === 'cancelled') {
      setMessage('La cita ha sido cancelada.');
      setIsSuccess(true);
    } else if (status === 'confirmed') {
      setMessage('La cita ha sido confirmada.');
      setIsSuccess(true);
    } else if (status === 'error') {
      setMessage('Ha ocurrido un error al procesar la solicitud.');
      setIsSuccess(false);
    } else {
      setMessage('Estado desconocido.');
      setIsSuccess(false);
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
        width: '100%'
      }}>
        <h1 style={{
          fontFamily: '"Cinzel Decorative", cursive',
          color: isSuccess ? '#d4b3ff' : '#e74c3c',
          fontSize: '32px',
          marginBottom: '20px'
        }}>
          {isSuccess ? '~ Mensaje del Cosmos ~' : '~ Un Velo de Incertidumbre ~'}
        </h1>
        <p style={{ fontSize: '20px', lineHeight: '1.6' }}>
          {message}
        </p>
        <p style={{ marginTop: '30px', fontSize: '16px' }}>
          Puedes cerrar esta ventana.
        </p>
      </div>
    </div>
  );
}
