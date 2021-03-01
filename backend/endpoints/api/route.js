const express = require('express');
const router = express.Router();
const abi = require('./abi/route');

router.use('/abi', abi);

module.exports = router;
