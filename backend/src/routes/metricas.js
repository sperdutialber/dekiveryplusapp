const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const metricasController = require('../controllers/metricasController');

router.get('/negocio', verificarToken, metricasController.metricasNegocio);
router.get('/repartidor', verificarToken, metricasController.metricasRepartidor);
router.get('/emprendedor', verificarToken, metricasController.metricasEmprendedor);
router.get('/admin', verificarToken, metricasController.metricasAdmin);

module.exports = router;
