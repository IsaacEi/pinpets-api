import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { 
    crear,
    actualizar,
    borrar,
    obtener,
    lista,
} from '../controllers/mascota.controller';

const router = Router();

router.post( '/crear', verifyToken, crear );
router.put( '/actualizar', verifyToken, actualizar );
router.delete( '/borrar', verifyToken, borrar );
router.post( '/obtener', verifyToken, obtener );
router.get( '/lista', verifyToken, lista );

export default router;
