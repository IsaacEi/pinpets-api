import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { 
    crear,
    actualizar,
    borrar,
    obtener,
    lista,
    buscar,
    listaHome,
    obtenerProductoTienda,
} from '../controllers/producto.controller';

const router = Router();

router.post( '/crear', crear );
router.post( '/actualizar', verifyToken, actualizar );
router.post( '/borrar', verifyToken, borrar );
router.post( '/id', verifyToken, obtener );
router.post( '/lista', verifyToken, lista );
router.post( '/buscar', verifyToken, buscar );
// ecommerce-ventas
router.post( '/lista-home', listaHome );
router.post( '/producto-tienda', obtenerProductoTienda );

export default router;
