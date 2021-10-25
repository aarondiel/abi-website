import { Router } from 'express'
import users from '../models/users'
import jwt from 'jsonwebtoken'
import config from '../../config'

const router = Router()

router.post('/', async (req, res, _next) => {
	const user = await users.findOne(
		{ code: req.body.code },
		[ '-_id', 'name', 'privileges' ]
	)

	if (user === null)
		return res
			.status(401)
			.json({ message: 'user not found' })


	const token = jwt.sign(user.toJSON(), config.jwt.access_token)

	res
		.status(200)
		.send(token)
})

export default router
