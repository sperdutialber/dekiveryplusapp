const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const permitirRoles = require('../middleware/roles');
const adminController = require('../controllers/adminController');

router.get('/resumen', verificarToken, permitirRoles('admin'), adminController.resumen);
router.get('/actividad', verificarToken, permitirRoles('admin'), adminController.actividad);
router.get('/usuarios', verificarToken, permitirRoles('admin'), adminController.usuarios);
router.get('/pedidos', verificarToken, permitirRoles('admin'), adminController.pedidos);
router.get('/mapa', verificarToken, permitirRoles('admin'), adminController.mapa);

module.exports = router;
