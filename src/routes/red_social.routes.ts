import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { 
    actualizar,
    obtener,
    lista,
    buscar
} from '../controllers/red_social.controller';

const router = Router();

router.post( '/actualizar', verifyToken, actualizar );
router.post( '/id', verifyToken, obtener );
router.post( '/lista', verifyToken, lista );
router.post( '/buscar', verifyToken, buscar );

export default router;
