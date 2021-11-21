import { Router } from 'express'
import jwt from 'jsonwebtoken'
import users from '@/models/users'
import { assert_privilege } from '@/lib/middleware'
import config from '@/config'

const route = Router()

route.get('/', assert_privilege(), async (_req, res, _next) => {
	return res
		.cookie('token', res.locals.user.token, {
			expires: new Date(Date.now() + 60 * 24 * 60 * 60),
			sameSite: 'strict'
		})
		.json(res.locals.user)
})

route.post('/', async (req, res, _next) => {
	const user = await users.findOne(
		{ code: req.body.code },
		[ 'name', 'privileges' ]
	)

	if (user === null)
		return res.sendStatus(401)

	const token = jwt.sign(
		user.toJSON(),
		config.jwt.access_token
	)

	return res
		.status(200)
		.cookie('token', token, {
			expires: new Date(Date.now() + 60 * 24 * 60 * 60),
			sameSite: 'strict'
		})
		.send(token)
})

export default route
