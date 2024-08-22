import { Router } from 'express';
import { lista } from '../controllers/nacionalidad.controller';

const router = Router();

router.get( '/lista', lista );

export default router;
