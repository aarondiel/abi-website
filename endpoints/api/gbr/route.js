const express = require('express');
const router = express.Router();
const gbrVote = require.main.require('./models/gbr-vote');
const users = require.main.require('./models/user');

router.post('/', async (req, res) => {
	const user = await users.findOne({ code: req.body.code });

	if (!user)
		return res.status(400).json({
			message: 'code existiert nicht'
		});

	if (!user.gbr)
		return res.status(400).json({
			message: 'du hast den gbr vertrag nicht unterschrieben'
		})

	let data = { ...req.body }
	delete data['code']

	gbrVote.updateOne(
		{ user: user.id },
		{ $set: data },
		{ upsert: true }
	).then(response => {
		res.status(200).json(response);
	}).catch(err => {
		// collect every validation error
		let message = Object.values(err.errors);
		message = message.map(v => {
			return v.message
		})

		res.status(400).json({ message: message[0] });
	})
});

module.exports = router;
