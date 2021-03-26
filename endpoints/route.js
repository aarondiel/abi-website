import express from 'express';
const router = express.Router();
import api from './api/route.js';
import { join } from 'path';
import history from '../lib/html-history-fallback.js'

const distPath = join(process.cwd(), 'dist')

router.use('/api', api);

router.use('/', history())
router.use('/', express.static(distPath))

export default router;
