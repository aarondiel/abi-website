import { Router } from 'express';
const router = Router();
import quotes from '../../../models/quotes.js';
import users from '../../../models/user.js';
import mongoose from 'mongoose';

router.post('/', async (req, res, next) => {
	try {
		const user = await users.findOne({ code: req.body.code });

		if (!user)
			throw 'code existiert nicht';

		const data = { ...req.body, submittedBy: user.id };
		delete data.code;

		await quotes.updateOne(
			{ _id: new mongoose.Types.ObjectId() },
			{ $set: data },
			{ upsert: true, unique: true }
		);

		res.status(200).json({ message: 'successfully submitted quote' });
	} catch (error) {
		next(error)
	}
});

router.get('/', async (req, res, next) => {
	try {
		const limit = req.body?.num ?? 10;
		const query = await quotes.aggregate([
			{ $limit: limit },
			{ $lookup: {
				from: 'users',
				localField: 'submittedBy',
				foreignField: '_id',
				as: 'submittedBy'
			} },
			{ $unwind: '$submittedBy' },
			{ $project: {
				_id: '$_id',
				submittedBy: '$submittedBy.name',
				messages: '$messages'
			}}
		]);

		res.status(200).json(query);
	} catch (error) {
		next(error)
	}
});

export default router;
