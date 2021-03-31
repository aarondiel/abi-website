import { Router } from 'express';
const router = Router();
import quotes from '../../../models/quotes.js';
import users from '../../../models/user.js';
import mongoose from 'mongoose';

router.post('/', async (req, res) => {
	try {
		const user = await users.findOne({ code: req.body.code });

		if (!user)
			return res.status(400).json({
				message: 'code existiert nicht'
			});

		const data = { ...req.body, submittedBy: user.id };
		delete data.code;

		await quotes.updateOne(
			{ _id: new mongoose.Types.ObjectId() },
			{ $set: data },
			{ upsert: true, unique: true }
		);
		
		res.status(200).json({ message: 'successfully submitted quote' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'some error accured' });
	}
});

router.get('/', async (req, res) => {
	try {
		const limit = req.body?.num ?? 10;
		const query = await quotes.aggregate([ { $limit: limit } ]);

		res.status(200).json(query);
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'some error accured' });
	}
});

export default router;
