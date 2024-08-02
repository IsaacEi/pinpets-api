import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { 
    actualizar,
    borrar,
    carrito,
    crear,
    lista,
    obtener,
    obtenerInvitado
} from '../controllers/direccion_cliente.controller';

const router = Router();

router.post( '/crear', verifyToken, crear );
router.post( '/actualizar', verifyToken, actualizar );
router.post( '/borrar', verifyToken, borrar );
router.post( '/lista', verifyToken, lista );
router.post( '/obtener', verifyToken, obtener );
router.post( '/obtener-invitado', verifyToken, obtenerInvitado );
router.post( '/carrito', verifyToken, carrito );

export default router;
