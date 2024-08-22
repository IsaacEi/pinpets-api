import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { crear, detalleReporte } from '../controllers/detalle_reporte.controller';

const router = Router();

router.post( '/crear', verifyToken, crear );
router.post( '/reporte', verifyToken, detalleReporte );

export default router;
