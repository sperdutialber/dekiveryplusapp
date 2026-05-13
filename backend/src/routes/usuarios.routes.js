import { Router } from 'express';
import { listarUsuarios, obtenerUsuario } from '../controllers/usuarios.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/roles.middleware.js';

const router = Router();

router.get('/', requireAuth, checkRole('admin'), listarUsuarios);
router.get('/:id', requireAuth, checkRole('admin'), obtenerUsuario);

export default router;
