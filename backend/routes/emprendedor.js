const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const permitirRoles = require('../middleware/roles');
const emprendedorController = require('../controllers/emprendedorController');

router.get('/productos', verificarToken, permitirRoles('emprendedor'), emprendedorController.getProductos);

router.post('/productos', verificarToken, permitirRoles('emprendedor'), emprendedorController.crearProducto);

router.put('/productos/:id', verificarToken, permitirRoles('emprendedor'), emprendedorController.actualizarProducto);

router.delete('/productos/:id', verificarToken, permitirRoles('emprendedor'), emprendedorController.eliminarProducto);

module.exports = router;
