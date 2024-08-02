import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { lista } from '../controllers/tipo_cupon.controller';

const router = Router();

router.post( '/lista', verifyToken, lista );

export default router;
