import { Router } from 'express';
import expressFileUpload from 'express-fileupload';
import { verifyToken } from '../middlewares/authentication';
import { 
    crear,
    actualizar,
    borrar,
    lista,
} from '../controllers/producto_foto.controller';

const router = Router();

router.use( expressFileUpload() );

router.post( '/crear', crear );
router.post( '/actualizar', verifyToken, actualizar );
router.post( '/borrar', verifyToken, borrar );
router.post( '/lista', verifyToken, lista );

export default router;
