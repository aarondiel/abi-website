import { Router } from 'express'
const router = Router();
import slogan from './slogan/route.js';
import gbr from './gbr/route.js';
import quotes from './quotes/route.js';

router.use('/slogan', slogan);
router.use('/gbr', gbr);
router.use('/quotes', quotes);

export default router;
