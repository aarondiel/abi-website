const express = require('express');
const router = express.Router();
const api = require('./api/route');
const path = require('path');
const history = require('connect-history-api-fallback')

const distPath = path.join(process.cwd(), 'dist')

router.use('/api', api);

router.use('/', history())
router.use('/', express.static(distPath))

module.exports = router;
