import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { encontraronMascota, enviarMensaje } from '../controllers/mensaje.controller';

const router = Router();

router.post( '/enviar', verifyToken, enviarMensaje );
router.post( '/encontraron-mascota', verifyToken, encontraronMascota );

export default router;
