import { Router } from 'express'
import users, { privileges } from '../models/users'
import { assert_privilege, mongoose_error_handler } from '../lib/middleware'

const route = Router()

route.param('code', async (_req, res, next, value) => {
	const user = await users.findOne({ code: value })

	if (user === null)
		return res
			.status(404)
			.json({ message: 'user not found' })

	res.locals.target_user = user
	next()
})

route.get('/:code', assert_privilege('get_users'), async (_req, res, _next) => {
	res
		.status(200)
		.json(res.locals.target_user)
})

// todo: admin middleware
route.post('/', assert_privilege('create_users'), async (req, res, _next) => {
	await users.create({
		name: req.body.name,
		email: req.body.email,
		gbr: req.body.gbr,
		code: req.body.code,
		privileges: req.body.privileges
	})

	res.sendStatus(200)
}, mongoose_error_handler)

route.post('/:code/add_privilege', assert_privilege('create_users'), async (req, res, _next) => {
	if (!privileges.includes(req.body.privilege))
		return res.status(400).send('privilege not valid')

	await users.findByIdAndUpdate(res.locals.target_user, { $push: {
		privileges: req.body.privilege
	}})

	res.sendStatus(200)
}, mongoose_error_handler)

export default route
