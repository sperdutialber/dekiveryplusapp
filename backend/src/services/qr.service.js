import QRCode from 'qrcode';

export const generarQR = async () => {
  const url = 'https://landing-deliveryplus-1nvy.vercel.app/';
  try {
    const qrDataURL = await QRCode.toDataURL(url);
    return qrDataURL;
  } catch (error) {
    console.error('Error generando QR:', error);
    throw error;
  }
};
