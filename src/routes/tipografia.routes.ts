import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { lista } from '../controllers/tipografia.controller';

const router = Router();

router.post( '/lista', verifyToken, lista );

export default router;
