import { Router } from 'express';
import authRoutes from './auth.routes.js';
import pedidosRoutes from './pedidos.routes.js';
import usuariosRoutes from './usuarios.routes.js';
import comerciosRoutes from './comercios.routes.js';
import repartidoresRoutes from './repartidores.routes.js';
import qrRoutes from './qr.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/pedidos', pedidosRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/comercios', comerciosRoutes);
router.use('/repartidores', repartidoresRoutes);
router.use('/qr', qrRoutes);

export default router;
