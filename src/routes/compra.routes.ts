import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { confirmarCompra } from '../controllers/compra.controller';

const router = Router();

// ecommerce-ventas
router.post( '/confirmar-compra', verifyToken, confirmarCompra);

export default router;
