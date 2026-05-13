import { Router } from 'express';
import { listarComercios, obtenerDashboardComercio } from '../controllers/comercios.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/roles.middleware.js';

const router = Router();

router.get('/', requireAuth, listarComercios);
router.get('/dashboard', requireAuth, checkRole('admin', 'comercio'), obtenerDashboardComercio);

export default router;
