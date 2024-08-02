import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { confirmarPedido, estatusPedido } from '../controllers/pedido.controller';

const router = Router();

router.post('/estatus-pedido', verifyToken, estatusPedido);
router.post('/confirmar-pedido', verifyToken, confirmarPedido);

export default router;
