import { Router } from 'express';
import expressFileUpload from 'express-fileupload';
import { 
    download,
    image 
} from '../controllers/image.controller';

const router = Router();

router.use( expressFileUpload() );

router.get('/:path/:image', image);
router.get('/download/:path/:image', download);

export default router;
