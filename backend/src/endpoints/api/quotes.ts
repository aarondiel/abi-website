import { Router } from 'express'
import quotes from '../../models/quotes'
import users from '../../models/users'
import { Types } from 'mongoose'

const router = Router()

router.post('/', async (req, res, _next) => {
	const user = await users.findOne({ code: req.cookies.code })

	if (!user)
		// console.error('code existiert nicht')
		return res.status(404).json({ message: 'user does not exist' })

	const data = { ...req.body, submittedBy: user.id }

	await quotes.updateOne(
		{ _id: new Types.ObjectId() },
		{ $set: data },
		{ upsert: true }
	)

	res.status(200).json({ message: 'successfully submitted quote' })
})

router.get('/', async (req, res, _next) => {
	const limit = parseInt(req.query?.limit?.toString() ?? '') ?? 10
	const offset = parseInt(req.query?.offset?.toString() ?? '') ?? 0

	const query = await quotes.find()
		.sort({ createdAt: -1 })
		.skip(offset)
		.limit(limit)
		.populate('submittedBy')

	res.status(200).json(query)
})

export default router
