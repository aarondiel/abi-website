import { Router } from 'express'
import users from '../models/users'
import jwt from 'jsonwebtoken'
import config from '../../config'
import { assert_privilege } from '../lib/middleware'

const route = Router()

route.get('/', assert_privilege(), async (_req, res, _next) => {
	res
		.status(200)
		.json(res.locals.user)
})

route.post('/', async (req, res, _next) => {
	const user = await users.findOne(
		{ code: req.body.code },
		[ '-_id', 'name', 'privileges' ]
	)

	if (user === null)
		return res.sendStatus(401)


	const token = jwt.sign(user.toJSON(), config.jwt.access_token)

	res
		.status(200)
		.send(token)
})

export default route
