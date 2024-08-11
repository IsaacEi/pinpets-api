import { Router } from 'express';
import expressFileUpload from 'express-fileupload';
import { verifyToken } from '../middlewares/authentication';
import { 
    actualizar,
    contacto,
    faqs,
    footer,
    home,
    obtener,
    openpay,
    paypal,
    quienesSomos,
    sitioWeb,
    terminosYCondiciones,
    tiendaOnline
} from '../controllers/configuracion.controller';

const router = Router();

router.use( expressFileUpload() );

router.post( '/actualizar', verifyToken, actualizar );
router.post( '/id', verifyToken, obtener );
// app
router.get( '/faqs', faqs );
router.post( '/tienda', tiendaOnline );
router.get( '/sitio', sitioWeb );
router.get( '/terminos', terminosYCondiciones );
router.get( '/contacto', contacto );
router.post( '/quienes-somos', quienesSomos );
router.post( '/home', home );
router.post( '/footer', footer );
router.post( '/openpay', verifyToken, openpay );
router.post( '/paypal', verifyToken, paypal );

export default router;
