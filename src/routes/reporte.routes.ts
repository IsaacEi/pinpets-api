import { Router } from 'express';
import { estadoCuenta, pedido, pedidos } from '../controllers/reporte.controller';
import { verifyToken } from '../middlewares/authentication';

const router = Router();

router.post( '/pedidos', verifyToken, pedidos );
router.post( '/pedido', verifyToken, pedido );
router.post( '/estado-cuenta', verifyToken, estadoCuenta );

export default router;
