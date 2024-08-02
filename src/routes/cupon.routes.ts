import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { 
    crear,
    actualizar,
    borrar,
    obtener,
    lista,
    buscar,
    buscarCuponesDetalle,
    actualizarDetalleCupon,
} from '../controllers/cupon.controller';

const router = Router();

router.post( '/crear', crear );
router.post( '/actualizar', verifyToken, actualizar );
router.post( '/borrar', verifyToken, borrar );
router.post( '/id', verifyToken, obtener );
router.post( '/lista', verifyToken, lista );
router.post( '/buscar', verifyToken, buscar );
router.post( '/buscar-cupones-detalle', verifyToken, buscarCuponesDetalle );
router.post( '/actualizar-detalle-cupon', verifyToken, actualizarDetalleCupon );

export default router;
