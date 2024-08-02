import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { enviar } from '../controllers/contacto.controller';
const router = Router();

router.post('/enviar', verifyToken, enviar);

export default router;