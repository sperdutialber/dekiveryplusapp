const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const permitirRoles = require('../middleware/roles');
const repartidorController = require('../controllers/repartidorController');

// Obtener pedidos asignados al repartidor
router.get('/pedidos', verificarToken, permitirRoles('repartidor'), repartidorController.getPedidosAsignados);

// Cambiar estado del pedido
router.put('/pedidos/:id/estado', verificarToken, permitirRoles('repartidor'), repartidorController.cambiarEstado);

module.exports = router;
