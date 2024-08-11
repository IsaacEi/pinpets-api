import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { 
    login,
    registro,
    actualizar,
    activar,
    cambiarPassMail,
    codigoMail,
    cambiarPass,
    obtener,
    image,
    token,
} from '../controllers/auth_cliente.controller';

const router = Router();

router.post( '/login', login );
router.post( '/registro', registro );
router.post( '/cambiar-pass-mail', cambiarPassMail );
router.post( '/codigo-mail', codigoMail );
router.post( '/activar', verifyToken, activar );
router.post( '/cambiar-pass', verifyToken, cambiarPass );
router.post( '/actualizar', verifyToken, actualizar );
router.get( '/obtener', verifyToken, obtener );
router.get( '/token', verifyToken, token );
router.get( '/image', image);

export default router;
