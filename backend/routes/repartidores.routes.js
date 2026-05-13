import { Router } from 'express';
import { actualizarTracking, listarRepartidores } from '../controllers/repartidores.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/roles.middleware.js';

const router = Router();

router.get('/', requireAuth, checkRole('admin', 'comercio'), listarRepartidores);
router.post('/tracking', requireAuth, checkRole('repartidor'), actualizarTracking);

export default router;
