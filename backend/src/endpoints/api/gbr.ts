import { Router } from 'express'
import gbrVotes from '../../models/gbr-votes'
import users from '../../models/users'

const router = Router()

router.post('/', async (req, res, _next) => {
	const user = await users.findOne({ code: req.cookies.code })

	if (!user)
		// throw 'code existiert nicht'
		return res.status(400).json({ message: 'code existiert nicht' })

	if (!user.gbr)
		return res.status(400).json({ message: 'du hast den gbr vertrag nicht unterschriben' })

	await gbrVotes.updateOne(
		{ user: user.id },
		{ $set: { ...req.body } },
		{ upsert: true }
	)

	res.status(200).json({ message: 'erfolgreich abgestimmt'})
})

export default router
