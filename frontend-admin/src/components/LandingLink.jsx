import { useState, useEffect } from 'react';

export default function LandingLink() {
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/qr');
        const data = await response.json();
        setQr(data.qr);
      } catch (error) {
        console.error('Error cargando QR:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQR();
  }, []);

  return (
    <div style={{
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      textAlign: 'center',
      marginBottom: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>DeliveryPlus</h2>
      
      <a
        href="https://landing-deliveryplus-1nvy.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          marginBottom: '20px',
          cursor: 'pointer'
        }}
      >
        📖 Ver guía de uso (Landing)
      </a>

      {loading ? (
        <p>Cargando QR...</p>
      ) : qr ? (
        <div>
          <p style={{ marginTop: '20px', marginBottom: '10px' }}>Escanea para acceder a la landing:</p>
          <img
            src={qr}
            alt="QR DeliveryPlus"
            style={{
              width: '200px',
              height: '200px',
              border: '2px solid #007bff',
              borderRadius: '5px',
              padding: '10px',
              backgroundColor: 'white'
            }}
          />
        </div>
      ) : (
        <p style={{ color: 'red' }}>Error cargando QR</p>
      )}
    </div>
  );
}
