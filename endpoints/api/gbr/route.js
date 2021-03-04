const express = require('express');
const router = express.Router();
const gbrVote = require.main.require('./models/gbr-vote');
const users = require.main.require('./models/user');

router.get('/', (res) => {
	res.send('votes for gbr');
})

router.post('/', (req, res) => {
	users.findOne({ code: req.body.code }).then(user => {
		if (!user)
			return res.status(400).json({
				message: 'code does not exist'
			});

		let data = { ...req.body }
		delete data['code']

		gbrVote.updateOne(
			{ user: user.id },
			{ $set: data },
			{ upsert: true }
		).then(response => {
			res.status(200).json({
				message: response
			});
		}).catch(err => {
			res.status(400).json({
				message: err
			});
		})
	})
});

module.exports = router;
