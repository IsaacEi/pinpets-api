import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import {
    agregarCarrito,
    cantidadCarrito,
    crearAtributoCarrito,
    cuponCarrito,
    eliminarCarrito,
    obtenerCarrito
} from '../controllers/carrito.controller';

const router = Router();

// ecommerce-ventas
router.post( '/crear-atributo', verifyToken, crearAtributoCarrito);
router.post( '/agregar-carrito', verifyToken, agregarCarrito );
router.post( '/obtener-carrito', verifyToken, obtenerCarrito );
router.post( '/eliminar-carrito', verifyToken, eliminarCarrito );
router.post( '/cantidad-carrito', verifyToken, cantidadCarrito );
router.post( '/cupon-carrito', verifyToken, cuponCarrito );

export default router;
