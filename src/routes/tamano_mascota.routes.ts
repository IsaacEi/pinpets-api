import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { lista } from '../controllers/tamano_mascota.controller';

const router = Router();

router.get( '/lista', verifyToken, lista );

export default router;
