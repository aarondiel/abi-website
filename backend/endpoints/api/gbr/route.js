import { Router } from 'express';
const router = Router();
import gbrVote from '../../../models/gbr-vote.js';
import users from '../../../models/user.js';

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

	let data = { ...req.body };
	delete data.code;

	gbrVote.updateOne(
		{ user: user.id },
		{ $set: data },
		{ upsert: true }
	).then(response => {
		res.status(200).json(response);
	}).catch(err => {
		// collect every validation error
		const message = Object.values(err.errors).map(v => v.message);

		res.status(400).json({ message: message[0] });
	})
});

export default router;
