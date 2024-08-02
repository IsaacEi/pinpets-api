import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { 
    login, 
    obtener, 
    token, 
    actualizar, 
    cambiarPass, 
    image, 
    cambiarPassMail
} from '../controllers/auth.controller';

const router = Router();

router.post( '/login', login );
router.post( '/cambiar_pass_mail', cambiarPassMail );
router.post( '/actualizar', verifyToken, actualizar );
router.post( '/id', verifyToken, obtener );
router.post( '/cambiar_pass', verifyToken, cambiarPass );
router.get( '/token', verifyToken, token );
router.get( '/image', image);

export default router;
