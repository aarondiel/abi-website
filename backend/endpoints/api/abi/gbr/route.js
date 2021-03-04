const express = require('express');
const router = express.Router();
const gbrVote = require.main.require('./models/gbr-vote');

router.get('/', (res) => {
	res.send('votes for gbr');
})

router.post('/', (req, res) => {
	let value = { ...req.body, user: req.body.code };
	delete value['code'];

	console.log(value);

	gbrVote.updateOne()
});

module.exports = router;
