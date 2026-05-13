const express = require('express');
const router = express.Router();
const { obtenerClima } = require('../services/climaService');
const { tarifaClimatica } = require('../services/iaClima');

router.get('/calcular', async (req, res) => {
  try {
    const { lat, lon, base } = req.query;

    const clima = await obtenerClima(lat, lon);
    const tarifa = await tarifaClimatica(base, clima.clima);

    res.json({
      clima,
      tarifaFinal: tarifa
    });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo calcular la tarifa climatica' });
  }
});

module.exports = router;
