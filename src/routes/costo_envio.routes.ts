import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { 
    actualizar,
    obtener,
    lista,
    buscar,
    costoEnvioCarrito,
    listaEstados,
} from '../controllers/costo_envio.controller';

const router = Router();

router.post( '/actualizar', verifyToken, actualizar );
router.post( '/id', verifyToken, obtener );
router.post( '/lista', verifyToken, lista );
router.post( '/buscar', verifyToken, buscar );
// ecommerce-ventas
router.post( '/lista-estados', verifyToken, listaEstados );
router.post( '/costo-carrito', verifyToken, costoEnvioCarrito );

export default router;
