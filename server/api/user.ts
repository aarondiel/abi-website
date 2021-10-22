import { Router } from 'express'
import users from '../models/users'

const router = Router()

router.get('/', async (req, res, _next) => {
	const user = await users.findById(req.body.code)

	if (user === null)
		return res
			.status(404)
			.json({ message: 'user not found' })

	res
		.status(200)
		.json(user)
})

export default router
