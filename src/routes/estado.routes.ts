import { Router } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { lista } from '../controllers/estado.controller';

const router = Router();

// app
router.post( '/lista', lista );

export default router;
