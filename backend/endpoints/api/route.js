import { Router } from 'express'
const router = Router();
import slogan from './slogan/route.js';
import gbr from './gbr/route.js';

router.use('/slogan', slogan);
router.use('/gbr', gbr);

export default router;
