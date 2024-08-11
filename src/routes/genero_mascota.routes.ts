import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { lista } from '../controllers/genero_mascota.controller';

const router = Router();

router.post( '/lista', verifyToken, lista );

export default router;
