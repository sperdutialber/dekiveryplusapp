import { Router } from 'express';
import { generarQR } from '../services/qr.service.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const qr = await generarQR();
    res.json({ qr });
  } catch (error) {
    res.status(500).json({ error: 'Error generando QR' });
  }
});

export default router;
