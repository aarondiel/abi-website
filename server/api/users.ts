import { Router } from 'express'
import users from '../models/users'
import { mongoose_error_handler } from '../lib/middleware'

const router = Router()

router.get('/:code', async (req, res, _next) => {
	const user = await users.findById(req.params.code)

	if (user === null)
		return res
			.status(404)
			.json({ message: 'user not found' })

	res
		.status(200)
		.json(user)
})

// todo: admin middleware
router.post('/', async (req, res, _next) => {
	await users.create({
		name: req.body.name,
		email: req.body.email,
		gbr: req.body.gbr,
		code: req.body.code
	})

	res
		.status(200)
		.json({ message: 'user created' })
}, mongoose_error_handler)

export default router
