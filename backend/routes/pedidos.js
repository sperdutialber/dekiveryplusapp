const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');
const verificarToken = require('../middleware/auth');
const permitirRoles = require('../middleware/roles');

// Ver pedidos -> cualquier usuario autenticado
router.get('/', verificarToken, pedidosController.getPedidos);

// Crear pedido -> solo negocios
router.post('/', verificarToken, permitirRoles('negocio'), pedidosController.createPedido);

module.exports = router;
