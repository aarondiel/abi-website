const express = require('express');
const router = express.Router();

router.get('/', ({ res }) => {
	res.send('<p>abi website frontend</p>');
});

module.exports = router;
