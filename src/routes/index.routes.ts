import { Router } from 'express';
import { index, getHtml } from '../controllers/index.controller';

const router = Router();

router.post('/', index);
router.get('/', index);

export default router;
