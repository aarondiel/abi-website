const express = require('express')
const router = express.Router();
const vote = require.main.require('./models/slogan-vote');
const users = require.main.require('./models/user');

router.post('/', (req, res) => {
	// find the user with the corresponding code
	users.findOne({
		code: req.body.code
	}).then(data => {
		if(!data)
			return res.status(400).json({
				message: 'code does not exist'
			});

		// update the vote of the user
		vote.updateOne({ user: data.id },
			{
				$set: {
					choice: req.body.choice,
					lastChanged: Date.now()
				}
			},
			{ upsert: true }
		).then(() => {
			// updating successful
			return res.status(200).json({
				message: 'voted successfully'
			});
		}).catch(err => {
			// updating caused an error
			return res.status(500).json({
				message: err
			});
		});
	});
});

router.get('/', ({ res }) => {
	vote.find().then(votes => {
		// only send choices const choices = votes.map(vote => vote.choice);
		const choices = votes.map(vote => vote.choice);
		res.status(200).json(choices);
	}).catch(err => {
		res.status(500).json({
			message: err.message
		});
	});
});

module.exports = router;
