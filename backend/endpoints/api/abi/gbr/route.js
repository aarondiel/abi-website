const express = require('express');
const router = express.Router();

router.get('/', ({ res }) => {
	res.send('votes for gbr');
})

router.post('/', () => {

});

module.exports = router;
