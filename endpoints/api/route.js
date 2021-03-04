const express = require('express');
const router = express.Router();
const slogan = require('./slogan/route');
const gbr = require('./gbr/route');

router.use('/slogan', slogan);
router.use('/gbr', gbr);

module.exports = router;
