import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { 
    crear,
    actualizar,
    borrar,
    obtener,
    lista,
    listaApp,
} from '../controllers/tipo_mascota.controller';

const router = Router();

router.post( '/crear', crear );
router.post( '/actualizar', verifyToken, actualizar );
router.post( '/borrar', verifyToken, borrar );
router.post( '/id', verifyToken, obtener );
router.post( '/lista', verifyToken, lista );
// app
router.post( '/lista-app', listaApp );

export default router;
