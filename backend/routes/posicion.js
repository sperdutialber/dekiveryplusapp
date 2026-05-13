const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const permitirRoles = require('../middleware/roles');
const posicionController = require('../controllers/posicionController');

router.post(
  '/update',
  verificarToken,
  permitirRoles('repartidor'),
  posicionController.actualizarPosicion
);

router.get(
  '/todos',
  verificarToken,
  permitirRoles('admin'),
  posicionController.obtenerPosiciones
);

module.exports = router;
