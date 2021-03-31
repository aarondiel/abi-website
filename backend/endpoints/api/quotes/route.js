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
	} catch (e) {
		res.status(500).json({ message: 'some error accured' });
		console.error(e);
	}
});

router.get('/', async (req, res) => {
	try {
		const query = await quotes.aggregate([ { $limit: req.body.num } ]);

		res.status(200).json(query);
	} catch {
		res.status(500).json({ message: 'some error accured' });
	}
});

export default router;
