import { Router } from 'express';
const router = Router();
import gbrVote from '../../../models/gbr-vote.js';
import users from '../../../models/user.js';

router.post('/', async (req, res) => {
	try {
		const user = await users.findOne({ code: req.body.code });

		if (!user)
			throw 'code existiert nicht'

		if (!user.gbr)
			throw 'du hast den gbr vertrag nicht unterschieben'

		let data = { ...req.body };
		delete data.code;

		await gbrVote.updateOne(
			{ user: user.id },
			{ $set: data },
			{ upsert: true }
		)

		res.status(200).json({ message: 'erfolgreich abgestimmt'});
	} catch (error) {
		next(error)
	}
});

export default router;
