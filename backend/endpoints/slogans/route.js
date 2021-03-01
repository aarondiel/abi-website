const express = require('express')
const router = express.Router()
const vote = require('../../models/slogan-votes')

router.post('/', ({req, res}) => {
	req.body.lastChanged = Date.now();

	vote.findOne({
		userAccessCode: req.body.userAccessCode,
	}).then(data => {
		if (!data) {
			// user does not exist
			vote.create(req.body).then(() => {
				res.status(201).json({ message: "voted" });
			}).catch(err => {
				res.status(400).json({ message: err.message });
			});
		} else {
			// user alredy exists

			data.choice = req.body.choice;
			data.save(err => {
				if (err) {
					res.status(400).json({ message: err.message });
				} else {
					res.status(200).json({ message: "vote updated" });
				}
			})
		}
	})
})

router.get('/', ({res, next}) => {
	vote.find().then(votes => {
		// only send choices
		const choices = votes.map(vote => vote.choice);
		res.status(200).json(choices)
	}).catch(err => {
		res
		next({ status: 500, message: err.message })
	})
})
