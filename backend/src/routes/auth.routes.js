import { Router } from 'express';
import { login, me, registro } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/roles.middleware.js';

const router = Router();

router.post('/login', login);
router.post('/registro', registro);
router.get('/me', requireAuth, me);
router.get('/panel-emprendedor', requireAuth, checkRole('emprendedor'), (req, res) => {
  res.json({ msg: 'Panel emprendedor OK' });
});

export default router;
