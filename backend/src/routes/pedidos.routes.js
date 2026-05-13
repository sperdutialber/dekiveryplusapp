import { Router } from 'express';
import { crearPedido, listarPedidos, obtenerPedido, actualizarEstadoPedido } from '../controllers/pedidos.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/roles.middleware.js';

const router = Router();

router.get('/', requireAuth, listarPedidos);
router.get('/:id', requireAuth, obtenerPedido);
router.post('/', requireAuth, checkRole('admin', 'comercio', 'cliente'), crearPedido);
router.patch('/:id/estado', requireAuth, checkRole('admin', 'comercio', 'repartidor'), actualizarEstadoPedido);

export default router;
