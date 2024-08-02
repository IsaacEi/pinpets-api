import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { 
    cobro,
    cobroCliente,
    crearTarjeta,
    eliminarTarjeta,
    obtener,
    lista,
    crear,
    estatusCobro
} from '../controllers/tarjeta.controller';

const router = Router();

router.post( '/lista', verifyToken, lista );
router.post( '/obtene', verifyToken, obtener );
router.post( '/crear', verifyToken, crear );
router.post( '/crear-tarjeta', verifyToken, crearTarjeta );
router.post( '/eliminar-tarjeta', verifyToken, eliminarTarjeta );
router.post( '/cobro-cliente', verifyToken, cobroCliente );
router.post( '/cobro', verifyToken, cobro );
router.post( '/estatus-cobro', verifyToken, estatusCobro );

export default router;
