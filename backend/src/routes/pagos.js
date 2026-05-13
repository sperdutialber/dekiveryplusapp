const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const permitirRoles = require('../middleware/roles');
const pagosController = require('../controllers/pagosController');

router.post('/acreditar', verificarToken, permitirRoles('admin', 'repartidor'), pagosController.acreditarPago);
router.get('/resumen', verificarToken, permitirRoles('admin'), pagosController.resumenPagos);

module.exports = router;
